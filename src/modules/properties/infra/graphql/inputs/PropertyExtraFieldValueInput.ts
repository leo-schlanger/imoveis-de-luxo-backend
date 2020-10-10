import { InputType, Field } from 'type-graphql';

@InputType()
export default class PropertyExtraFieldValueInput {
  @Field()
  property_id: string;

  @Field()
  extra_field_id: string;

  @Field()
  value: string;
}
