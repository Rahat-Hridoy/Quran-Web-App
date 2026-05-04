import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AudioService {
  constructor(private configService: ConfigService) {}

  generateAudioUrl(surahNumber: number, ayahNumber: number): string {
    const baseUrl = this.configService.get<string>(
      'AUDIO_BASE_URL',
      'https://everyayah.com/data/Abdul_Basit_Murattal_64kbps/',
    );
    const surahStr = surahNumber.toString().padStart(3, '0');
    const ayahStr = ayahNumber.toString().padStart(3, '0');
    return `${baseUrl}${surahStr}${ayahStr}.mp3`;
  }
}
