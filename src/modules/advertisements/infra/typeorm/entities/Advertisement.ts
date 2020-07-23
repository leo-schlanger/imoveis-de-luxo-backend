import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  BaseEntity,
} from 'typeorm';

import {
  registerEnumType,
  ObjectType,
  Field,
  ID,
  GraphQLISODateTime,
} from 'type-graphql';

import { Exclude } from 'class-transformer';
import Property from '@modules/properties/infra/typeorm/entities/Property';
import User from '@modules/users/infra/typeorm/entities/User';
import Media from './Media';

export enum AdvertisementTypeEnum {
  PURCHASE = 'purchase',
  TENANCY = 'tenancy',
}

registerEnumType(AdvertisementTypeEnum, {
  name: 'AdvertisementTypeEnum',
  description: 'Advertisements type.',
});

@ObjectType()
@Entity('advertisements')
class Advertisement extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Exclude()
  property_id: string;

  @Field(() => Property)
  @ManyToOne(() => Property, { eager: true })
  @JoinColumn({ name: 'property_id' })
  property: Property;

  @Column()
  @Exclude()
  user_id: string;

  @Field(() => User)
  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Field()
  @Column()
  title: string;

  @Field()
  @Column()
  description: string;

  @Field(() => Boolean)
  @Column(() => Boolean)
  address_visible: boolean;

  @Field(() => Boolean)
  @Column(() => Boolean)
  status: boolean;

  @Field(() => AdvertisementTypeEnum)
  @Column('enum', { name: 'type' })
  type: AdvertisementTypeEnum;

  @Field(() => [Media])
  @OneToMany(() => Media, media => media.advertisement, { eager: true })
  gallery: Media[];

  @Field(() => GraphQLISODateTime)
  @CreateDateColumn()
  created_at: Date;

  @Field(() => GraphQLISODateTime)
  @UpdateDateColumn()
  updated_at: Date;
}

export default Advertisement;
