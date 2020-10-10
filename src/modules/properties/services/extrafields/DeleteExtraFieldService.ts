import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppErrors';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IExtraFieldsRepository from '../../repositories/IExtraFieldsRepository';

interface IRequest {
  id: string;
}

@injectable()
class DeleteExtraFieldService {
  constructor(
    @inject('ExtraFieldsRepository')
    private extraFieldsRepository: IExtraFieldsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ id }: IRequest): Promise<void> {
    const extraField = await this.extraFieldsRepository.findById(id);

    if (!extraField) {
      throw new AppError('Extra field not found');
    }

    extraField.propertyTypes.forEach(async type => {
      await this.cacheProvider.invalidate(`extra_fields:${type}`);
    });

    await this.extraFieldsRepository.delete(extraField.id);
  }
}

export default DeleteExtraFieldService;
