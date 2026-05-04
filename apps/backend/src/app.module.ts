import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { Surah } from './entities/surah.entity';
import { Ayah } from './entities/ayah.entity';
import { Translation } from './entities/translation.entity';
import { SeedModule } from './seed/seed.module';
import { QuranModule } from './quran/quran.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 3600, // 1 hour
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.DATABASE_NAME || 'quran.db',
      entities: [Surah, Ayah, Translation],
      synchronize: true, // Only for development!
    }),
    SeedModule,
    QuranModule,
  ],
})
export class AppModule {}
