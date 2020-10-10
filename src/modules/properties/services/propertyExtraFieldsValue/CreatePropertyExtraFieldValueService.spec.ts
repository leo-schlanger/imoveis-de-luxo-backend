import AppError from '@shared/errors/AppErrors';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakePropertiesRepository from '@modules/properties/repositories/fakes/FakePropertiesRepository';
import Address from '@modules/adresses/infra/typeorm/entities/Address';
import FakeExtraFieldsRepository from '../../repositories/fakes/FakeExtraFieldsRepository';
import FakePropertyExtraFieldValuesRepository from '../../repositories/fakes/FakePropertyExtraFieldValuesRepository';

import CreatePropertyExtraFieldValueService from './CreatePropertyExtraFieldValueService';
import { PropertyTypeEnum } from '../../infra/typeorm/entities/Property';
import { ExtraFieldTypeEnum } from '../../infra/typeorm/entities/ExtraField';

let fakePropertiesRepository: FakePropertiesRepository;
let fakeExtraFieldsRepository: FakeExtraFieldsRepository;
let fakePropertyExtraFieldValuesRepository: FakePropertyExtraFieldValuesRepository;
let fakeCacheProvider: FakeCacheProvider;
let createPropertyExtraFieldValue: CreatePropertyExtraFieldValueService;

describe('CreatePropertyExtraFieldValue', () => {
  beforeEach(() => {
    fakePropertiesRepository = new FakePropertiesRepository();
    fakeExtraFieldsRepository = new FakeExtraFieldsRepository();
    fakePropertyExtraFieldValuesRepository = new FakePropertyExtraFieldValuesRepository();
    fakeCacheProvider = new FakeCacheProvider();
    createPropertyExtraFieldValue = new CreatePropertyExtraFieldValueService(
      fakePropertyExtraFieldValuesRepository,
      fakePropertiesRepository,
      fakeExtraFieldsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to create a new extra field value', async () => {
    const property = await fakePropertiesRepository.create({
      type: PropertyTypeEnum.APARTMENT,
      value: 67000.0,
      address: {
        id: 'fake_id',
        country: 'Brasil',
        state: 'Rio de Janeiro',
        postal_code: '22222-222',
        neighborhood: 'Copacabana',
        number: '34',
        street: 'Barata Ribeiro',
      } as Address,
    });

    const extraField = await fakeExtraFieldsRepository.create({
      name: 'teste',
      type: ExtraFieldTypeEnum.STRING,
      propertyTypes: [PropertyTypeEnum.APARTMENT, PropertyTypeEnum.GRANGE],
    });

    const extraFieldValue = await createPropertyExtraFieldValue.execute({
      extra_field_id: extraField.id,
      property_id: property.id,
      value: 'teste',
    });

    expect(extraFieldValue).toHaveProperty('id');
    expect(extraFieldValue.property_id).toBe(property.id);
    expect(extraFieldValue.extra_field_id).toBe(extraField.id);
  });

  it('should not be able to create a new extra field value with invalid property', async () => {
    const extraField = await fakeExtraFieldsRepository.create({
      name: 'teste',
      type: ExtraFieldTypeEnum.STRING,
      propertyTypes: [PropertyTypeEnum.APARTMENT, PropertyTypeEnum.GRANGE],
    });

    await expect(
      createPropertyExtraFieldValue.execute({
        extra_field_id: extraField.id,
        property_id: 'invalid_property',
        value: 'teste',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new extra field value with invalid extra field', async () => {
    const property = await fakePropertiesRepository.create({
      type: PropertyTypeEnum.APARTMENT,
      value: 67000.0,
      address: {
        id: 'fake_id',
        country: 'Brasil',
        state: 'Rio de Janeiro',
        postal_code: '22222-222',
        neighborhood: 'Copacabana',
        number: '34',
        street: 'Barata Ribeiro',
      } as Address,
    });
    await expect(
      createPropertyExtraFieldValue.execute({
        extra_field_id: 'invalid_extra_field',
        property_id: property.id,
        value: 'teste',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new extra field value with invalid extra field', async () => {
    const property = await fakePropertiesRepository.create({
      type: PropertyTypeEnum.APARTMENT,
      value: 67000.0,
      address: {
        id: 'fake_id',
        country: 'Brasil',
        state: 'Rio de Janeiro',
        postal_code: '22222-222',
        neighborhood: 'Copacabana',
        number: '34',
        street: 'Barata Ribeiro',
      } as Address,
    });

    const extraField = await fakeExtraFieldsRepository.create({
      name: 'teste',
      type: ExtraFieldTypeEnum.STRING,
      propertyTypes: [PropertyTypeEnum.HOME, PropertyTypeEnum.GRANGE],
    });

    await expect(
      createPropertyExtraFieldValue.execute({
        extra_field_id: extraField.id,
        property_id: property.id,
        value: 'teste',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new extra field value with invalid values', async () => {
    const property = await fakePropertiesRepository.create({
      type: PropertyTypeEnum.APARTMENT,
      value: 67000.0,
      address: {
        id: 'fake_id',
        country: 'Brasil',
        state: 'Rio de Janeiro',
        postal_code: '22222-222',
        neighborhood: 'Copacabana',
        number: '34',
        street: 'Barata Ribeiro',
      } as Address,
    });

    let extraField = await fakeExtraFieldsRepository.create({
      name: 'teste',
      type: ExtraFieldTypeEnum.NUMBER,
      propertyTypes: [PropertyTypeEnum.APARTMENT, PropertyTypeEnum.GRANGE],
    });

    await expect(
      createPropertyExtraFieldValue.execute({
        extra_field_id: extraField.id,
        property_id: property.id,
        value: 'teste34.',
      }),
    ).rejects.toBeInstanceOf(AppError);

    let extraFieldValue = await createPropertyExtraFieldValue.execute({
      extra_field_id: extraField.id,
      property_id: property.id,
      value: '34.9',
    });

    expect(extraFieldValue).toHaveProperty('id');

    extraFieldValue = await createPropertyExtraFieldValue.execute({
      extra_field_id: extraField.id,
      property_id: property.id,
      value: '17',
    });

    expect(extraFieldValue).toHaveProperty('id');

    extraField = await fakeExtraFieldsRepository.create({
      name: 'teste',
      type: ExtraFieldTypeEnum.BOOLEAN,
      propertyTypes: [PropertyTypeEnum.APARTMENT, PropertyTypeEnum.GRANGE],
    });

    extraFieldValue = await createPropertyExtraFieldValue.execute({
      extra_field_id: extraField.id,
      property_id: property.id,
      value: 'true',
    });

    expect(extraFieldValue).toHaveProperty('id');

    await expect(
      createPropertyExtraFieldValue.execute({
        extra_field_id: extraField.id,
        property_id: property.id,
        value: 'teste34.',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
