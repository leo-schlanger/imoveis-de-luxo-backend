import AppError from '@shared/errors/AppErrors';

import FakeAdressesRepository from '../repositories/fakes/FakeAdressesRepository';
import UpdateAddressService from './UpdateAddressService';

let fakeAdressesRepository: FakeAdressesRepository;
let updateAddress: UpdateAddressService;

describe('UpdateAddress', () => {
  beforeEach(() => {
    fakeAdressesRepository = new FakeAdressesRepository();
    updateAddress = new UpdateAddressService(fakeAdressesRepository);
  });

  it('should be able to update any field in address', async () => {
    const address = await fakeAdressesRepository.create({
      country: 'Brasil',
      state: 'Rio de Janeiro',
      neighborhood: 'Copacabana',
      postal_code: '22222-222',
      address: 'My address',
      number: '23A',
      description: 'My description',
    });

    let updatedAddress = await updateAddress.execute({
      address_id: address.id,
      neighborhood: 'Gávea',
      description: 'New description',
      complement: 'C',
      number: '33',
    });

    expect(updatedAddress.neighborhood).toBe('Gávea');
    expect(updatedAddress.description).toBe('New description');
    expect(updatedAddress.complement).toBe('C');
    expect(updatedAddress.number).toBe('33');

    updatedAddress = await updateAddress.execute({
      address_id: address.id,
      country: 'England',
      state: 'London',
      sub_neighborhood: 'BakerStreet',
      address: 'New address',
      postal_code: '555-55555',
    });

    expect(updatedAddress.country).toBe('England');
    expect(updatedAddress.state).toBe('London');
    expect(updatedAddress.sub_neighborhood).toBe('BakerStreet');
    expect(updatedAddress.address).toBe('New address');
    expect(updatedAddress.description).toBe('New description');
    expect(updatedAddress.complement).toBe('C');
  });

  it('should not be able to update address with nonexistent id', async () => {
    await expect(
      updateAddress.execute({
        address_id: 'nonexistent_id',
        neighborhood: 'Gávea',
        description: 'New description',
        complement: 'C',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
