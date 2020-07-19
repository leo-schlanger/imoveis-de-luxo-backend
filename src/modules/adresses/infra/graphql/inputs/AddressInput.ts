import { InputType, Field } from 'type-graphql';

@InputType()
export default class AddressInput {
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
