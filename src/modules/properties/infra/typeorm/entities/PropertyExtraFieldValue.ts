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
import { Field, ObjectType, GraphQLISODateTime, ID } from 'type-graphql';
import { Exclude } from 'class-transformer';
import ExtraField from './ExtraField';
import Property from './Property';

@ObjectType()
@Entity('properties_extra_fields')
class PropertyExtraFieldValue extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  property_id: string;

  @Field(() => Property)
  @ManyToOne(() => Property)
  @JoinColumn({ name: 'property_id' })
  @Exclude()
  Property: Property;

  @Field()
  @Column()
  @Exclude()
  extra_field_id: string;

  @Field(() => ExtraField)
  @ManyToOne(() => ExtraField, { eager: true })
  @JoinColumn({ name: 'extra_field_id' })
  extraField: ExtraField;

  @Field()
  @Column()
  value: string;

  @Field(() => GraphQLISODateTime)
  @CreateDateColumn()
  created_at: Date;

  @Field(() => GraphQLISODateTime)
  @UpdateDateColumn()
  updated_at: Date;
}

export default PropertyExtraFieldValue;
