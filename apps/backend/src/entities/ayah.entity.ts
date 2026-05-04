import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, Index, JoinColumn } from 'typeorm';
import { Surah } from './surah.entity';
import { Translation } from './translation.entity';

@Entity('ayahs')
export class Ayah {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index()
  @Column()
  surah_id!: number;

  @Index()
  @Column()
  ayah_number!: number;

  @Column('text')
  text_arabic!: string;

  @Column('text', { nullable: true })
  translation_en!: string;

  @Column('text', { nullable: true })
  translation_bn!: string;

  @ManyToOne(() => Surah, (surah) => surah.ayahs)
  @JoinColumn({ name: 'surah_id' })
  surah!: Surah;

  @OneToMany(() => Translation, (translation) => translation.ayah)
  translations!: Translation[];
}
