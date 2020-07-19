import { InputType, Field, Int, Float } from 'type-graphql';

@InputType()
export default class PlanUpdateInput {
  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  description: string;

  @Field(() => Int, { nullable: true })
  quantity_properties: number;

  @Field(() => Int, { nullable: true })
  quantity_photos: number;

  @Field(() => Int, { nullable: true })
  quantity_videos: number;

  @Field(() => Float, { nullable: true })
  value: number;
}
