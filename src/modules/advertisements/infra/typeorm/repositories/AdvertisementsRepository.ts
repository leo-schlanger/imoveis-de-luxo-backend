import { getRepository, Repository } from 'typeorm';

import IAdvertisementsRepository from '@modules/advertisements/repositories/IAdvertisementsRepository';
import ICreateAdvertisementDTO from '@modules/advertisements/dtos/ICreateAdvertisementDTO';
import IShowAdvertisementsDTO from '@modules/advertisements/dtos/IShowAdvertisemetsDTO';
import Advertisement, {
  AdvertisementTypeEnum,
} from '../entities/Advertisement';

class AdvertisementsRepository implements IAdvertisementsRepository {
  private ormRepository: Repository<Advertisement>;

  constructor() {
    this.ormRepository = getRepository(Advertisement);
  }

  public async show({
    per_page = 20,
    page = 1,
    filter,
  }: IShowAdvertisementsDTO): Promise<Advertisement[]> {
    return this.ormRepository.find({
      where: filter,
      take: per_page,
      skip: (page - 1) * per_page,
      cache: true,
    });
  }

  public async findById(id: string): Promise<Advertisement | undefined> {
    const findAdvertisement = await this.ormRepository.findOne(id);

    return findAdvertisement;
  }

  public async findByProperty(
    property_id: string,
  ): Promise<Advertisement | undefined> {
    const findAdvertisement = await this.ormRepository.findOne({
      where: {
        property_id,
      },
    });

    return findAdvertisement;
  }

  public async filterByType(
    type: AdvertisementTypeEnum,
  ): Promise<Advertisement[] | undefined> {
    const findAdvertisement = await this.ormRepository.find({
      where: { type },
    });

    return findAdvertisement;
  }

  public async create({
    title,
    description = '',
    property_id,
    user_id,
    address_visible = true,
    type,
  }: ICreateAdvertisementDTO): Promise<Advertisement> {
    const advertisement = this.ormRepository.create({
      title,
      description,
      property_id,
      user_id,
      address_visible,
      type,
    });

    await this.ormRepository.save(advertisement);

    return advertisement;
  }

  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }

  public async save(advertisement: Advertisement): Promise<Advertisement> {
    return this.ormRepository.save(advertisement);
  }
}

export default AdvertisementsRepository;
