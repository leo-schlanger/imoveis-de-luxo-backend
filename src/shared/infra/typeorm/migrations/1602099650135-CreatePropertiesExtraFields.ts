import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreatePropertiesExtraFields1602099650135
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'properties_extra_fields',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'property_id',
            type: 'uuid',
          },
          {
            name: 'extra_field_id',
            type: 'uuid',
          },
          {
            name: 'value',
            isNullable: true,
            type: 'varchar',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
        foreignKeys: [
          {
            name: 'PropertyKey',
            referencedTableName: 'properties',
            referencedColumnNames: ['id'],
            columnNames: ['property_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'ExtraFieldKey',
            referencedTableName: 'extraFields',
            referencedColumnNames: ['id'],
            columnNames: ['extra_field_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('properties_extra_fields', 'PropertyKey');

    await queryRunner.dropForeignKey(
      'properties_extra_fields',
      'ExtraFieldKey',
    );

    await queryRunner.dropTable('properties_extra_fields');
  }
}
