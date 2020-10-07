import { InputType, Field } from 'type-graphql';
import { PropertyTypeEnum } from '../../typeorm/entities/Property';
import { ExtraFieldTypeEnum } from '../../typeorm/entities/ExtraField';

@InputType()
export default class ExtraFieldInput {
  @Field()
  name: string;

  @Field(() => [ExtraFieldTypeEnum])
  type: ExtraFieldTypeEnum;

  @Field(() => [PropertyTypeEnum])
  propertyTypes: PropertyTypeEnum[];
}
