import AppError from '@shared/errors/AppErrors';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeAdvertisementsRepository from '../repositories/fakes/FakeAdvertisementsRepository';

import DeleteAdvertisementService from './DeleteAdvertisementService';

let fakeAdvertisementsRepository: FakeAdvertisementsRepository;
let fakeCacheProvider: FakeCacheProvider;
let deleteAdvertisement: DeleteAdvertisementService;

describe('deleteAdvertisement', () => {
  beforeEach(() => {
    fakeAdvertisementsRepository = new FakeAdvertisementsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    deleteAdvertisement = new DeleteAdvertisementService(
      fakeAdvertisementsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to delete a advertisement', async () => {
    const advertisement = await fakeAdvertisementsRepository.create({
      property_id: 'property',
      title: 'title',
      user_id: 'user',
      type: 'purchase',
    });

    await fakeAdvertisementsRepository.save(advertisement);

    expect(advertisement).toHaveProperty('id');

    const confirmAdvertisement = await fakeAdvertisementsRepository.findById(
      advertisement.id,
    );
    expect(confirmAdvertisement).toBe(advertisement);

    await deleteAdvertisement.execute({ id: advertisement.id });

    const confirmAdvertisementDeleted = await fakeAdvertisementsRepository.findById(
      advertisement.id,
    );

    expect(confirmAdvertisementDeleted).toBeUndefined();
  });

  it('should not be able to delete a non-exists advertisement', async () => {
    await expect(
      deleteAdvertisement.execute({
        id: 'non-exists-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
