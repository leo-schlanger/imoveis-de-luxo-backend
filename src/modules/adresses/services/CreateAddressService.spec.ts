import FakeAdressesRepository from '../repositories/fakes/FakeAdressesRepository';
import CreateAddressService from './CreateAddressService';

let fakeAdressesRepository: FakeAdressesRepository;
let createAddress: CreateAddressService;

describe('CreateAddress', () => {
  beforeEach(() => {
    fakeAdressesRepository = new FakeAdressesRepository();
    createAddress = new CreateAddressService(fakeAdressesRepository);
  });

  it('should be able to create a new address', async () => {
    const address = await createAddress.execute({
      country: 'Brasil',
      state: 'Rio de Janeiro',
      neighborhood: 'Copacabana',
      postal_code: '22222-222',
    });

    expect(address).toHaveProperty('id');
  });

  it('should be able to create a new address with optional fields', async () => {
    const address = await createAddress.execute({
      country: 'Brasil',
      state: 'Rio de Janeiro',
      neighborhood: 'Copacabana',
      postal_code: '22222-222',
      number: '23A',
      description: 'My description',
    });

    expect(address.number).toBe('23A');
    expect(address.complement).toBeUndefined();
    expect(address.description).toBe('My description');
  });
});
