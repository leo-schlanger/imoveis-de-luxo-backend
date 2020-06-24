import AppError from '@shared/errors/AppErrors';

import FakeAdressesRepository from '@modules/adresses/repositories/fakes/FakeAdressesRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakePropertiesRepository from '@modules/properties/repositories/fakes/FakePropertiesRepository';
import FakeAdvertisementsRepository from '../repositories/fakes/FakeAdvertisementsRepository';

import CreateAdvertisementService from './CreateAdvertisementService';

let fakeAdvertisementsRepository: FakeAdvertisementsRepository;
let fakePropertiesRepository: FakePropertiesRepository;
let fakeAdressesRepository: FakeAdressesRepository;
let fakeUsersRepository: FakeUsersRepository;
let fakeCacheProvider: FakeCacheProvider;
let createAdvertisement: CreateAdvertisementService;

describe('CreateAdvertisement', () => {
  beforeEach(() => {
    fakeAdvertisementsRepository = new FakeAdvertisementsRepository();
    fakePropertiesRepository = new FakePropertiesRepository();
    fakeAdressesRepository = new FakeAdressesRepository();
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();
    createAdvertisement = new CreateAdvertisementService(
      fakeUsersRepository,
      fakeAdressesRepository,
      fakeAdvertisementsRepository,
      fakePropertiesRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to create a new advertisement', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Joe Doe',
      email: 'joedoe@example.com',
      password: '123456',
      phone: '2222222222',
      type: 'advertiser',
    });

    const advertisement = await createAdvertisement.execute({
      title: 'My title',
      user_id: user.id,
      type: 'purchase',
      property: {
        value: 44555.55,
        type: 'apartment',
        address: {
          state: 'Brasil',
          country: 'Rio de Janeiro',
          postal_code: '22222-222',
          neighborhood: 'Copacabana',
          address: 'Barata Ribeiro',
        },
      },
    });

    expect(advertisement).toHaveProperty('id');
  });

  it('should not be able to create a new advertisement with non-advertiser user', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Joe Doe',
      email: 'joedoe@example.com',
      password: '123456',
      phone: '2222222222',
      type: 'user',
    });

    await expect(
      createAdvertisement.execute({
        title: 'My title',
        user_id: user.id,
        type: 'purchase',
        property: {
          value: 44555.55,
          type: 'apartment',
          address: {
            state: 'Brasil',
            country: 'Rio de Janeiro',
            postal_code: '22222-222',
            neighborhood: 'Copacabana',
            address: 'Barata Ribeiro',
          },
        },
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new advertisement with invalid user', async () => {
    await expect(
      createAdvertisement.execute({
        title: 'My title',
        user_id: 'invalid-id',
        type: 'purchase',
        property: {
          value: 44555.55,
          type: 'apartment',
          address: {
            state: 'Brasil',
            country: 'Rio de Janeiro',
            postal_code: '22222-222',
            neighborhood: 'Copacabana',
            address: 'Barata Ribeiro',
          },
        },
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new advertisement with same address', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Joe Doe',
      email: 'joedoe@example.com',
      password: '123456',
      phone: '2222222222',
      type: 'advertiser',
    });

    await createAdvertisement.execute({
      title: 'My title',
      user_id: user.id,
      type: 'purchase',
      property: {
        value: 44555.55,
        type: 'apartment',
        address: {
          state: 'Brasil',
          country: 'Rio de Janeiro',
          postal_code: '22222-222',
          neighborhood: 'Copacabana',
          address: 'Barata Ribeiro',
        },
      },
    });

    await expect(
      createAdvertisement.execute({
        title: 'My title',
        user_id: user.id,
        type: 'purchase',
        property: {
          value: 44555.55,
          type: 'apartment',
          address: {
            state: 'Brasil',
            country: 'Rio de Janeiro',
            postal_code: '22222-222',
            neighborhood: 'Copacabana',
            address: 'Barata Ribeiro',
          },
        },
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
