import { Resolver, Mutation, Arg, Query } from 'type-graphql';

import Plan from '../../typeorm/entities/Plan';
import PlanInput from '../inputs/PlanInput';
import PlanUpdateInput from '../inputs/PlanUpdateInput';

@Resolver()
export default class PlanResolver {
  @Mutation(() => Plan)
  async createPlan(
    @Arg('data', () => PlanInput) data: PlanInput,
  ): Promise<Plan> {
    const plan = await Plan.create(data).save();
    return plan;
  }

  @Mutation(() => Plan)
  async updatePlan(
    @Arg('id', () => String) id: string,
    @Arg('data', () => PlanUpdateInput) data: PlanUpdateInput,
  ): Promise<Plan | undefined> {
    await Plan.update({ id }, data);
    return Plan.findOne(id);
  }

  @Mutation(() => Boolean)
  async deletePlan(@Arg('id', () => String) id: string): Promise<boolean> {
    await Plan.delete({ id });
    return true;
  }

  @Query(() => [Plan])
  plans(): Promise<Plan[]> {
    return Plan.find();
  }
}
