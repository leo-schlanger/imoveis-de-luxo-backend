export default interface ICreatePlanDTO {
  name: string;
  description?: string;
  quantity_properties: number;
  quantity_photos: number;
  quantity_videos: number;
  value: number;
}
