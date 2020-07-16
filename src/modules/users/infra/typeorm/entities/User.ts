import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Field, GraphQLTimestamp, ObjectType } from 'type-graphql';

import uploadConfig from '@config/upload';

import { Exclude, Expose } from 'class-transformer';
import Address from '@modules/adresses/infra/typeorm/entities/Address';
import Plan from './Plan';

export enum UserTypeEnum {
  ADM = 'adm',
  ADVERTISER = 'advertiser',
  USER = 'user',
}

export enum UserStatusEnum {
  NEW = 'new',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

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

  @Column()
  @Exclude()
  plan_id: string;

  @ManyToOne(() => Plan, { eager: true })
  @JoinColumn({ name: 'plan_id' })
  plan: Plan;

  @Column()
  plan_status: boolean;

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
