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

    const enPath = path.join(__dirname, 'data', 'quran_en.json');
    const bnPath = path.join(__dirname, 'data', 'quran_bn.json');

    if (!fs.existsSync(enPath)) {
      console.error(`❌ Seed data not found at ${enPath}`);
      process.exit(1);
    }

    console.log('📖 Reading quran_en.json...');
    const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));

    console.log('🧹 Clearing existing data...');
    await translationRepo.clear();
    await ayahRepo.clear();
    await surahRepo.clear();

    console.log('🌱 Seeding English data and Surah metadata...');
    for (const s of enData) {
      // Ensure numeric types
      const surahNumber = typeof s.id === 'string' ? parseInt(s.id, 10) : s.id;
      const totalAyahs = typeof s.total_verses === 'string' ? parseInt(s.total_verses, 10) : s.total_verses;

      const surah = surahRepo.create({
        number: surahNumber,
        name_arabic: s.name,
        name_english: s.transliteration,
        total_ayahs: totalAyahs,
        revelation_place: s.type,
        name_translation: s.translation,
      });

      const savedSurah = await surahRepo.save(surah);
      console.log(`✅ Saved Surah ${surahNumber}: ${savedSurah.name_english}`);

      const ayahEntities = s.verses.map((v: any) => ({
        surah_id: savedSurah.id,
        ayah_number: typeof v.id === 'string' ? parseInt(v.id, 10) : v.id,
        text_arabic: v.text,
        translation_en: v.translation,
      }));

      // Batch insert ayahs for performance
      const chunkSize = 100;
      for (let i = 0; i < ayahEntities.length; i += chunkSize) {
        await ayahRepo.insert(ayahEntities.slice(i, i + chunkSize));
      }
    }

    if (fs.existsSync(bnPath)) {
      console.log('📖 Reading quran_bn.json...');
      const bnData = JSON.parse(fs.readFileSync(bnPath, 'utf8'));
      
      console.log('🌱 Seeding Bangla data...');
      for (const s of bnData) {
        const surahNumber = typeof s.id === 'string' ? parseInt(s.id, 10) : s.id;
        const surah = await surahRepo.findOne({ where: { number: surahNumber } });
        if (!surah) continue;

        for (const v of s.verses) {
          const ayahNumber = typeof v.id === 'string' ? parseInt(v.id, 10) : v.id;
          await ayahRepo.update(
            { surah_id: surah.id, ayah_number: ayahNumber },
            { translation_bn: v.translation }
          );
        }
      }
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
