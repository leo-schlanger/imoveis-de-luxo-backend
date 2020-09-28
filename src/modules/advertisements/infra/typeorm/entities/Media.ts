import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import uploadConfig from '@config/upload';

import { Expose } from 'class-transformer';
import {
  registerEnumType,
  ObjectType,
  Field,
  ID,
  GraphQLISODateTime,
} from 'type-graphql';
import Advertisement from './Advertisement';

export enum MediaTypeEnum {
  PHOTO = 'photo',
  VIDEO = 'video',
}

registerEnumType(MediaTypeEnum, {
  name: 'MediaTypeEnum',
  description: 'Medias to publish advertisement.',
});

@ObjectType()
@Entity('media')
class Media extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  advertisement_id: number;

  @ManyToOne(() => Advertisement, advertisement => advertisement.gallery)
  @JoinColumn({ name: 'advertisement_id' })
  advertisement: Advertisement;

  @Field()
  @Column()
  filename: string;

  @Field(() => MediaTypeEnum)
  @Column('enum', { name: 'type' })
  type: MediaTypeEnum;

  @Field(() => GraphQLISODateTime)
  @CreateDateColumn()
  created_at: Date;

  @Field(() => GraphQLISODateTime)
  @UpdateDateColumn()
  updated_at: Date;

  @Field({ nullable: true })
  url: string;

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
