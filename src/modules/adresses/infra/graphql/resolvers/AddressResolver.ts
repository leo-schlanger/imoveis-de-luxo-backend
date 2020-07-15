/* eslint-disable import/prefer-default-export */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable max-classes-per-file */
import { Resolver, Mutation, Arg, Query, InputType, Field } from 'type-graphql';
import Address from '../../typeorm/entities/Address';

@InputType()
class AddressInput {
  @Field()
  country: string;

  @Field()
  state: string;

  @Field()
  postal_code: string;

  @Field()
  neighborhood: string;

  @Field({ nullable: true })
  sub_neighborhood: string;

  @Field()
  address: string;

  @Field({ nullable: true })
  number: string;

  @Field({ nullable: true })
  complement: string;

  @Field({ nullable: true })
  description: string;
}

@InputType()
class AddressUpdateInput {
  @Field({ nullable: true })
  country: string;

  @Field({ nullable: true })
  state: string;

  @Field({ nullable: true })
  postal_code: string;

  @Field({ nullable: true })
  neighborhood: string;

  @Field({ nullable: true })
  sub_neighborhood: string;

  @Field({ nullable: true })
  address: string;

  @Field({ nullable: true })
  number: string;

  @Field({ nullable: true })
  complement: string;

  @Field({ nullable: true })
  description: string;
}

@Resolver()
export class AddressResolver {
  @Mutation(() => Address)
  async createAddress(
    @Arg('options', () => AddressInput) options: AddressInput,
  ) {
    const address = await Address.create(options).save();
    return address;
  }

  @Mutation(() => Address)
  async updateAddress(
    @Arg('id', () => String) id: string,
    @Arg('input', () => AddressUpdateInput) input: AddressUpdateInput,
  ) {
    await Address.update({ id }, input);
    return Address.findOne(id);
  }

  @Mutation(() => Boolean)
  async deleteAddress(@Arg('id', () => String) id: string) {
    await Address.delete({ id });
    return true;
  }

  @Query(() => [Address])
  adresses() {
    return Address.find();
  }
}
