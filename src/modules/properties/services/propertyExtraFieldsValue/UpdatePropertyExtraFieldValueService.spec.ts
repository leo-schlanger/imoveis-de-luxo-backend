import AppError from '@shared/errors/AppErrors';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakePropertyExtraFieldValuesRepository from '../../repositories/fakes/FakePropertyExtraFieldValuesRepository';
import UpdatePropertyExtraFieldValueService from './UpdatePropertyExtraFieldValueService';
import ExtraField, {
  ExtraFieldTypeEnum,
} from '../../infra/typeorm/entities/ExtraField';

let fakePropertyExtraFieldValuesRepository: FakePropertyExtraFieldValuesRepository;
let fakeCacheProvider: FakeCacheProvider;
let updatePropertyExtraFieldValue: UpdatePropertyExtraFieldValueService;

describe('UpdatePropertyExtraFieldValue', () => {
  beforeEach(() => {
    fakePropertyExtraFieldValuesRepository = new FakePropertyExtraFieldValuesRepository();
    fakeCacheProvider = new FakeCacheProvider();
    updatePropertyExtraFieldValue = new UpdatePropertyExtraFieldValueService(
      fakePropertyExtraFieldValuesRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to update a new value', async () => {
    const propertyExtraFieldValue = await fakePropertyExtraFieldValuesRepository.create(
      {
        property_id: 'property_id',
        extra_field_id: 'extra_field_id',
        value: 'value',
      },
    );

    propertyExtraFieldValue.extraField = {
      type: ExtraFieldTypeEnum.STRING,
    } as ExtraField;

    const updatedExtraField = await updatePropertyExtraFieldValue.execute({
      id: propertyExtraFieldValue.id,
      value: 'updated',
    });

    expect(updatedExtraField.value).toBe('updated');
  });

  it('should not be able to update a new value with invalid type field', async () => {
    const propertyExtraFieldValue = await fakePropertyExtraFieldValuesRepository.create(
      {
        property_id: 'property_id',
        extra_field_id: 'extra_field_id',
        value: '320',
      },
    );

    propertyExtraFieldValue.extraField = {
      type: ExtraFieldTypeEnum.NUMBER,
    } as ExtraField;

    await expect(
      updatePropertyExtraFieldValue.execute({
        id: propertyExtraFieldValue.id,
        value: 'updated',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update from non-existing extra field', async () => {
    await expect(
      updatePropertyExtraFieldValue.execute({
        id: 'invalid_id',
        value: 'updated',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
