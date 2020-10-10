import { Resolver, Mutation, Arg, Query } from 'type-graphql';
import { container } from 'tsyringe';
import CreatePropertyExtraFieldValueService from '@modules/properties/services/propertyExtraFieldsValue/CreatePropertyExtraFieldValueService';
import UpdatePropertyExtraFieldValueService from '@modules/properties/services/propertyExtraFieldsValue/UpdatePropertyExtraFieldValueService';
import DeletePropertyExtraFieldValueService from '@modules/properties/services/propertyExtraFieldsValue/DeletePropertyExtraFieldValueService';
import ListPropertyExtraFieldValuesByPropertyService from '@modules/properties/services/propertyExtraFieldsValue/ListPropertyExtraFieldValuesByPropertyService';
import PropertyExtraFieldValue from '../../typeorm/entities/PropertyExtraFieldValue';
import PropertyExtraFieldValueInput from '../inputs/PropertyExtraFieldValueInput';

@Resolver()
export default class PropertyExtraFieldValueResolver {
  @Mutation(() => PropertyExtraFieldValue)
  async createPropertyExtraField(
    @Arg('data', () => PropertyExtraFieldValueInput)
    data: PropertyExtraFieldValueInput,
  ): Promise<PropertyExtraFieldValue> {
    const createExtraField = container.resolve(
      CreatePropertyExtraFieldValueService,
    );
    const propertyExtraFieldValue = await createExtraField.execute(data);
    return propertyExtraFieldValue;
  }

  @Mutation(() => PropertyExtraFieldValue)
  async updatePropertyExtraField(
    @Arg('id', () => String) id: string,
    @Arg('value', () => String) value: string,
  ): Promise<PropertyExtraFieldValue | undefined> {
    const updateExtraField = container.resolve(
      UpdatePropertyExtraFieldValueService,
    );
    const updatedPropertyExtraFieldValue = updateExtraField.execute({
      id,
      value,
    });
    return updatedPropertyExtraFieldValue;
  }

  @Mutation(() => Boolean)
  async deletePropertyExtraField(
    @Arg('id', () => String) id: string,
  ): Promise<boolean> {
    const deleteExtraField = container.resolve(
      DeletePropertyExtraFieldValueService,
    );
    await deleteExtraField.execute({ id });
    return true;
  }

  @Query(() => [PropertyExtraFieldValue])
  async allPropertyExtraFields(): Promise<PropertyExtraFieldValue[]> {
    return PropertyExtraFieldValue.find();
  }

  @Query(() => [PropertyExtraFieldValue])
  async propertyExtraFields(
    @Arg('propertyId', () => String) propertyId: string,
  ): Promise<PropertyExtraFieldValue[] | undefined> {
    const listPropertyExtraFieldValuesByPropertyService = container.resolve(
      ListPropertyExtraFieldValuesByPropertyService,
    );
    const listExtraField = listPropertyExtraFieldValuesByPropertyService.execute(
      {
        id: propertyId,
      },
    );

    return listExtraField;
  }
}
