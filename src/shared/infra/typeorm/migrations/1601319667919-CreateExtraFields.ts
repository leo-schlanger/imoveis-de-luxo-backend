import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateExtraFields1601319667919
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'extraFields',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            enum: ['string', 'number', 'boolean'],
            name: 'type',
            type: 'enum',
            enumName: 'extra_field_type_enum',
          },
          {
            enum: [
              'home',
              'apartment',
              'penthouse',
              'grange',
              'farm',
              'terrain',
              'shed',
              'corporate',
              'office',
              'store',
              'hotel',
              'inn',
              'island',
              'customized',
            ],
            name: 'properties_types',
            isArray: true,
            type: 'enum',
            enumName: 'properties_type_enum',
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
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('extraFields');

    await queryRunner.query(`DROP TYPE "extra_field_type_enum"`);
  }
}
