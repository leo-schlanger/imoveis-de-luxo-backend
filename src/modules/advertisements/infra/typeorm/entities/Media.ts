import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import uploadConfig from '@config/upload';

import { Expose } from 'class-transformer';

export type MediaTypeEnum = 'photo' | 'video';

@Entity('media')
class Media {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  advertisement_id: string;

  @Column()
  filename: string;

  @Column('enum', { name: 'type' })
  type: MediaTypeEnum;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Expose({ name: 'url' })
  getMediaUrl(): string {
    switch (uploadConfig.driver) {
      case 'disk':
        return `${process.env.APP_API_URL}/files/${this.filename}`;
      case 's3':
        return `https://${uploadConfig.config.aws.bucket}.s3.amazonaws.com/${this.filename}`;
      default:
        return this.filename;
    }
  }
}

export default Media;
