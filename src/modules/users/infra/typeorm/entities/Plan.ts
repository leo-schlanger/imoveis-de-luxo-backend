import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
} from 'typeorm';
import {
  Field,
  ObjectType,
  Float,
  Int,
  GraphQLISODateTime,
} from 'type-graphql';

@ObjectType()
@Entity('plans')
class Plan extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  description: string;

  @Field(() => Int)
  @Column()
  quantity_properties: number;

  @Field(() => Int)
  @Column()
  quantity_photos: number;

  @Field(() => Int)
  @Column()
  quantity_videos: number;

  @Field(() => Float)
  @Column('decimal', { scale: 2 })
  value: number;

  @Field(() => GraphQLISODateTime)
  @CreateDateColumn()
  created_at: Date;

  @Field(() => GraphQLISODateTime)
  @UpdateDateColumn()
  updated_at: Date;
}

export default Plan;
