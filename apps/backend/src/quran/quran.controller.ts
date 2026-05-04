import { Controller, Get, Param, Query, ParseIntPipe, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { QuranService } from './quran.service';

@Controller('quran')
@UseInterceptors(CacheInterceptor)
export class QuranController {
  constructor(private readonly quranService: QuranService) {}

  @Get('surahs')
  async getAllSurahs() {
    return this.quranService.findAllSurahs();
  }

  @Get('surah/:id')
  async getSurah(@Param('id', ParseIntPipe) id: number) {
    return this.quranService.findSurahById(id);
  }

  @Get('surah/:id/ayahs')
  async getAyahs(
    @Param('id', ParseIntPipe) id: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    // Ensure numeric values for page and limit
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;
    
    return this.quranService.findAyahsBySurah(id, pageNum, limitNum);
  }

  @Get('surah/:id/audio')
  async getSurahAudio(@Param('id', ParseIntPipe) id: number) {
    return this.quranService.getAllAudioForSurah(id);
  }
}
