import AppError from '@shared/errors/AppErrors';

import FakeAdressesRepository from '@modules/adresses/repositories/fakes/FakeAdressesRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakePropertiesRepository from '../../repositories/fakes/FakePropertiesRepository';

import DeletePropertyService from './DeletePropertyService';
import { PropertyTypeEnum } from '../../infra/typeorm/entities/Property';

let fakePropertiesRepository: FakePropertiesRepository;
let fakeAdressesRepository: FakeAdressesRepository;
let fakeCacheProvider: FakeCacheProvider;
let deleteProperty: DeletePropertyService;

describe('deleteProperty', () => {
  beforeEach(() => {
    fakePropertiesRepository = new FakePropertiesRepository();
    fakeAdressesRepository = new FakeAdressesRepository();
    fakeCacheProvider = new FakeCacheProvider();
    deleteProperty = new DeletePropertyService(
      fakePropertiesRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to delete a property', async () => {
    const address = await fakeAdressesRepository.create({
      country: 'Brasil',
      state: 'Rio de Janeiro',
      postal_code: '22222-222',
      neighborhood: 'Copacabana',
      street: 'Barata Ribeiro',
    });

    const property = await fakePropertiesRepository.create({
      type: PropertyTypeEnum.APARTMENT,
      value: 67000.0,
      address,
    });

    await fakePropertiesRepository.save(property);

    expect(property).toHaveProperty('id');

    const confirmProperty = await fakePropertiesRepository.findById(
      property.id,
    );
    expect(confirmProperty).toBe(property);

    await deleteProperty.execute({ id: property.id });

    const confirmPropertyDeleted = await fakePropertiesRepository.findById(
      property.id,
    );

    expect(confirmPropertyDeleted).toBeUndefined();
  });

  it('should not be able to delete a non-exists property', async () => {
    await expect(
      deleteProperty.execute({
        id: 'non-exists-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
