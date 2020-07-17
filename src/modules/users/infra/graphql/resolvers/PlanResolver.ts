/* eslint-disable import/prefer-default-export */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable max-classes-per-file */
import {
  Resolver,
  Mutation,
  Arg,
  Query,
  InputType,
  Field,
  Int,
  Float,
} from 'type-graphql';
import Plan from '../../typeorm/entities/Plan';

@InputType()
export class PlanInput {
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

@InputType()
export class PlanUpdateInput {
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

@Resolver()
export class PlanResolver {
  @Mutation(() => Plan)
  async createPlan(@Arg('options', () => PlanInput) options: PlanInput) {
    const plan = await Plan.create(options).save();
    return plan;
  }

  @Mutation(() => Plan)
  async updatePlan(
    @Arg('id', () => String) id: string,
    @Arg('input', () => PlanUpdateInput) input: PlanUpdateInput,
  ) {
    await Plan.update({ id }, input);
    return Plan.findOne(id);
  }

  @Mutation(() => Boolean)
  async deletePlan(@Arg('id', () => String) id: string) {
    await Plan.delete({ id });
    return true;
  }

  @Query(() => [Plan])
  plans() {
    return Plan.find();
  }
}
