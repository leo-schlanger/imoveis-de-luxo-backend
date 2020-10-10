import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppErrors';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IPropertyExtraFieldValuesRepository from '../../repositories/IPropertyExtraFieldValuesRepository';

interface IRequest {
  id: string;
}

@injectable()
class DeletePropertyExtraFieldValueService {
  constructor(
    @inject('PropertyExtraFieldValuesRepository')
    private propertyExtraFieldValuesRepository: IPropertyExtraFieldValuesRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ id }: IRequest): Promise<void> {
    const propertyExtraFieldValue = await this.propertyExtraFieldValuesRepository.findById(
      id,
    );

    if (!propertyExtraFieldValue) {
      throw new AppError('Extra field value not found');
    }

    await this.cacheProvider.invalidate(
      `extra_fields_value_property:${propertyExtraFieldValue.property_id}`,
    );

    await this.propertyExtraFieldValuesRepository.delete(
      propertyExtraFieldValue.id,
    );
  }
}

export default DeletePropertyExtraFieldValueService;
