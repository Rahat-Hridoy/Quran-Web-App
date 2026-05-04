import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Ayah } from './ayah.entity';

@Entity('translations')
export class Translation {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index()
  @Column()
  ayah_id!: number;

  @Column()
  language!: string;

  @Column('text')
  text_translation!: string;

  @ManyToOne(() => Ayah, (ayah) => ayah.translations)
  @JoinColumn({ name: 'ayah_id' })
  ayah!: Ayah;
}
