import AppError from '@shared/errors/AppErrors';

import FakeAdressesRepository from '@modules/adresses/repositories/fakes/FakeAdressesRepository';
import FakePropertiesRepository from '@modules/properties/repositories/fakes/FakePropertiesRepository';
import { PropertyTypeEnum } from '@modules/properties/infra/typeorm/entities/Property';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeAdvertisementsRepository from '../repositories/fakes/FakeAdvertisementsRepository';
import UpdateAdvertisementAddressService from './UpdateAdvertisementAddressService';
import { AdvertisementTypeEnum } from '../infra/typeorm/entities/Advertisement';

let fakeAdvertisementsRepository: FakeAdvertisementsRepository;
let fakeAdressesRepository: FakeAdressesRepository;
let fakeUsersRepository: FakeUsersRepository;
let fakePropertiesRepository: FakePropertiesRepository;
let updateAdvertisementAddress: UpdateAdvertisementAddressService;

describe('UpdateAdvertisementAddress', () => {
  beforeEach(() => {
    fakeAdvertisementsRepository = new FakeAdvertisementsRepository();
    fakeAdressesRepository = new FakeAdressesRepository();
    fakePropertiesRepository = new FakePropertiesRepository();
    updateAdvertisementAddress = new UpdateAdvertisementAddressService(
      fakeAdvertisementsRepository,
      fakeAdressesRepository,
      fakeUsersRepository,
    );
  });

  it('should be able to update a new address', async () => {
    const address = await fakeAdressesRepository.create({
      country: 'Brasil',
      state: 'Rio de Janeiro',
      neighborhood: 'Copacabana',
      postal_code: '22222-222',
      street: 'My address',
      number: '23A',
      description: 'My description',
    });

    const property = await fakePropertiesRepository.create({
      value: 55500.9,
      type: PropertyTypeEnum.APARTMENT,
      address,
    });

    const advertisement = await fakeAdvertisementsRepository.create({
      type: AdvertisementTypeEnum.PURCHASE,
      property_id: property.id,
      user_id: 'user',
      title: 'My property',
      address_visible: true,
    });

    advertisement.property = property;
    await fakeAdvertisementsRepository.save(advertisement);

    const updatedAdvertisement = await updateAdvertisementAddress.execute({
      user_id: 'user',
      advertisement_id: advertisement.id,
      street: 'My new address',
      neighborhood: 'Gávea',
    });

    expect(updatedAdvertisement.property.address.street).toBe('My new address');
    expect(updatedAdvertisement.property.address.neighborhood).toBe('Gávea');
    expect(updatedAdvertisement.property.address.state).toBe('Rio de Janeiro');
  });

  it('should be able to update a new address', async () => {
    const address = await fakeAdressesRepository.create({
      country: 'Brasil',
      state: 'Rio de Janeiro',
      neighborhood: 'Copacabana',
      postal_code: '22222-222',
      street: 'My address',
      number: '23A',
      description: 'My description',
    });

    const property = await fakePropertiesRepository.create({
      value: 55500.9,
      type: PropertyTypeEnum.APARTMENT,
      address,
    });

    const advertisement = await fakeAdvertisementsRepository.create({
      type: AdvertisementTypeEnum.PURCHASE,
      property_id: property.id,
      user_id: 'user',
      title: 'My property',
      address_visible: true,
    });

    advertisement.property = property;
    await fakeAdvertisementsRepository.save(advertisement);

    await expect(
      updateAdvertisementAddress.execute({
        user_id: 'other-user',
        advertisement_id: advertisement.id,
        street: 'My new address',
        neighborhood: 'Gávea',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update a address in non-existing address id', async () => {
    const address = await fakeAdressesRepository.create({
      country: 'Brasil',
      state: 'Rio de Janeiro',
      neighborhood: 'Copacabana',
      postal_code: '22222-222',
      street: 'My address',
      number: '23A',
      description: 'My description',
    });

    const property = await fakePropertiesRepository.create({
      value: 55500.9,
      type: PropertyTypeEnum.APARTMENT,
      address,
    });

    const advertisement = await fakeAdvertisementsRepository.create({
      type: AdvertisementTypeEnum.PURCHASE,
      property_id: property.id,
      user_id: 'user',
      title: 'My property',
      address_visible: true,
    });

    advertisement.property = property;
    advertisement.property.address_id = 'non-existing-id';
    await fakeAdvertisementsRepository.save(advertisement);

    await expect(
      updateAdvertisementAddress.execute({
        user_id: 'user',
        advertisement_id: advertisement.id,
        postal_code: '11111-111',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the address from non-existing advertisement', async () => {
    await expect(
      updateAdvertisementAddress.execute({
        user_id: 'user',
        advertisement_id: -1,
        country: 'Brasil',
        state: 'Rio de Janeiro',
        postal_code: '22222-222',
        street: 'My address',
        neighborhood: 'Copacabana',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
