import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakePropertyExtraFieldValuesRepository from '../../repositories/fakes/FakePropertyExtraFieldValuesRepository';
import ListPropertyExtraFieldValuesByPropertyService from './ListPropertyExtraFieldValuesByPropertyService';

let fakePropertyExtraFieldValuesRepository: FakePropertyExtraFieldValuesRepository;
let listPropertyExtraFieldValuesByProperty: ListPropertyExtraFieldValuesByPropertyService;
let fakeCacheProvider: FakeCacheProvider;

describe('ListPropertyExtraFieldValuesByPropertyService', () => {
  beforeEach(() => {
    fakePropertyExtraFieldValuesRepository = new FakePropertyExtraFieldValuesRepository();
    fakeCacheProvider = new FakeCacheProvider();
    listPropertyExtraFieldValuesByProperty = new ListPropertyExtraFieldValuesByPropertyService(
      fakePropertyExtraFieldValuesRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to list the extra fields by type', async () => {
    let propertyExtraFieldValues = await listPropertyExtraFieldValuesByProperty.execute(
      {
        id: '1',
      },
    );

    expect(propertyExtraFieldValues).toEqual([]);

    const propertyExtraFieldValue1 = await fakePropertyExtraFieldValuesRepository.create(
      {
        property_id: '1',
        extra_field_id: '1',
        value: 'value',
      },
    );

    propertyExtraFieldValues = await listPropertyExtraFieldValuesByProperty.execute(
      {
        id: '1',
      },
    );
    expect(propertyExtraFieldValues).toEqual([]);

    fakeCacheProvider.invalidate(`extra_fields_value_property:1`);

    propertyExtraFieldValues = await listPropertyExtraFieldValuesByProperty.execute(
      {
        id: '1',
      },
    );

    expect(propertyExtraFieldValues).toEqual([propertyExtraFieldValue1]);

    const propertyExtraFieldValue2 = await fakePropertyExtraFieldValuesRepository.create(
      {
        property_id: '2',
        extra_field_id: '2',
        value: 'value',
      },
    );

    propertyExtraFieldValues = await fakePropertyExtraFieldValuesRepository.show();

    expect(propertyExtraFieldValues).toEqual([
      propertyExtraFieldValue1,
      propertyExtraFieldValue2,
    ]);

    propertyExtraFieldValues = await listPropertyExtraFieldValuesByProperty.execute(
      {
        id: '2',
      },
    );

    expect(propertyExtraFieldValues).toEqual([propertyExtraFieldValue2]);

    fakeCacheProvider.invalidate(`extra_fields_value_property:2`);
  });
});
