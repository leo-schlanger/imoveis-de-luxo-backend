import { InputType, Field } from 'type-graphql';
import AddressUpdateInput from '@modules/adresses/infra/graphql/inputs/AddressUpdateInput';
import { PropertyTypeEnum } from '../../typeorm/entities/Property';
import { ExtraFieldTypeEnum } from '../../typeorm/entities/ExtraField';

@InputType()
export default class PropertyUpdateInput extends AddressUpdateInput {
  @Field({ nullable: true })
  name: string;

  @Field(() => [ExtraFieldTypeEnum], { nullable: true })
  type: ExtraFieldTypeEnum;

  @Field(() => [PropertyTypeEnum], { nullable: true })
  propertyTypes: PropertyTypeEnum[];
}
