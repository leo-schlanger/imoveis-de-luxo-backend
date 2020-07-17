import { Resolver, Mutation, Arg, Query } from 'type-graphql';

import Address from '@modules/adresses/infra/typeorm/entities/Address';

import Property from '../../typeorm/entities/Property';
import PropertyInput from '../inputs/PropertyInput';
import PropertyUpdateInput from '../inputs/PropertyUpdateInput';

@Resolver()
export default class PropertyResolver {
  @Mutation(() => Property)
  async createProperty(
    @Arg('options', () => PropertyInput) options: PropertyInput,
  ): Promise<Property> {
    const address = await Address.create(options.address).save();
    const property = await Property.create({
      ...options,
      address,
      address_id: address.id,
    }).save();
    return property;
  }

  @Mutation(() => Property)
  async updateProperty(
    @Arg('id', () => String) id: string,
    @Arg('input', () => PropertyUpdateInput) input: PropertyUpdateInput,
  ): Promise<Property | undefined> {
    await Property.update({ id }, input);
    return Property.findOne(id);
  }

  @Mutation(() => Boolean)
  async deleteProperty(@Arg('id', () => String) id: string): Promise<boolean> {
    await Property.delete({ id });
    return true;
  }

  @Query(() => [Property])
  properties(): Promise<Property[]> {
    return Property.find();
  }
}
