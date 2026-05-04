import { Entity, Column, PrimaryGeneratedColumn, OneToMany, Index } from 'typeorm';
import { Ayah } from './ayah.entity';

@Entity('surahs')
export class Surah {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index()
  @Column()
  number!: number;

  @Column()
  name_arabic!: string;

  @Column()
  name_english!: string;

  @Column()
  total_ayahs!: number;

  @Column()
  revelation_place!: string;

  @Column({ nullable: true })
  name_translation?: string;

  @OneToMany(() => Ayah, (ayah) => ayah.surah)
  ayahs!: Ayah[];
}
