import { InputType, Field, Int, Float } from 'type-graphql';

@InputType()
export default class PlanInput {
  @Field()
  name: string;

  @Field({ nullable: true })
  description: string;

  @Field(() => Int)
  quantity_properties: number;

  @Field(() => Int)
  quantity_photos: number;

  @Field(() => Int)
  quantity_videos: number;

  @Field(() => Float)
  value: number;
}
