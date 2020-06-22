import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppErrors';

import IAdressesRepository from '@modules/adresses/repositories/IAdressesRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IPropertiesRepository from '../repositories/IPropertiesRepository';

interface IRequest {
  id: string;
}

@injectable()
class DeletePropertyService {
  constructor(
    @inject('PropertiesRepository')
    private propertiesRepository: IPropertiesRepository,

    @inject('AdressesRepository')
    private adressesRepository: IAdressesRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ id }: IRequest): Promise<void> {
    const property = await this.propertiesRepository.findById(id);

    if (!property) {
      throw new AppError('Property not found');
    }

    await this.cacheProvider.invalidate(`properties:${property.type}`);

    await this.adressesRepository.delete(property.address_id);

    // TODO: pode ter limpeza de cache de endereço também mais para frente

    await this.propertiesRepository.delete(property.id);
  }
}

export default DeletePropertyService;
