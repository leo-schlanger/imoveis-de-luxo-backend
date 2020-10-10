import { Resolver, Mutation, Arg, Query } from 'type-graphql';
import { container } from 'tsyringe';
import CreateExtraFieldService from '@modules/properties/services/extrafields/CreateExtraFieldService';
import UpdateExtraFieldService from '@modules/properties/services/extrafields/UpdateExtraFieldService';
import DeleteExtraFieldService from '@modules/properties/services/extrafields/DeleteExtraFieldService';
import ListExtraFieldByPropertyTypeService from '@modules/properties/services/extrafields/ListExtraFieldsByPropertyTypeService';
import ExtraField from '../../typeorm/entities/ExtraField';
import ExtraFieldInput from '../inputs/ExtraFieldInput';
import ExtraFieldUpdateInput from '../inputs/ExtraFieldUpdateInput';
import { PropertyTypeEnum } from '../../typeorm/entities/Property';

@Resolver()
export default class ExtraFieldResolver {
  @Mutation(() => ExtraField)
  async createExtraField(
    @Arg('data', () => ExtraFieldInput) data: ExtraFieldInput,
  ): Promise<ExtraField> {
    const createExtraField = container.resolve(CreateExtraFieldService);
    const extraField = await createExtraField.execute(data);
    return extraField;
  }

  @Mutation(() => ExtraField)
  async updateExtraField(
    @Arg('id', () => String) id: string,
    @Arg('data', () => ExtraFieldUpdateInput) data: ExtraFieldUpdateInput,
  ): Promise<ExtraField | undefined> {
    const updateExtraField = container.resolve(UpdateExtraFieldService);
    const updatedExtraField = updateExtraField.execute({
      id,
      ...data,
    });
    return updatedExtraField;
  }

  @Mutation(() => Boolean)
  async deleteExtraField(
    @Arg('id', () => String) id: string,
  ): Promise<boolean> {
    const deleteExtraField = container.resolve(DeleteExtraFieldService);
    await deleteExtraField.execute({ id });
    return true;
  }

  @Query(() => [ExtraField])
  async extraFields(): Promise<ExtraField[]> {
    return ExtraField.find();
  }

  @Query(() => [ExtraField])
  async extraFieldsByPropertyType(
    @Arg('propertyType', () => PropertyTypeEnum) propertyType: PropertyTypeEnum,
  ): Promise<ExtraField[] | undefined> {
    const listExtraFieldByPropertyTypeService = container.resolve(
      ListExtraFieldByPropertyTypeService,
    );
    const listExtraField = listExtraFieldByPropertyTypeService.execute({
      type: propertyType,
    });

    return listExtraField;
  }
}
