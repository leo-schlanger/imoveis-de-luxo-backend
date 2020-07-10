import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import { classToClass } from 'class-transformer';
import FakeAdvertisementsRepository from '../repositories/fakes/FakeAdvertisementsRepository';
import ListAdvertisementsService from './ListAdvertisementsService';

let fakeAdvertisementsRepository: FakeAdvertisementsRepository;
let listAdvertisements: ListAdvertisementsService;
let fakeCacheProvider: FakeCacheProvider;

describe('ListAdvertisementsService', () => {
  beforeEach(() => {
    fakeAdvertisementsRepository = new FakeAdvertisementsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    listAdvertisements = new ListAdvertisementsService(
      fakeAdvertisementsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to list the advertisements', async () => {
    let properties = await listAdvertisements.execute({});

    expect(properties).toEqual([]);

    const advertisement1 = await fakeAdvertisementsRepository.create({
      user_id: 'user_id',
      property_id: 'property_id',
      title: 'test1',
      type: 'purchase',
    });

    properties = await listAdvertisements.execute({});
    expect(properties).toEqual([classToClass(advertisement1)]);

    const advertisement2 = await fakeAdvertisementsRepository.create({
      user_id: 'user_id',
      property_id: 'property_id',
      title: 'test2',
      type: 'tenancy',
    });

    properties = await fakeAdvertisementsRepository.show({});

    expect(properties).toEqual([advertisement1, advertisement2]);
  });
});