import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppErrors';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import { UserTypeEnum } from '@modules/users/infra/typeorm/entities/User';
import Advertisement, {
  AdvertisementTypeEnum,
} from '../infra/typeorm/entities/Advertisement';
import IAdvertisementsRepository from '../repositories/IAdvertisementsRepository';

interface IRequest {
  user_id: string;
  advertisement_id: number;
  title?: string;
  description?: string;
  address_visible: boolean;
  status?: boolean;
  type: AdvertisementTypeEnum;
}

// TODO: Rever testes e atualizar condições

@injectable()
class UpdateAdvertisementService {
  constructor(
    @inject('AdvertisementsRepository')
    private advertisementsRepository: IAdvertisementsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    // TODO: Implementar limpeza de cache ao atualizar novo anúncio
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    user_id,
    advertisement_id,
    title,
    description,
    address_visible,
    status,
    type,
  }: IRequest): Promise<Advertisement> {
    const advertisement = await this.advertisementsRepository.findById(
      advertisement_id,
    );

    if (!advertisement) {
      throw new AppError('Advertisement not found.');
    }

    if (advertisement.user_id !== user_id) {
      const user = await this.usersRepository.findById(user_id);
      if (!user || user.type !== UserTypeEnum.ADM)
        throw new AppError(`${user?.type}`, 401);
    }

    if (advertisement.type !== type) {
      // TODO: implementação de cache aqui
      advertisement.type = type;
    }

    advertisement.address_visible = address_visible;

    if (status) {
      advertisement.status = status;
    }

    if (title) {
      advertisement.title = title;
    }

    if (description) {
      advertisement.description = description;
    }

    return this.advertisementsRepository.save(advertisement);
  }
}

export default UpdateAdvertisementService;
