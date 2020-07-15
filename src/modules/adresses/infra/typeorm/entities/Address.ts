import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
} from 'typeorm';

import { Field, ObjectType, GraphQLISODateTime } from 'type-graphql';

@ObjectType()
@Entity('address')
class Address extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  country: string;

  @Field()
  @Column()
  state: string;

  @Field()
  @Column()
  postal_code: string;

  @Field()
  @Column()
  neighborhood: string;

  @Field()
  @Column()
  sub_neighborhood: string;

  @Field()
  @Column()
  address: string;

  @Field()
  @Column()
  number: string;

  @Field()
  @Column()
  complement: string;

  @Field()
  @Column()
  description: string;

  @Field(() => GraphQLISODateTime)
  @CreateDateColumn()
  created_at: Date;

  @Field(() => GraphQLISODateTime)
  @UpdateDateColumn()
  updated_at: Date;
}

export default Address;
