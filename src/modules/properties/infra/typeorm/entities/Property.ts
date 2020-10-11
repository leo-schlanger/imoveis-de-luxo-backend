import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  BaseEntity,
  OneToMany,
} from 'typeorm';
import {
  Field,
  ObjectType,
  GraphQLISODateTime,
  Float,
  registerEnumType,
  ID,
} from 'type-graphql';

import Address from '@modules/adresses/infra/typeorm/entities/Address';
import { Exclude } from 'class-transformer';
import PropertyExtraFieldValue from './PropertyExtraFieldValue';

export enum PropertyTypeEnum {
  HOME = 'home',
  APARTMENT = 'apartment',
  PENTHOUSE = 'penthouse',
  GRANGE = 'grange',
  FARM = 'farm',
  TERRAIN = 'terrain',
  SHED = 'shed',
  CORPORATE = 'corporate',
  OFFICE = 'office',
  STORE = 'store',
  HOTEL = 'hotel',
  INN = 'inn',
  ISLAND = 'island',
  CUSTOMIZED = 'customized',
}

registerEnumType(PropertyTypeEnum, {
  name: 'PropertyTypeEnum',
  description: 'Properties type.',
});

@ObjectType()
@Entity('properties')
class Property extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  @Exclude()
  address_id: string;

  @Field(() => Address)
  @ManyToOne(() => Address, { eager: true })
  @JoinColumn({ name: 'address_id' })
  address: Address;

  @Field(() => PropertyTypeEnum)
  @Column('enum', { name: 'type' })
  type: PropertyTypeEnum;

  @Field(() => Float)
  @Column('decimal', { scale: 2 })
  value: number;

  @Field(() => [PropertyExtraFieldValue])
  @OneToMany(
    () => PropertyExtraFieldValue,
    propertyExtraFieldValue => propertyExtraFieldValue.property_id,
    { eager: true },
  )
  extraFieldValues: PropertyExtraFieldValue[];

  @Field(() => GraphQLISODateTime)
  @CreateDateColumn()
  created_at: Date;

  @Field(() => GraphQLISODateTime)
  @UpdateDateColumn()
  updated_at: Date;
}

export default Property;
