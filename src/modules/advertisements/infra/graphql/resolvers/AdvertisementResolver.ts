/* eslint-disable max-classes-per-file */
/* eslint-disable no-param-reassign */
import {
  Resolver,
  Mutation,
  Arg,
  Query,
  UseMiddleware,
  Ctx,
  ObjectType,
  Field,
  Int,
} from 'type-graphql';
// import uploadConfig from '@config/upload';

import { isAuth } from '@shared/infra/graphql/middlewares/IsAuth';
import { container } from 'tsyringe';
import CreateAdvertisementService from '@modules/advertisements/services/CreateAdvertisementService';
import MyContext from '@shared/infra/graphql/types/MyContext';
import ListAdvertisementsService from '@modules/advertisements/services/ListAdvertisementsService';
import { classToClass } from 'class-transformer';
import UpdateAdvertisementService from '@modules/advertisements/services/UpdateAdvertisementService';
import UpdateAdvertisementAddressService from '@modules/advertisements/services/UpdateAdvertisementAddressService';
import Advertisement from '../../typeorm/entities/Advertisement';
import AdvertisementInput from '../inputs/AdvertisementInput';
import AdvertisementUpdateInput from '../inputs/AdvertisementUpdateInput';
import AdvertisementListInput from '../inputs/AdvertisementListInput';

@ObjectType('AdvertisementList')
class AdvertisementList {
  @Field(() => [Advertisement])
  list: Advertisement[];

  @Field(() => Int)
  total: number;
}

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
    @Arg('id', () => Int) id: number,
    @Arg('data', () => AdvertisementUpdateInput) data: AdvertisementUpdateInput,
    @Ctx() context: MyContext,
  ): Promise<Advertisement | undefined> {
    const { id: user_id } = context.req.user;
    const updateAdvertisement = container.resolve(UpdateAdvertisementService);
    const updateAdvertisementAddress = container.resolve(
      UpdateAdvertisementAddressService,
    );

    const { title, type, description, address_visible, property } = data;

    await updateAdvertisement.execute({
      user_id,
      advertisement_id: id,
      title,
      type,
      description,
      address_visible,
    });

    if (property) {
      await updateAdvertisementAddress.execute({
        user_id,
        advertisement_id: id,
        ...property,
      });
    }

    const advertisementUpdated = await Advertisement.findOne(id);

    return classToClass(advertisementUpdated);
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteAdvertisement(
    @Arg('id', () => Int) id: number,
  ): Promise<boolean> {
    await Advertisement.delete({ id });
    return true;
  }

  @Query(() => Advertisement)
  async getAdvertisementById(
    @Arg('id', () => Int) id: number,
  ): Promise<Advertisement | undefined> {
    const advertisement = await Advertisement.findOne(id);

    return classToClass(advertisement);
  }

  @Query(() => AdvertisementList)
  async advertisements(
    @Arg('data', () => AdvertisementListInput) data: AdvertisementListInput,
  ): Promise<AdvertisementList> {
    const advertisementsList = container.resolve(ListAdvertisementsService);

    const list = await advertisementsList.execute(data);

    return { list: classToClass(list[0]), total: list[1] };
  }
}
