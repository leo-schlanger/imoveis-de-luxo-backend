import { PropertyTypeEnum } from '@modules/properties/infra/typeorm/entities/Property';
import { AdvertisementTypeEnum } from '../infra/typeorm/entities/Advertisement';

export default interface IShowAdvertisementsDTO {
  per_page?: number;
  page?: number;
  filter?: {
    type: AdvertisementTypeEnum;
    property?: {
      type: PropertyTypeEnum;
      address?: {
        country?: string;
        state?: string;
        neighborhood?: string;
        street?: string;
      };
    };
  };
}
