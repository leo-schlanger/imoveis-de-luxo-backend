import { ExtraFieldTypeEnum } from '../infra/typeorm/entities/ExtraField';
import { PropertyTypeEnum } from '../infra/typeorm/entities/Property';

export default interface ICreateExtraFieldDTO {
  name: string;
  type: ExtraFieldTypeEnum;
  propertyTypes: PropertyTypeEnum[];
}
