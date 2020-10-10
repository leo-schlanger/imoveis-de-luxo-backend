import AppError from '@shared/errors/AppErrors';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeExtraFieldsRepository from '../../repositories/fakes/FakeExtraFieldsRepository';
import UpdateExtraFieldService from './UpdateExtraFieldService';
import { PropertyTypeEnum } from '../../infra/typeorm/entities/Property';
import { ExtraFieldTypeEnum } from '../../infra/typeorm/entities/ExtraField';

let fakeExtraFieldsRepository: FakeExtraFieldsRepository;
let fakeCacheProvider: FakeCacheProvider;
let updateExtraField: UpdateExtraFieldService;

describe('UpdateExtraField', () => {
  beforeEach(() => {
    fakeExtraFieldsRepository = new FakeExtraFieldsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    updateExtraField = new UpdateExtraFieldService(
      fakeExtraFieldsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to update a new type and name', async () => {
    const extraField = await fakeExtraFieldsRepository.create({
      name: 'teste',
      type: ExtraFieldTypeEnum.STRING,
      propertyTypes: [PropertyTypeEnum.APARTMENT, PropertyTypeEnum.GRANGE],
    });

    const updatedExtraField = await updateExtraField.execute({
      id: extraField.id,
      name: 'teste2',
      type: ExtraFieldTypeEnum.BOOLEAN,
    });

    expect(updatedExtraField.name).toBe('teste2');
    expect(updatedExtraField.type).toBe('boolean');
  });

  it('should be able to update a new property types', async () => {
    const extraField = await fakeExtraFieldsRepository.create({
      name: 'teste',
      type: ExtraFieldTypeEnum.STRING,
      propertyTypes: [PropertyTypeEnum.APARTMENT, PropertyTypeEnum.GRANGE],
    });

    const updatedExtraField = await updateExtraField.execute({
      id: extraField.id,
      propertyTypes: [
        PropertyTypeEnum.APARTMENT,
        PropertyTypeEnum.GRANGE,
        PropertyTypeEnum.OFFICE,
      ],
    });

    expect(updatedExtraField.propertyTypes).toEqual([
      PropertyTypeEnum.APARTMENT,
      PropertyTypeEnum.GRANGE,
      PropertyTypeEnum.OFFICE,
    ]);
  });

  it('should not be able to update from non-existing extra field', async () => {
    await expect(
      updateExtraField.execute({
        id: 'non-existing-extra-field',
        type: ExtraFieldTypeEnum.STRING,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
