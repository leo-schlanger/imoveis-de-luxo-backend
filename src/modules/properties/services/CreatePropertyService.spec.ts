import AppError from '@shared/errors/AppErrors';

import FakeAdressesRepository from '@modules/adresses/repositories/fakes/FakeAdressesRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakePropertiesRepository from '../repositories/fakes/FakePropertiesRepository';

import CreatePropertyService from './CreatePropertyService';

let fakePropertiesRepository: FakePropertiesRepository;
let fakeAdressesRepository: FakeAdressesRepository;
let fakeCacheProvider: FakeCacheProvider;
let createProperty: CreatePropertyService;

describe('CreateProperty', () => {
  beforeEach(() => {
    fakePropertiesRepository = new FakePropertiesRepository();
    fakeAdressesRepository = new FakeAdressesRepository();
    fakeCacheProvider = new FakeCacheProvider();
    createProperty = new CreatePropertyService(
      fakePropertiesRepository,
      fakeAdressesRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to create a new property', async () => {
    const property = await createProperty.execute({
      type: 'apartment',
      value: 67000.0,
      country: 'Brasil',
      state: 'Rio de Janeiro',
      postal_code: '22222-222',
      neighborhood: 'Copacabana',
      address: 'Barata Ribeiro',
    });

    expect(property).toHaveProperty('id');
  });

  it('should not be able to create a new property with same address', async () => {
    await createProperty.execute({
      type: 'apartment',
      value: 67000.0,
      country: 'Brasil',
      state: 'Rio de Janeiro',
      postal_code: '22222-222',
      neighborhood: 'Copacabana',
      address: 'Barata Ribeiro',
    });

    await expect(
      createProperty.execute({
        type: 'apartment',
        value: 67000.0,
        country: 'Brasil',
        state: 'Rio de Janeiro',
        postal_code: '22222-222',
        neighborhood: 'Copacabana',
        address: 'Barata Ribeiro',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});