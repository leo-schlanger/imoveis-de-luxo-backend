/* eslint-disable no-param-reassign */
import {
  Resolver,
  Mutation,
  Arg,
  Query,
  UseMiddleware,
  Ctx,
} from 'type-graphql';
// import uploadConfig from '@config/upload';

import { isAuth } from '@shared/infra/graphql/middlewares/IsAuth';
import { container } from 'tsyringe';
import CreateAdvertisementService from '@modules/advertisements/services/CreateAdvertisementService';
import MyContext from '@shared/infra/graphql/types/MyContext';
import ListAdvertisementsService from '@modules/advertisements/services/ListAdvertisementsService';
import { classToClass } from 'class-transformer';
import Advertisement from '../../typeorm/entities/Advertisement';
import AdvertisementInput from '../inputs/AdvertisementInput';
import AdvertisementUpdateInput from '../inputs/AdvertisementUpdateInput';
import AdvertisementListInput from '../inputs/AdvertisementListInput';

@Resolver()
export default class AdvertisementResolver {
  @Mutation(() => Advertisement)
  @UseMiddleware(isAuth)
  async createAdvertisement(
    @Arg('data', () => AdvertisementInput) data: AdvertisementInput,
    @Ctx() context: MyContext,
  ): Promise<Advertisement> {
    const { id } = context.req.user;
    const createAdvertisement = container.resolve(CreateAdvertisementService);

    const advertisement = await createAdvertisement.execute({
      user_id: id,
      ...data,
    });

    return advertisement;
  }

  @Mutation(() => Advertisement)
  @UseMiddleware(isAuth)
  async updateAdvertisement(
    @Arg('id', () => String) id: string,
    @Arg('data', () => AdvertisementUpdateInput) data: AdvertisementUpdateInput,
  ): Promise<Advertisement | undefined> {
    const { property, ...rest } = data;
    const { type, value, ...address } = property;
    await Advertisement.update(
      { id },
      { ...rest, property: { type, value, address } },
    );
    return Advertisement.findOne(id);
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteAdvertisement(
    @Arg('id', () => String) id: string,
  ): Promise<boolean> {
    await Advertisement.delete({ id });
    return true;
  }

  @Query(() => [Advertisement])
  async advertisements(
    @Arg('data', () => AdvertisementListInput) data: AdvertisementListInput,
  ): Promise<Advertisement[]> {
    const advertisementsList = container.resolve(ListAdvertisementsService);

    const list = await advertisementsList.execute(data);

    return classToClass(list);
  }
}
