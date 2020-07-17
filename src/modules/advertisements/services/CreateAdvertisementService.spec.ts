import AppError from '@shared/errors/AppErrors';

import FakeAdressesRepository from '@modules/adresses/repositories/fakes/FakeAdressesRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakePropertiesRepository from '@modules/properties/repositories/fakes/FakePropertiesRepository';
import { PropertyTypeEnum } from '@modules/properties/infra/typeorm/entities/Property';
import { UserTypeEnum } from '@modules/users/infra/typeorm/entities/User';
import FakeAdvertisementsRepository from '../repositories/fakes/FakeAdvertisementsRepository';

import CreateAdvertisementService from './CreateAdvertisementService';
import { AdvertisementTypeEnum } from '../infra/typeorm/entities/Advertisement';

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
      type: UserTypeEnum.ADVERTISER,
    });

    const advertisement = await createAdvertisement.execute({
      title: 'My title',
      user_id: user.id,
      type: AdvertisementTypeEnum.PURCHASE,
      property: {
        value: 44555.55,
        type: PropertyTypeEnum.APARTMENT,
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
      type: UserTypeEnum.USER,
    });

    await expect(
      createAdvertisement.execute({
        title: 'My title',
        user_id: user.id,
        type: AdvertisementTypeEnum.PURCHASE,
        property: {
          value: 44555.55,
          type: PropertyTypeEnum.APARTMENT,
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
        type: AdvertisementTypeEnum.PURCHASE,
        property: {
          value: 44555.55,
          type: PropertyTypeEnum.APARTMENT,
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
      type: UserTypeEnum.ADVERTISER,
    });

    await createAdvertisement.execute({
      title: 'My title',
      user_id: user.id,
      type: AdvertisementTypeEnum.PURCHASE,
      property: {
        value: 44555.55,
        type: PropertyTypeEnum.APARTMENT,
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
        type: AdvertisementTypeEnum.PURCHASE,
        property: {
          value: 44555.55,
          type: PropertyTypeEnum.APARTMENT,
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
