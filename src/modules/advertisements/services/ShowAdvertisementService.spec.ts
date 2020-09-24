import AppError from '@shared/errors/AppErrors';

import FakeAdvertisementsRepository from '../repositories/fakes/FakeAdvertisementsRepository';
import ShowAdvertisementService from './ShowAdvertisementService';
import { AdvertisementTypeEnum } from '../infra/typeorm/entities/Advertisement';

let fakeAdvertisementsRepository: FakeAdvertisementsRepository;
let showAdvertisement: ShowAdvertisementService;

describe('ShowAdvertisement', () => {
  beforeEach(() => {
    fakeAdvertisementsRepository = new FakeAdvertisementsRepository();
    showAdvertisement = new ShowAdvertisementService(
      fakeAdvertisementsRepository,
    );
  });

  it('should be able to show the advertisement', async () => {
    const advertisementExample = await fakeAdvertisementsRepository.create({
      title: 'My title',
      user_id: 'id',
      type: AdvertisementTypeEnum.PURCHASE,
      property_id: 'id',
    });

    const advertisement = await showAdvertisement.execute({
      advertisement_id: advertisementExample.id,
    });

    expect(advertisement?.title).toBe('My title');
    expect(advertisement?.type).toBe('purchase');
  });

  it('should not be able to show the advertisement from non-existing advertisement', async () => {
    await expect(
      showAdvertisement.execute({
        advertisement_id: -1,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
