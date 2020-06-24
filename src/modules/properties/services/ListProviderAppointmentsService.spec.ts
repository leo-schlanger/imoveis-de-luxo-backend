import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import { classToClass } from 'class-transformer';
import FakePropertiesRepository from '../repositories/fakes/FakePropertiesRepository';
import ListPropertiesByTypeService from './ListPropertiesByTypeService';

let fakePropertiesRepository: FakePropertiesRepository;
let listPropertiesByType: ListPropertiesByTypeService;
let fakeCacheProvider: FakeCacheProvider;

describe('ListPropertiesByTypeService', () => {
  beforeEach(() => {
    fakePropertiesRepository = new FakePropertiesRepository();
    fakeCacheProvider = new FakeCacheProvider();
    listPropertiesByType = new ListPropertiesByTypeService(
      fakePropertiesRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to list the properties by type', async () => {
    let properties = await listPropertiesByType.execute({
      type: 'apartment',
    });

    expect(properties).toEqual([]);

    const property1 = await fakePropertiesRepository.create({
      type: 'apartment',
      value: 67000.0,
      address: {
        id: 'test',
        country: 'Brasil',
        state: 'Rio de Janeiro',
        postal_code: '22222-222',
        neighborhood: 'Copacabana',
        number: '12',
        complement: 'B',
        description: 'description',
        sub_neighborhood: 'example',
        address: 'Barata Ribeiro',
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    properties = await listPropertiesByType.execute({
      type: 'apartment',
    });
    expect(properties).toEqual([]);

    fakeCacheProvider.invalidate(`properties:apartment`);

    properties = await listPropertiesByType.execute({
      type: 'apartment',
    });

    expect(properties).toEqual([classToClass(property1)]);

    const property2 = await fakePropertiesRepository.create({
      type: 'home',
      value: 167000.0,
      address: {
        id: 'test',
        country: 'Brasil',
        state: 'Rio de Janeiro',
        postal_code: '22222-222',
        neighborhood: 'Copacabana',
        number: '12',
        complement: 'B',
        description: 'description',
        sub_neighborhood: 'example',
        address: 'Barata Ribeiro',
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    properties = await fakePropertiesRepository.show();

    expect(properties).toEqual([property1, property2]);

    properties = await listPropertiesByType.execute({
      type: 'home',
    });

    expect(properties).toEqual([classToClass(property2)]);

    fakeCacheProvider.invalidate(`properties:home`);
  });
});
