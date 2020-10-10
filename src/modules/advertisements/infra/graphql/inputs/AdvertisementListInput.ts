/* eslint-disable max-classes-per-file */
import { InputType, Field, Int } from 'type-graphql';

import { PropertyTypeEnum } from '@modules/properties/infra/typeorm/entities/Property';

import { AdvertisementTypeEnum } from '../../typeorm/entities/Advertisement';

@InputType()
class AddressFilter {
  @Field({ nullable: true })
  country: string;

  @Field({ nullable: true })
  state: string;

  @Field({ nullable: true })
  neighborhood: string;

  @Field({ nullable: true })
  street: string;
}

@InputType()
class PropertyFilter {
  @Field(() => PropertyTypeEnum, { nullable: true })
  type: PropertyTypeEnum;

  @Field(() => AddressFilter, { nullable: true })
  address: AddressFilter;
}

@InputType()
class Filter {
  @Field(() => AdvertisementTypeEnum, { nullable: true })
  type: AdvertisementTypeEnum;

  @Field(() => PropertyFilter, { nullable: true })
  property: PropertyFilter;

  @Field({ nullable: true })
  user_id: string;
}

@InputType()
export default class AdvertisementListInput {
  @Field(() => Int, { nullable: true })
  per_page: number;

  @Field(() => Int, { nullable: true })
  page: number;

  @Field(() => Filter, { nullable: true })
  filter: Filter;
}
