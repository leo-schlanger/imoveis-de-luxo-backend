import { InputType, Field } from 'type-graphql';
import PropertyInput from '@modules/properties/infra/graphql/inputs/PropertyInput';
import { AdvertisementTypeEnum } from '../../typeorm/entities/Advertisement';

@InputType()
export default class AdvertisementInput {
  @Field(() => PropertyInput)
  property: PropertyInput;

  @Field()
  title: string;

  @Field({ nullable: true })
  description: string;

  @Field(() => Boolean)
  address_visible: boolean;

  @Field(() => Boolean)
  status: boolean;

  @Field(() => AdvertisementTypeEnum)
  type: AdvertisementTypeEnum;
}
