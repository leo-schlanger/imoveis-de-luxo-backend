import { InputType, Field, Float } from 'type-graphql';
import AddressUpdateInput from '@modules/adresses/infra/graphql/inputs/AddressUpdateInput';
import { PropertyTypeEnum } from '../../typeorm/entities/Property';

@InputType()
export default class PropertyUpdateInput {
  @Field(() => AddressUpdateInput, { nullable: true })
  address: AddressUpdateInput;

  @Field(() => PropertyTypeEnum, { nullable: true })
  type: PropertyTypeEnum;

  @Field(() => Float, { nullable: true })
  value: number;
}
