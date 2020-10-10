import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import { classToClass } from 'class-transformer';
import FakeAdressesRepository from '@modules/adresses/repositories/fakes/FakeAdressesRepository';
import FakePropertiesRepository from '../../repositories/fakes/FakePropertiesRepository';
import ListPropertiesByTypeService from './ListPropertiesByTypeService';
import { PropertyTypeEnum } from '../../infra/typeorm/entities/Property';

let fakeAdressesRepository: FakeAdressesRepository;
let fakePropertiesRepository: FakePropertiesRepository;
let listPropertiesByType: ListPropertiesByTypeService;
let fakeCacheProvider: FakeCacheProvider;

describe('ListPropertiesByTypeService', () => {
  beforeEach(() => {
    fakeAdressesRepository = new FakeAdressesRepository();
    fakePropertiesRepository = new FakePropertiesRepository();
    fakeCacheProvider = new FakeCacheProvider();
    listPropertiesByType = new ListPropertiesByTypeService(
      fakePropertiesRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to list the properties by type', async () => {
    let properties = await listPropertiesByType.execute({
      type: PropertyTypeEnum.APARTMENT,
    });

    expect(properties).toEqual([]);

    const address = await fakeAdressesRepository.create({
      country: 'Brasil',
      state: 'Rio de Janeiro',
      postal_code: '22222-222',
      neighborhood: 'Copacabana',
      number: '12',
      complement: 'B',
      description: 'description',
      sub_neighborhood: 'example',
      street: 'Barata Ribeiro',
    });

    const property1 = await fakePropertiesRepository.create({
      type: PropertyTypeEnum.APARTMENT,
      value: 67000.0,
      address,
    });

    properties = await listPropertiesByType.execute({
      type: PropertyTypeEnum.APARTMENT,
    });
    expect(properties).toEqual([]);

    fakeCacheProvider.invalidate(`properties:apartment`);

    properties = await listPropertiesByType.execute({
      type: PropertyTypeEnum.APARTMENT,
    });

    expect(properties).toEqual([classToClass(property1)]);
    const property2 = await fakePropertiesRepository.create({
      type: PropertyTypeEnum.HOME,
      value: 167000.0,
      address,
    });

    properties = await fakePropertiesRepository.show();

    expect(properties).toEqual([property1, property2]);

    properties = await listPropertiesByType.execute({
      type: PropertyTypeEnum.HOME,
    });

    expect(properties).toEqual([classToClass(property2)]);

    fakeCacheProvider.invalidate(`properties:home`);
  });
});
