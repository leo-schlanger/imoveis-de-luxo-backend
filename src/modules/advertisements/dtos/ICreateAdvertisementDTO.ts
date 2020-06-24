import { AdvertisementTypeEnum } from '../infra/typeorm/entities/Advertisement';

export default interface ICreateAdvertisementDTO {
  property_id: string;
  user_id: string;
  title: string;
  description?: string;
  address_visible?: boolean;
  type: AdvertisementTypeEnum;
}
