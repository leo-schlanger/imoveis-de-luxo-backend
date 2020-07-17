import { InputType, Field } from 'type-graphql';
import PropertyInput from '@modules/properties/infra/graphql/inputs/PropertyInput';
import { AdvertisementTypeEnum } from '../../typeorm/entities/Advertisement';

@InputType()
export default class AdvertisementUpdateInput {
  @Field(() => PropertyInput, { nullable: true })
  property: PropertyInput;

  @Field({ nullable: true })
  title: string;

  @Field({ nullable: true })
  description: string;

  @Field(() => Boolean, { nullable: true })
  address_visible: boolean;

  @Field(() => Boolean, { nullable: true })
  status: boolean;

  @Field(() => AdvertisementTypeEnum, { nullable: true })
  type: AdvertisementTypeEnum;
}
