import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeExtraFieldsRepository from '../../repositories/fakes/FakeExtraFieldsRepository';
import ListExtraFieldsByPropertyTypeService from './ListExtraFieldsByPropertyTypeService';
import { PropertyTypeEnum } from '../../infra/typeorm/entities/Property';
import { ExtraFieldTypeEnum } from '../../infra/typeorm/entities/ExtraField';

let fakeExtraFieldsRepository: FakeExtraFieldsRepository;
let listExtraFieldsByPropertyType: ListExtraFieldsByPropertyTypeService;
let fakeCacheProvider: FakeCacheProvider;

describe('ListExtraFieldsByPropertyTypeService', () => {
  beforeEach(() => {
    fakeExtraFieldsRepository = new FakeExtraFieldsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    listExtraFieldsByPropertyType = new ListExtraFieldsByPropertyTypeService(
      fakeExtraFieldsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to list the extra fields by type', async () => {
    let extraFields = await listExtraFieldsByPropertyType.execute({
      type: PropertyTypeEnum.APARTMENT,
    });

    expect(extraFields).toEqual([]);

    const extraField1 = await fakeExtraFieldsRepository.create({
      name: 'teste1',
      type: ExtraFieldTypeEnum.STRING,
      propertyTypes: [PropertyTypeEnum.APARTMENT, PropertyTypeEnum.GRANGE],
    });

    extraFields = await listExtraFieldsByPropertyType.execute({
      type: PropertyTypeEnum.APARTMENT,
    });
    expect(extraFields).toEqual([]);

    fakeCacheProvider.invalidate(`extra_fields:apartment`);

    extraFields = await listExtraFieldsByPropertyType.execute({
      type: PropertyTypeEnum.APARTMENT,
    });

    expect(extraFields).toEqual([extraField1]);
    const extraField2 = await fakeExtraFieldsRepository.create({
      name: 'teste2',
      type: ExtraFieldTypeEnum.STRING,
      propertyTypes: [
        PropertyTypeEnum.APARTMENT,
        PropertyTypeEnum.GRANGE,
        PropertyTypeEnum.HOME,
      ],
    });

    extraFields = await fakeExtraFieldsRepository.show();

    expect(extraFields).toEqual([extraField1, extraField2]);

    extraFields = await listExtraFieldsByPropertyType.execute({
      type: PropertyTypeEnum.HOME,
    });

    expect(extraFields).toEqual([extraField2]);

    fakeCacheProvider.invalidate(`extra_fields:home`);
  });
});
