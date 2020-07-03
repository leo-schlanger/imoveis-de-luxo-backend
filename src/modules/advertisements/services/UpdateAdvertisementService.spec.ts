import AppError from '@shared/errors/AppErrors';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeAdvertisementsRepository from '../repositories/fakes/FakeAdvertisementsRepository';
import UpdateAdvertisementService from './UpdateAdvertisementService';

let fakeAdvertisementsRepository: FakeAdvertisementsRepository;
let fakeCacheProvider: FakeCacheProvider;
let updateAdvertisement: UpdateAdvertisementService;

describe('UpdateAdvertisement', () => {
  beforeEach(() => {
    fakeAdvertisementsRepository = new FakeAdvertisementsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    updateAdvertisement = new UpdateAdvertisementService(
      fakeAdvertisementsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to update a new type and visible address', async () => {
    const advertisement = await fakeAdvertisementsRepository.create({
      type: 'purchase',
      property_id: 'property',
      user_id: 'user',
      title: 'My property',
      address_visible: true,
    });

    const updatedAdvertisement = await updateAdvertisement.execute({
      user_id: 'user',
      advertisement_id: advertisement.id,
      type: 'tenancy',
      address_visible: false,
    });

    expect(updatedAdvertisement.type).toBe('tenancy');
    expect(updatedAdvertisement.address_visible).toBe(false);
  });

  it('should be able to update a new title and description', async () => {
    const advertisement = await fakeAdvertisementsRepository.create({
      type: 'purchase',
      property_id: 'property',
      user_id: 'user',
      title: 'My property',
      address_visible: true,
    });

    const updatedAdvertisement = await updateAdvertisement.execute({
      user_id: 'user',
      advertisement_id: advertisement.id,
      type: 'purchase',
      address_visible: true,
      title: 'New title',
      description: 'Description',
    });

    expect(updatedAdvertisement.title).toBe('New title');
    expect(updatedAdvertisement.description).toBe('Description');
  });

  it('should not be able to update with non-responsible user', async () => {
    const advertisement = await fakeAdvertisementsRepository.create({
      type: 'purchase',
      property_id: 'property',
      user_id: 'user',
      title: 'My property',
      address_visible: true,
    });

    await expect(
      updateAdvertisement.execute({
        user_id: 'other-user',
        advertisement_id: advertisement.id,
        type: 'purchase',
        address_visible: true,
        title: 'New title',
        description: 'Description',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the address from non-existing advertisement', async () => {
    await expect(
      updateAdvertisement.execute({
        user_id: 'user',
        advertisement_id: 'non-existing-advertisement',
        type: 'purchase',
        address_visible: true,
        title: 'New title',
        description: 'Description',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
