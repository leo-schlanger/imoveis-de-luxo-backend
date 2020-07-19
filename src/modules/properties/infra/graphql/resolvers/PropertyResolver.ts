import { Resolver, Mutation, Arg, Query } from 'type-graphql';

import Address from '@modules/adresses/infra/typeorm/entities/Address';

import Property from '../../typeorm/entities/Property';
import PropertyInput from '../inputs/PropertyInput';
import PropertyUpdateInput from '../inputs/PropertyUpdateInput';

@Resolver()
export default class PropertyResolver {
  @Mutation(() => Property)
  async createProperty(
    @Arg('data', () => PropertyInput) data: PropertyInput,
  ): Promise<Property> {
    const address = await Address.create(data.address).save();
    const property = await Property.create({
      ...data,
      address,
      address_id: address.id,
    }).save();
    return property;
  }

  @Mutation(() => Property)
  async updateProperty(
    @Arg('id', () => String) id: string,
    @Arg('data', () => PropertyUpdateInput) data: PropertyUpdateInput,
  ): Promise<Property | undefined> {
    await Property.update({ id }, data);
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
