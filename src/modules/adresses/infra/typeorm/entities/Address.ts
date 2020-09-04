import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
} from 'typeorm';

import { Field, ObjectType, GraphQLISODateTime, ID } from 'type-graphql';

@ObjectType()
@Entity('address')
class Address extends BaseEntity {
  @Field(() => ID)
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

  @Field({ nullable: true })
  @Column()
  sub_neighborhood: string;

  @Field()
  @Column()
  street: string;

  @Field({ nullable: true })
  @Column()
  number: string;

  @Field({ nullable: true })
  @Column()
  complement: string;

  @Field({ nullable: true })
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
