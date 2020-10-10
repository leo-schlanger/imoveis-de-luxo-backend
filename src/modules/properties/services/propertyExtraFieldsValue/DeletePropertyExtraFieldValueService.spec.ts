import AppError from '@shared/errors/AppErrors';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakePropertyExtraFieldValuesRepository from '../../repositories/fakes/FakePropertyExtraFieldValuesRepository';

import DeletePropertyExtraFieldValueService from './DeletePropertyExtraFieldValueService';

let fakePropertyExtraFieldValuesRepository: FakePropertyExtraFieldValuesRepository;
let fakeCacheProvider: FakeCacheProvider;
let deletePropertyExtraFieldValue: DeletePropertyExtraFieldValueService;

describe('deletePropertyExtraFieldValue', () => {
  beforeEach(() => {
    fakePropertyExtraFieldValuesRepository = new FakePropertyExtraFieldValuesRepository();
    fakeCacheProvider = new FakeCacheProvider();
    deletePropertyExtraFieldValue = new DeletePropertyExtraFieldValueService(
      fakePropertyExtraFieldValuesRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to delete a extra field value', async () => {
    const PropertyExtraFieldValue = await fakePropertyExtraFieldValuesRepository.create(
      {
        extra_field_id: 'id_extra_field',
        property_id: 'id_property',
        value: 'value',
      },
    );

    await fakePropertyExtraFieldValuesRepository.save(PropertyExtraFieldValue);

    expect(PropertyExtraFieldValue).toHaveProperty('id');

    const confirmPropertyExtraFieldValue = await fakePropertyExtraFieldValuesRepository.findById(
      PropertyExtraFieldValue.id,
    );
    expect(confirmPropertyExtraFieldValue).toBe(PropertyExtraFieldValue);

    await deletePropertyExtraFieldValue.execute({
      id: PropertyExtraFieldValue.id,
    });

    const confirmPropertyExtraFieldValueDeleted = await fakePropertyExtraFieldValuesRepository.findById(
      PropertyExtraFieldValue.id,
    );

    expect(confirmPropertyExtraFieldValueDeleted).toBeUndefined();
  });

  it('should not be able to delete a non-exists extra field value', async () => {
    await expect(
      deletePropertyExtraFieldValue.execute({
        id: 'non-exists-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
