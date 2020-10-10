// import AppError from '@shared/errors/AppErrors';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeExtraFieldsRepository from '../../repositories/fakes/FakeExtraFieldsRepository';

import CreateExtraFieldService from './CreateExtraFieldService';
import { PropertyTypeEnum } from '../../infra/typeorm/entities/Property';
import { ExtraFieldTypeEnum } from '../../infra/typeorm/entities/ExtraField';

let fakeExtraFieldsRepository: FakeExtraFieldsRepository;
let fakeCacheProvider: FakeCacheProvider;
let createExtraField: CreateExtraFieldService;

describe('CreateExtraField', () => {
  beforeEach(() => {
    fakeExtraFieldsRepository = new FakeExtraFieldsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    createExtraField = new CreateExtraFieldService(
      fakeExtraFieldsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to create a new extra field', async () => {
    const extraField = await createExtraField.execute({
      name: 'teste',
      type: ExtraFieldTypeEnum.STRING,
      propertyTypes: [PropertyTypeEnum.APARTMENT, PropertyTypeEnum.GRANGE],
    });

    expect(extraField).toHaveProperty('id');
  });
});
