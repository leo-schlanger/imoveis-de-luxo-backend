import IAdvertisementsRepository from '@modules/advertisements/repositories/IAdvertisementsRepository';
import ICreateAdvertisementDTO from '@modules/advertisements/dtos/ICreateAdvertisementDTO';

import Advertisement, {
  AdvertisementTypeEnum,
} from '../../infra/typeorm/entities/Advertisement';
import IShowAdvertisementsDTO from '../../dtos/IShowAdvertisementsDTO';

class FakeAdvertisementsRepository implements IAdvertisementsRepository {
  private advertisements: Advertisement[] = [];

  public async show(
    _data: IShowAdvertisementsDTO,
  ): Promise<[Advertisement[], number]> {
    return [this.advertisements, this.advertisements.length];
  }

  public async findById(id: number): Promise<Advertisement | undefined> {
    const findAdvertisement = this.advertisements.find(
      advertisement => advertisement.id === id,
    );

    return findAdvertisement;
  }

  public async findByProperty(
    property_id: string,
  ): Promise<Advertisement | undefined> {
    const findAdvertisement = this.advertisements.find(
      advertisement => advertisement.property_id === property_id,
    );

    return findAdvertisement;
  }

  public async filterByType(
    type: AdvertisementTypeEnum,
  ): Promise<Advertisement[] | undefined> {
    const listAdvertisement = this.advertisements.filter(
      advertisement => advertisement.type === type,
    );

    return listAdvertisement;
  }

  public async create({
    title,
    description = '',
    property_id,
    user_id,
    address_visible = true,
    type,
  }: ICreateAdvertisementDTO): Promise<Advertisement> {
    const advertisement = new Advertisement();

    Object.assign(
      advertisement,
      { id: Math.random() * 100 },
      {
        title,
        description,
        property_id,
        user_id,
        address_visible,
        type,
        gallery: [],
      },
    );

    this.advertisements.push(advertisement);

    return advertisement;
  }

  public async delete(id: number): Promise<void> {
    const newList = this.advertisements.filter(
      advertisement => advertisement.id !== id,
    );

    this.advertisements = newList;
  }

  public async save(advertisement: Advertisement): Promise<Advertisement> {
    const findIndex = this.advertisements.findIndex(
      findAdvertisement => findAdvertisement.id === advertisement.id,
    );

    this.advertisements[findIndex] = advertisement;

    return advertisement;
  }
}

export default FakeAdvertisementsRepository;
