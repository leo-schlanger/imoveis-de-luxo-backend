import { InputType, Field } from 'type-graphql';

@InputType()
export default class AddressUpdateInput {
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
