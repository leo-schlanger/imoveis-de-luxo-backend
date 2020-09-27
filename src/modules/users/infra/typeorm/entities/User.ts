/* eslint-disable no-shadow */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  BaseEntity,
} from 'typeorm';
import {
  Field,
  ObjectType,
  registerEnumType,
  ID,
  GraphQLISODateTime,
} from 'type-graphql';

import uploadConfig from '@config/upload';

import { Exclude, Expose } from 'class-transformer';
import Address from '@modules/adresses/infra/typeorm/entities/Address';
import Plan from './Plan';

export enum UserTypeEnum {
  ADM = 'adm',
  ADVERTISER = 'advertiser',
  USER = 'user',
}

registerEnumType(UserTypeEnum, {
  name: 'UserTypeEnum',
  description: 'Users type.',
});

export enum UserStatusEnum {
  NEW = 'new',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

registerEnumType(UserStatusEnum, {
  name: 'UserStatusEnum',
  description: 'Users status.',
});

@ObjectType()
@Entity('users')
class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;

  @Field({ nullable: true })
  @Column()
  responsible: string;

  @Field({ nullable: true })
  @Column()
  description: string;

  @Field({ nullable: true })
  @Column()
  creci: string;

  @Field()
  @Column()
  email: string;

  @Field()
  @Column()
  phone: string;

  @Field({ nullable: true })
  @Column()
  secondary_phone: string;

  @Field(() => UserStatusEnum, { defaultValue: UserStatusEnum.NEW })
  @Column('enum', { name: 'status', default: UserStatusEnum.NEW })
  status: UserStatusEnum;

  @Field(() => UserTypeEnum)
  @Column('enum', { name: 'type' })
  type: UserTypeEnum;

  @Column()
  @Exclude()
  password: string;

  @Field({ nullable: true })
  @Column()
  avatar: string;

  @Column()
  @Exclude()
  address_id: string;

  @Field(() => Address, { nullable: true })
  @ManyToOne(() => Address, { eager: true })
  @JoinColumn({ name: 'address_id' })
  address: Address;

  @Column()
  @Exclude()
  plan_id: string;

  @Field(() => Plan, { nullable: true })
  @ManyToOne(() => Plan, { eager: true })
  @JoinColumn({ name: 'plan_id' })
  plan: Plan;

  @Field(() => Boolean, { defaultValue: false })
  @Column(() => Boolean)
  plan_status: boolean;

  @Field(() => GraphQLISODateTime)
  @CreateDateColumn()
  created_at: Date;

  @Field(() => GraphQLISODateTime)
  @UpdateDateColumn()
  updated_at: Date;

  @Field({ nullable: true })
  avatar_url: string;

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
