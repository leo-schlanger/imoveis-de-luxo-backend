import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateProperty1592312863132 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'properties',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'address_id',
            type: 'uuid',
          },
          {
            enum: [
              'casa',
              'apartamento',
              'cobertura',
              'sitio',
              'fazenda',
              'terreno',
              'galpão',
              'corporativo',
              'escritorio',
              'loja',
              'hotel',
              'pousada',
              'ilha',
              'customizado',
            ],
            name: 'type',
            type: 'enum',
            enumName: 'properties_type_enum',
          },
          {
            name: 'value',
            type: 'decimal',
            scale: 2,
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
            name: 'AddressProperties',
            referencedTableName: 'address',
            referencedColumnNames: ['id'],
            columnNames: ['address_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('properties', 'AddressProperties');

    await queryRunner.dropTable('properties');

    await queryRunner.query(`DROP TYPE "properties_type_enum"`);
  }
}
