import { MediaTypeEnum } from '../infra/typeorm/entities/Media';

export default interface ICreateMediaDTO {
  advertisement_id: string;
  filename: string;
  type: MediaTypeEnum;
}
