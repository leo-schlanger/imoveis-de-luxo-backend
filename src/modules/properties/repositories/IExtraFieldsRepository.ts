import ICreateExtraFieldDTO from '@modules/properties/dtos/ICreateExtraFieldDTO';
import ExtraField, {
  ExtraFieldTypeEnum,
} from '../infra/typeorm/entities/ExtraField';
import { PropertyTypeEnum } from '../infra/typeorm/entities/Property';

export default interface IExtraFieldsRepository {
  show(): Promise<ExtraField[]>;
  findById(id: string): Promise<ExtraField | undefined>;
  filterByType(type: ExtraFieldTypeEnum): Promise<ExtraField[] | undefined>;
  filterByPropertyType(
    type: PropertyTypeEnum,
  ): Promise<ExtraField[] | undefined>;
  create(data: ICreateExtraFieldDTO): Promise<ExtraField>;
  delete(id: string): Promise<void>;
  save(ExtraField: ExtraField): Promise<ExtraField>;
}
