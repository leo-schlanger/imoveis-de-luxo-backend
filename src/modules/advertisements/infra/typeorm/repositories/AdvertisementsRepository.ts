import { getRepository, Repository } from 'typeorm';

import IAdvertisementsRepository from '@modules/advertisements/repositories/IAdvertisementsRepository';
import ICreateAdvertisementDTO from '@modules/advertisements/dtos/ICreateAdvertisementDTO';
import IShowAdvertisementsDTO from '@modules/advertisements/dtos/IShowAdvertisementsDTO';
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
  }: IShowAdvertisementsDTO): Promise<[Advertisement[], number]> {
    const adList = this.ormRepository
      .createQueryBuilder('advertisement')
      .leftJoinAndSelect('advertisement.user', 'user')
      .leftJoinAndSelect('advertisement.property', 'property')
      .leftJoinAndSelect('advertisement.gallery', 'gallery')
      .leftJoinAndSelect('property.address', 'address');

    if (filter) {
      const { type, property, user_id } = filter;

      if (user_id) {
        adList.andWhere('advertisement.user.id = :id', { id: user_id });
      }

      if (type) {
        adList.andWhere('advertisement.type = :type', { type });
      }

      if (property) {
        const { type: propertyType, address } = property;

        if (propertyType) {
          adList.andWhere('property.type = :propertyType', {
            propertyType,
          });
        }

        if (address) {
          const addressFields = Object.entries(address);

          addressFields.map(field =>
            adList.andWhere(`address.${field[0]} = :${field[0]}`, {
              [field[0]]: field[1],
            }),
          );
        }
      }
    }

    return adList
      .skip((page - 1) * per_page)
      .take(per_page)
      .addOrderBy('advertisement.created_at', 'DESC')
      .getManyAndCount();
  }

  public async findById(id: number): Promise<Advertisement | undefined> {
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

  public async create(
    newAdvertisement: ICreateAdvertisementDTO,
  ): Promise<Advertisement> {
    const advertisement = this.ormRepository.create(newAdvertisement);

    await this.ormRepository.save(advertisement);

    return advertisement;
  }

  public async delete(id: number): Promise<void> {
    await this.ormRepository.delete(id);
  }

  public async save(advertisement: Advertisement): Promise<Advertisement> {
    return this.ormRepository.save(advertisement);
  }
}

export default AdvertisementsRepository;
