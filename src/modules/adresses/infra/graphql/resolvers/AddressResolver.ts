import { Resolver, Mutation, Arg, Query, UseMiddleware } from 'type-graphql';

import { isAuth } from '@shared/infra/graphql/middlewares/IsAuth';

import { container } from 'tsyringe';
import CreateAddressService from '@modules/adresses/services/CreateAddressService';
import UpdateAddressService from '@modules/adresses/services/UpdateAddressService';
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
    const createAddress = container.resolve(CreateAddressService);
    const address = await createAddress.execute(data);
    return address;
  }

  @Mutation(() => Address)
  @UseMiddleware(isAuth)
  async updateAddress(
    @Arg('id', () => String) id: string,
    @Arg('data', () => AddressUpdateInput) data: AddressUpdateInput,
  ): Promise<Address | undefined> {
    const updateAddress = container.resolve(UpdateAddressService);
    const updatedAddress = await updateAddress.execute({
      address_id: id,
      ...data,
    });
    return updatedAddress;
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
