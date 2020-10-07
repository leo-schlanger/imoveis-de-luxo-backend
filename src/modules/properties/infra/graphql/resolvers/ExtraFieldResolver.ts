import { Resolver, Mutation, Arg, Query } from 'type-graphql';
import { container } from 'tsyringe';
import CreateExtraFieldService from '@modules/properties/services/CreateExtraFieldService';
import UpdateExtraFieldService from '@modules/properties/services/UpdateExtraFieldService';
import DeleteExtraFieldService from '@modules/properties/services/DeleteExtraFieldService';
import ExtraField from '../../typeorm/entities/ExtraField';
import ExtraFieldInput from '../inputs/ExtraFieldInput';
import ExtraFieldUpdateInput from '../inputs/ExtraFieldUpdateInput';

@Resolver()
export default class ExtraFieldResolver {
  @Mutation(() => ExtraField)
  async createExtraField(
    @Arg('data', () => ExtraFieldInput) data: ExtraFieldInput,
  ): Promise<ExtraField> {
    const createExtraField = container.resolve(CreateExtraFieldService);
    const property = await createExtraField.execute(data);
    return property;
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
  extraFields(): Promise<ExtraField[]> {
    return ExtraField.find();
  }
}
