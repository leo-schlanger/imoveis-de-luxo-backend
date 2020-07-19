import { Resolver, Mutation, Arg, Query } from 'type-graphql';

import Media from '../../typeorm/entities/Media';
import MediaInput from '../inputs/MediaInput';

@Resolver()
export default class MediaResolver {
  @Mutation(() => Media)
  async createMedia(
    @Arg('data', () => MediaInput) data: MediaInput,
  ): Promise<Media> {
    const media = await Media.create(data).save();
    return media;
  }

  @Mutation(() => Boolean)
  async deleteMedia(@Arg('id', () => String) id: string): Promise<boolean> {
    await Media.delete({ id });
    return true;
  }

  @Query(() => [Media])
  Medias(): Promise<Media[]> {
    return Media.find();
  }
}
