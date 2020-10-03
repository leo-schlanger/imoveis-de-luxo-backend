import AppError from '@shared/errors/AppErrors';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeExtraFieldsRepository from '../repositories/fakes/FakeExtraFieldsRepository';

import DeleteExtraFieldService from './DeleteExtraFieldService';
import { PropertyTypeEnum } from '../infra/typeorm/entities/Property';
import { ExtraFieldTypeEnum } from '../infra/typeorm/entities/ExtraField';

let fakeExtraFieldsRepository: FakeExtraFieldsRepository;
let fakeCacheProvider: FakeCacheProvider;
let deleteExtraField: DeleteExtraFieldService;

describe('deleteExtraField', () => {
  beforeEach(() => {
    fakeExtraFieldsRepository = new FakeExtraFieldsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    deleteExtraField = new DeleteExtraFieldService(
      fakeExtraFieldsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to delete a extra field', async () => {
    const extraField = await fakeExtraFieldsRepository.create({
      name: 'teste',
      type: ExtraFieldTypeEnum.STRING,
      propertyTypes: [PropertyTypeEnum.APARTMENT, PropertyTypeEnum.GRANGE],
    });

    await fakeExtraFieldsRepository.save(extraField);

    expect(extraField).toHaveProperty('id');

    const confirmExtraField = await fakeExtraFieldsRepository.findById(
      extraField.id,
    );
    expect(confirmExtraField).toBe(extraField);

    await deleteExtraField.execute({ id: extraField.id });

    const confirmExtraFieldDeleted = await fakeExtraFieldsRepository.findById(
      extraField.id,
    );

    expect(confirmExtraFieldDeleted).toBeUndefined();
  });

  it('should not be able to delete a non-exists extra field', async () => {
    await expect(
      deleteExtraField.execute({
        id: 'non-exists-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
