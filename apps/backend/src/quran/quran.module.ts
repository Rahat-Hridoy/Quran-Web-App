import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuranController } from './quran.controller';
import { QuranService } from './quran.service';
import { Surah } from '../entities/surah.entity';
import { Ayah } from '../entities/ayah.entity';
import { Translation } from '../entities/translation.entity';
import { AudioModule } from '../audio/audio.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Surah, Ayah, Translation]),
    AudioModule,
  ],
  controllers: [QuranController],
  providers: [QuranService],
})
export class QuranModule {}
