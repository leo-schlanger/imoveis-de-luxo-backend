import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import uploadConfig from '@config/upload';

import { Exclude, Expose } from 'class-transformer';

export type UserTypeEnum = 'adm' | 'anunciante' | 'usuario';

export type UserStatusEnum = 'novo' | 'ativo' | 'inativo';

@Entity('users')
class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  responsible: string;

  @Column()
  description: string;

  @Column()
  creci: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  secondary_phone: string;

  @Column('enum', { name: 'status' })
  status: UserStatusEnum;

  @Column('enum', { name: 'type' })
  type: UserTypeEnum;

  @Column()
  @Exclude()
  password: string;

  @Column()
  avatar: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Expose({ name: 'avatar_url' })
  getAvatarUrl(): string | null {
    if (!this.avatar) {
      return null;
    }

    switch (uploadConfig.driver) {
      case 'disk':
        return `${process.env.APP_API_URL}/files/${this.avatar}`;
      case 's3':
        return `https://${uploadConfig.config.aws.bucket}.s3.amazonaws.com/${this.avatar}`;
      default:
        return null;
    }
  }
}

export default User;
