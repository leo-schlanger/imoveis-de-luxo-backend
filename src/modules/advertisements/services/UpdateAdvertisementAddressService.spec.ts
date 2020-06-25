import AppError from '@shared/errors/AppErrors';

import FakeAdressesRepository from '@modules/adresses/repositories/fakes/FakeAdressesRepository';
import FakePropertiesRepository from '@modules/properties/repositories/fakes/FakePropertiesRepository';
import FakeAdvertisementsRepository from '../repositories/fakes/FakeAdvertisementsRepository';
import UpdateAdvertisementAddressService from './UpdateAdvertisementAddressService';

let fakeAdvertisementsRepository: FakeAdvertisementsRepository;
let fakeAdressesRepository: FakeAdressesRepository;
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
    );
  });

  it('should be able to update a new address', async () => {
    const address = await fakeAdressesRepository.create({
      country: 'Brasil',
      state: 'Rio de Janeiro',
      neighborhood: 'Copacabana',
      postal_code: '22222-222',
      address: 'My address',
      number: '23A',
      description: 'My description',
    });

    const property = await fakePropertiesRepository.create({
      value: 55500.9,
      type: 'apartment',
      address,
    });

    const advertisement = await fakeAdvertisementsRepository.create({
      type: 'purchase',
      property_id: property.id,
      user_id: 'user',
      title: 'My property',
      address_visible: true,
    });

    advertisement.property = property;
    await fakeAdvertisementsRepository.save(advertisement);

    const updatedAdvertisement = await updateAdvertisementAddress.execute({
      advertisement_id: advertisement.id,
      address: 'My new address',
      neighborhood: 'Gavea',
    });

    expect(updatedAdvertisement.property.address.address).toBe(
      'My new address',
    );
    expect(updatedAdvertisement.property.address.neighborhood).toBe('Gavea');
    expect(updatedAdvertisement.property.address.state).toBe('Rio de Janeiro');
  });

  it('should not be able to update a address in non-existing address id', async () => {
    const address = await fakeAdressesRepository.create({
      country: 'Brasil',
      state: 'Rio de Janeiro',
      neighborhood: 'Copacabana',
      postal_code: '22222-222',
      address: 'My address',
      number: '23A',
      description: 'My description',
    });

    const property = await fakePropertiesRepository.create({
      value: 55500.9,
      type: 'apartment',
      address,
    });

    const advertisement = await fakeAdvertisementsRepository.create({
      type: 'purchase',
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
        advertisement_id: advertisement.id,
        postal_code: '11111-111',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the address from non-existing advertisement', async () => {
    await expect(
      updateAdvertisementAddress.execute({
        advertisement_id: 'non-existing-advertisement',
        country: 'Brasil',
        state: 'Rio de Janeiro',
        postal_code: '22222-222',
        address: 'My address',
        neighborhood: 'Copacabana',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
