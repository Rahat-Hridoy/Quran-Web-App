import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { Surah } from '../entities/surah.entity';
import { Ayah } from '../entities/ayah.entity';
import { Translation } from '../entities/translation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Surah, Ayah, Translation])],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
