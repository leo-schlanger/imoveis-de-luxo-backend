import { Resolver, Mutation, Arg, Query, UseMiddleware } from 'type-graphql';

import { isAuth } from '@shared/infra/graphql/middlewares/IsAuth';

import Address from '../../typeorm/entities/Address';
import AddressInput from '../inputs/AddressInput';
import AddressUpdateInput from '../inputs/AddressUpdateInput';

@Resolver()
export default class AddressResolver {
  @Mutation(() => Address)
  @UseMiddleware(isAuth)
  async createAddress(
    @Arg('data', () => AddressInput) data: AddressInput,
  ): Promise<Address> {
    const address = await Address.create(data).save();
    return address;
  }

  @Mutation(() => Address)
  @UseMiddleware(isAuth)
  async updateAddress(
    @Arg('id', () => String) id: string,
    @Arg('data', () => AddressUpdateInput) data: AddressUpdateInput,
  ): Promise<Address | undefined> {
    await Address.update({ id }, data);
    return Address.findOne(id);
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteAddress(@Arg('id', () => String) id: string): Promise<boolean> {
    await Address.delete({ id });
    return true;
  }

  @Query(() => [Address])
  @UseMiddleware(isAuth)
  adresses(): Promise<Address[]> {
    return Address.find();
  }
}
