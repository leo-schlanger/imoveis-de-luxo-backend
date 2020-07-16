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
  Float,
} from 'type-graphql';
import Address from '@modules/adresses/infra/typeorm/entities/Address';
import {
  AddressInput,
  AddressUpdateInput,
} from '@modules/adresses/infra/graphql/resolvers/AddressResolver';
import Property, { PropertyTypeEnum } from '../../typeorm/entities/Property';

@InputType()
class PropertyInput {
  @Field(() => AddressInput)
  address: AddressInput;

  @Field(() => PropertyTypeEnum)
  type: PropertyTypeEnum;

  @Field(() => Float)
  value: number;
}

@InputType()
class PropertyUpdateInput {
  @Field(() => AddressUpdateInput, { nullable: true })
  address: AddressUpdateInput;

  @Field(() => PropertyTypeEnum, { nullable: true })
  type: PropertyTypeEnum;

  @Field(() => Float, { nullable: true })
  value: number;
}

@Resolver()
export class PropertyResolver {
  @Mutation(() => Property)
  async createProperty(
    @Arg('options', () => PropertyInput) options: PropertyInput,
  ) {
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
  ) {
    await Property.update({ id }, input);
    return Property.findOne(id);
  }

  @Mutation(() => Boolean)
  async deleteProperty(@Arg('id', () => String) id: string) {
    await Property.delete({ id });
    return true;
  }

  @Query(() => [Property])
  properties() {
    return Property.find();
  }
}
