import { DataSource } from 'typeorm';
import { Surah } from './entities/surah.entity';
import { Ayah } from './entities/ayah.entity';
import { Translation } from './entities/translation.entity';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

async function seed() {
  const dataSource = new DataSource({
    type: 'sqlite',
    database: process.env.DATABASE_NAME || 'quran.db',
    entities: [Surah, Ayah, Translation],
    synchronize: true,
  });

  try {
    await dataSource.initialize();
    console.log('🚀 Database initialized');

    const surahRepo = dataSource.getRepository(Surah);
    const ayahRepo = dataSource.getRepository(Ayah);
    const translationRepo = dataSource.getRepository(Translation);

    const dataPath = path.join(__dirname, 'data', 'quran.json');
    if (!fs.existsSync(dataPath)) {
      console.error(`❌ Seed data not found at ${dataPath}`);
      process.exit(1);
    }

    console.log('📖 Reading quran.json...');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const quranData = JSON.parse(rawData);

    // Fetch Surah metadata from AlQuran API
    console.log('🌐 Fetching surah metadata...');
    const response = await fetch('https://api.alquran.cloud/v1/surah');
    const metadataResult = await response.json() as any;
    const surahsMetadata = metadataResult.data;

    console.log('🧹 Clearing existing data...');
    await translationRepo.clear();
    await ayahRepo.clear();
    await surahRepo.clear();

    console.log('🌱 Seeding database...');

    for (const surahMeta of surahsMetadata) {
      const surahNumber = surahMeta.number;
      const ayahsInJson = quranData[surahNumber.toString()];

      if (!ayahsInJson) {
        console.warn(`⚠️ Surah ${surahNumber} (${surahMeta.englishName}) not found in JSON data`);
        continue;
      }

      const surah = surahRepo.create({
        number: surahNumber,
        name_arabic: surahMeta.name,
        name_english: surahMeta.englishName,
        total_ayahs: surahMeta.numberOfAyahs,
        revelation_place: surahMeta.revelationType,
      });

      const savedSurah = await surahRepo.save(surah);
      console.log(`✅ Saved Surah ${surahNumber}: ${savedSurah.name_english}`);

      const ayahEntities = ayahsInJson.map((a: any) => ({
        surah_id: savedSurah.id,
        ayah_number: a.verse,
        text_arabic: a.text,
      }));

      // Batch insert ayahs for performance
      await ayahRepo.insert(ayahEntities);
    }

    console.log('✨ Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  } finally {
    await dataSource.destroy();
  }
}

seed();
