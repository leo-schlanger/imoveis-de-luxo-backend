/* eslint-disable no-param-reassign */
import { Resolver, Mutation, Arg, Query } from 'type-graphql';
import uploadConfig from '@config/upload';

import Advertisement from '../../typeorm/entities/Advertisement';
import AdvertisementInput from '../inputs/AdvertisementInput';
import AdvertisementUpdateInput from '../inputs/AdvertisementUpdateInput';

@Resolver()
export default class AdvertisementResolver {
  @Mutation(() => Advertisement)
  async createAdvertisement(
    @Arg('data', () => AdvertisementInput) data: AdvertisementInput,
  ): Promise<Advertisement> {
    const advertisement = await Advertisement.create(data).save();

    return advertisement;
  }

  @Mutation(() => Advertisement)
  async updateAdvertisement(
    @Arg('id', () => String) id: string,
    @Arg('data', () => AdvertisementUpdateInput) data: AdvertisementUpdateInput,
  ): Promise<Advertisement | undefined> {
    await Advertisement.update({ id }, data);
    return Advertisement.findOne(id);
  }

  @Mutation(() => Boolean)
  async deleteAdvertisement(
    @Arg('id', () => String) id: string,
  ): Promise<boolean> {
    await Advertisement.delete({ id });
    return true;
  }

  @Query(() => [Advertisement])
  async Advertisements(): Promise<Advertisement[]> {
    let advertisementsList = await Advertisement.find();

    advertisementsList = advertisementsList.map(advertisement => {
      if (advertisement.avatar) {
        switch (uploadConfig.driver) {
          case 'disk':
            advertisement.avatar = `${process.env.APP_API_URL}/files/${advertisement.avatar}`;
            break;
          case 's3':
            advertisement.avatar = `https://${uploadConfig.config.aws.bucket}.s3.amazonaws.com/${advertisement.avatar}`;
            break;
          default:
            break;
        }
      }
      return advertisement;
    });

    return advertisementsList;
  }
}
