import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import uploadConfig from '@config/upload';

import { Exclude, Expose } from 'class-transformer';
import Address from '@modules/adresses/infra/typeorm/entities/Address';

export type UserTypeEnum = 'adm' | 'advertiser' | 'user';

export type UserStatusEnum = 'new' | 'active' | 'inactive';

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

  @Column()
  @Exclude()
  address_id: string;

  @ManyToOne(() => Address, { eager: true })
  @JoinColumn({ name: 'address_id' })
  address: Address;

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
