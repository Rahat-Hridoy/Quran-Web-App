import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Surah } from '../entities/surah.entity';
import { Ayah } from '../entities/ayah.entity';
import { PaginatedResponseDto } from '../common/dto/pagination-response.dto';
import { AudioService } from '../audio/audio.service';

@Injectable()
export class QuranService {
  constructor(
    @InjectRepository(Surah)
    private surahRepository: Repository<Surah>,
    @InjectRepository(Ayah)
    private ayahRepository: Repository<Ayah>,
    private audioService: AudioService,
  ) {}

  async findAllSurahs(): Promise<Surah[]> {
    return this.surahRepository.find({
      order: { number: 'ASC' },
    });
  }

  async findAyahsBySurah(
    surahId: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedResponseDto<Ayah & { audio_url: string }>> {
    const surah = await this.findSurahById(surahId);
    const skip = (page - 1) * limit;

    const queryBuilder = this.ayahRepository
      .createQueryBuilder('ayah')
      .where('ayah.surah_id = :surahId', { surahId })
      .orderBy('ayah.ayah_number', 'ASC')
      .skip(skip)
      .take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    const dataWithAudio = data.map((ayah) => ({
      ...ayah,
      audio_url: this.audioService.generateAudioUrl(surah.number, ayah.ayah_number),
    }));

    const last_page = Math.ceil(total / limit);

    return {
      metadata: {
        total,
        page,
        last_page,
      },
      data: dataWithAudio,
    };
  }

  async getAllAudioForSurah(surahId: number): Promise<{ ayah_number: number; audio_url: string }[]> {
    const surah = await this.findSurahById(surahId);
    const ayahs = await this.ayahRepository.find({
      where: { surah_id: surahId },
      order: { ayah_number: 'ASC' },
      select: ['ayah_number'],
    });

    return ayahs.map((ayah) => ({
      ayah_number: ayah.ayah_number,
      audio_url: this.audioService.generateAudioUrl(surah.number, ayah.ayah_number),
    }));
  }

  async findSurahById(id: number): Promise<Surah> {
    const surah = await this.surahRepository.findOne({ where: { id } });
    if (!surah) {
      throw new NotFoundException(`Surah with ID ${id} not found`);
    }
    return surah;
  }
}
