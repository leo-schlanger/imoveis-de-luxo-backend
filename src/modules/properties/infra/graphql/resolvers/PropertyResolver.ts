import { Resolver, Mutation, Arg, Query } from 'type-graphql';
import { container } from 'tsyringe';
import CreatePropertyService from '@modules/properties/services/properties/CreatePropertyService';
import UpdatePropertyService from '@modules/properties/services/properties/UpdatePropertyService';
import DeletePropertyService from '@modules/properties/services/properties/DeletePropertyService';
import Property from '../../typeorm/entities/Property';
import PropertyInput from '../inputs/PropertyInput';
import PropertyUpdateInput from '../inputs/PropertyUpdateInput';

@Resolver()
export default class PropertyResolver {
  @Mutation(() => Property)
  async createProperty(
    @Arg('data', () => PropertyInput) data: PropertyInput,
  ): Promise<Property> {
    const createProperty = container.resolve(CreatePropertyService);
    const property = await createProperty.execute(data);
    return property;
  }

  @Mutation(() => Property)
  async updateProperty(
    @Arg('id', () => String) id: string,
    @Arg('data', () => PropertyUpdateInput) data: PropertyUpdateInput,
  ): Promise<Property | undefined> {
    const updateProperty = container.resolve(UpdatePropertyService);
    const updatedProperty = updateProperty.execute({
      property_id: id,
      ...data,
    });
    return updatedProperty;
  }

  @Mutation(() => Boolean)
  async deleteProperty(@Arg('id', () => String) id: string): Promise<boolean> {
    const deleteProperty = container.resolve(DeletePropertyService);
    await deleteProperty.execute({ id });
    return true;
  }

  @Query(() => [Property])
  properties(): Promise<Property[]> {
    return Property.find();
  }
}
