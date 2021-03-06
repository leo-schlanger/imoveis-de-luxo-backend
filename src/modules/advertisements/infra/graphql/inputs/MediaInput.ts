import { InputType, Field } from 'type-graphql';
import { MediaTypeEnum } from '../../typeorm/entities/Media';

@InputType()
export default class MediaInput {
  @Field()
  advertisement_id: number;

  @Field()
  filename: string;

  @Field(() => MediaTypeEnum)
  type: MediaTypeEnum;
}
