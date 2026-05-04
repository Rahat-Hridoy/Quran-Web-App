import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Surah } from '../entities/surah.entity';
import { Ayah } from '../entities/ayah.entity';
import { Translation } from '../entities/translation.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Surah)
    private surahRepository: Repository<Surah>,
    @InjectRepository(Ayah)
    private ayahRepository: Repository<Ayah>,
    @InjectRepository(Translation)
    private translationRepository: Repository<Translation>,
  ) {}

  async onApplicationBootstrap() {
    await this.seed();
  }

  async seed() {
    const count = await this.surahRepository.count();
    if (count > 0) {
      console.log('Database already seeded. Skipping...');
      return;
    }

    const enPath = path.join(__dirname, '..', 'data', 'quran_en.json');
    const bnPath = path.join(__dirname, '..', 'data', 'quran_bn.json');

    if (!fs.existsSync(enPath)) {
      console.error(`English seed data not found at ${enPath}`);
      return;
    }

    const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
    
    console.log('Seeding English data and Surah metadata...');
    for (const s of enData) {
      const surah = this.surahRepository.create({
        number: s.id,
        name_arabic: s.name,
        name_english: s.transliteration,
        total_ayahs: s.total_verses,
        revelation_place: s.type,
      });

      const savedSurah = await this.surahRepository.save(surah);

      const ayahEntities = s.verses.map((v: any) => {
        return this.ayahRepository.create({
          surah_id: savedSurah.id,
          ayah_number: v.id,
          text_arabic: v.text,
          translation_en: v.translation,
        });
      });
      
      await this.ayahRepository.save(ayahEntities);
    }

    if (fs.existsSync(bnPath)) {
      console.log('Updating with Bangla data...');
      const bnData = JSON.parse(fs.readFileSync(bnPath, 'utf8'));
      
      for (const s of bnData) {
        // Find surah by number
        const surah = await this.surahRepository.findOne({ where: { number: s.id } });
        if (!surah) continue;

        for (const v of s.verses) {
          await this.ayahRepository.update(
            { surah_id: surah.id, ayah_number: v.id },
            { translation_bn: v.translation }
          );
        }
      }
    }

    console.log('Seeding completed successfully!');
  }
}
