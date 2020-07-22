import { InputType, Field, Float } from 'type-graphql';
import AddressInput from '@modules/adresses/infra/graphql/inputs/AddressInput';
import { PropertyTypeEnum } from '../../typeorm/entities/Property';

@InputType()
export default class PropertyInput extends AddressInput {
  @Field(() => PropertyTypeEnum)
  type: PropertyTypeEnum;

  @Field(() => Float)
  value: number;
}
