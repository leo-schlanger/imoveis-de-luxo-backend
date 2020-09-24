import AppError from '@shared/errors/AppErrors';

import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeAdvertisementsRepository from '../repositories/fakes/FakeAdvertisementsRepository';
import FakeMediaRepository from '../repositories/fakes/FakeMediaRepository';
import UpdateAdvertisementMediaService from './UpdateAdvertisementMediaService';
import { MediaTypeEnum } from '../infra/typeorm/entities/Media';
import { AdvertisementTypeEnum } from '../infra/typeorm/entities/Advertisement';

let fakeAdvertisementsRepository: FakeAdvertisementsRepository;
let fakeMediaRepository: FakeMediaRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateAdvertisementMedia: UpdateAdvertisementMediaService;

describe('UpdateAdvertisementMedia', () => {
  beforeEach(() => {
    fakeAdvertisementsRepository = new FakeAdvertisementsRepository();
    fakeMediaRepository = new FakeMediaRepository();
    fakeStorageProvider = new FakeStorageProvider();
    updateAdvertisementMedia = new UpdateAdvertisementMediaService(
      fakeAdvertisementsRepository,
      fakeMediaRepository,
      fakeStorageProvider,
    );
  });

  it('should be able to update advertisement gallery', async () => {
    const advertisement = await fakeAdvertisementsRepository.create({
      property_id: 'property',
      title: 'title',
      user_id: 'user',
      type: AdvertisementTypeEnum.PURCHASE,
    });

    await fakeAdvertisementsRepository.save(advertisement);

    expect(advertisement).toHaveProperty('id');

    let advertisementUpdated = await updateAdvertisementMedia.execute({
      advertisement_id: advertisement.id,
      user_id: advertisement.user_id,
      type: MediaTypeEnum.PHOTO,
      gallery: ['media1', 'media2'],
    });

    expect(advertisementUpdated.gallery.length).toBe(2);

    advertisementUpdated = await updateAdvertisementMedia.execute({
      advertisement_id: advertisement.id,
      user_id: advertisement.user_id,
      type: MediaTypeEnum.VIDEO,
      gallery: ['media3'],
    });

    expect(advertisementUpdated.gallery.length).toBe(3);
    expect(advertisementUpdated.gallery[0].filename).toBe('media1');
    expect(advertisementUpdated.gallery[1].filename).toBe('media2');
    expect(advertisementUpdated.gallery[2].filename).toBe('media3');

    advertisementUpdated = await updateAdvertisementMedia.execute({
      advertisement_id: advertisement.id,
      user_id: advertisement.user_id,
      type: MediaTypeEnum.PHOTO,
      gallery: ['media4'],
    });

    expect(advertisementUpdated.gallery.length).toBe(2);
    expect(advertisementUpdated.gallery[0].filename).toBe('media3');
    expect(advertisementUpdated.gallery[1].filename).toBe('media4');
  });

  it('should not be able to update advertisement gallery from invalid user', async () => {
    const advertisement = await fakeAdvertisementsRepository.create({
      property_id: 'property',
      title: 'title',
      user_id: 'user',
      type: AdvertisementTypeEnum.PURCHASE,
    });

    await fakeAdvertisementsRepository.save(advertisement);

    expect(advertisement).toHaveProperty('id');

    await expect(
      updateAdvertisementMedia.execute({
        advertisement_id: advertisement.id,
        user_id: 'invalid-user',
        type: MediaTypeEnum.PHOTO,
        gallery: ['media1', 'media2'],
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update advertisement gallery from non existing advertisement', async () => {
    await expect(
      updateAdvertisementMedia.execute({
        advertisement_id: -1,
        user_id: 'invalid-user',
        type: MediaTypeEnum.PHOTO,
        gallery: ['media1', 'media2'],
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
