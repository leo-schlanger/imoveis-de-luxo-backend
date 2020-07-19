import { Resolver, Mutation, Arg, Query } from 'type-graphql';

import Address from '../../typeorm/entities/Address';
import AddressInput from '../inputs/AddressInput';
import AddressUpdateInput from '../inputs/AddressUpdateInput';

@Resolver()
export default class AddressResolver {
  @Mutation(() => Address)
  async createAddress(
    @Arg('data', () => AddressInput) data: AddressInput,
  ): Promise<Address> {
    const address = await Address.create(data).save();
    return address;
  }

  @Mutation(() => Address)
  async updateAddress(
    @Arg('id', () => String) id: string,
    @Arg('data', () => AddressUpdateInput) data: AddressUpdateInput,
  ): Promise<Address | undefined> {
    await Address.update({ id }, data);
    return Address.findOne(id);
  }

  @Mutation(() => Boolean)
  async deleteAddress(@Arg('id', () => String) id: string): Promise<boolean> {
    await Address.delete({ id });
    return true;
  }

  @Query(() => [Address])
  adresses(): Promise<Address[]> {
    return Address.find();
  }
}
