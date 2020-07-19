import AppError from '@shared/errors/AppErrors';

import FakeAdressesRepository from '@modules/adresses/repositories/fakes/FakeAdressesRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakePropertiesRepository from '../repositories/fakes/FakePropertiesRepository';
import UpdatePropertyService from './UpdatePropertyService';
import { PropertyTypeEnum } from '../infra/typeorm/entities/Property';

let fakePropertiesRepository: FakePropertiesRepository;
let fakeAdressesRepository: FakeAdressesRepository;
let fakeCacheProvider: FakeCacheProvider;
let updateProperty: UpdatePropertyService;

describe('UpdateProperty', () => {
  beforeEach(() => {
    fakePropertiesRepository = new FakePropertiesRepository();
    fakeAdressesRepository = new FakeAdressesRepository();
    fakeCacheProvider = new FakeCacheProvider();
    updateProperty = new UpdatePropertyService(
      fakePropertiesRepository,
      fakeAdressesRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to update a new value and type', async () => {
    const address = await fakeAdressesRepository.create({
      country: 'Brasil',
      state: 'Rio de Janeiro',
      postal_code: '22222-222',
      neighborhood: 'Copacabana',
      address: 'Barata Ribeiro',
    });

    const property = await fakePropertiesRepository.create({
      type: PropertyTypeEnum.APARTMENT,
      value: 67000.0,
      address,
    });

    const updatedProperty = await updateProperty.execute({
      property_id: property.id,
      type: PropertyTypeEnum.HOME,
      value: 88000.0,
    });

    expect(updatedProperty.type).toBe('home');
    expect(updatedProperty.value).toBe(88000.0);
  });

  it('should be able to update a new address', async () => {
    const address = await fakeAdressesRepository.create({
      country: 'Brasil',
      state: 'Rio de Janeiro',
      postal_code: '22222-222',
      neighborhood: 'Copacabana',
      address: 'Barata Ribeiro',
    });

    const property = await fakePropertiesRepository.create({
      type: PropertyTypeEnum.APARTMENT,
      value: 67000.0,
      address,
    });

    const updatedProperty = await updateProperty.execute({
      property_id: property.id,
      type: PropertyTypeEnum.APARTMENT,
      value: 67000.0,
      postal_code: '11111-111',
    });

    const addressFind = await fakeAdressesRepository.findById(
      updatedProperty.address_id,
    );

    expect(addressFind?.postal_code).toBe('11111-111');
  });

  it('should not be able to update a address in non-existing address id', async () => {
    const address = await fakeAdressesRepository.create({
      country: 'Brasil',
      state: 'Rio de Janeiro',
      postal_code: '22222-222',
      neighborhood: 'Copacabana',
      address: 'Barata Ribeiro',
    });

    await fakeAdressesRepository.delete(address.id);

    const property = await fakePropertiesRepository.create({
      type: PropertyTypeEnum.APARTMENT,
      value: 67000.0,
      address,
    });

    await expect(
      updateProperty.execute({
        property_id: property.id,
        type: PropertyTypeEnum.APARTMENT,
        value: 67000.0,
        postal_code: '11111-111',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the address from non-existing property', async () => {
    await expect(
      updateProperty.execute({
        property_id: 'non-existing-property',
        type: PropertyTypeEnum.APARTMENT,
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
