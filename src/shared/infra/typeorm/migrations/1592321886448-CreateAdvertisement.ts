import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateAdvertisement1592321886448
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'advertisements',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'user_id',
            type: 'uuid',
          },
          {
            name: 'property_id',
            type: 'uuid',
          },
          {
            name: 'title',
            type: 'varchar',
          },
          {
            name: 'description',
            type: 'varchar',
            isNullable: true,
          },
          {
            enum: ['purchase', 'tenancy'],
            name: 'type',
            type: 'enum',
            enumName: 'advertisement_type_enum',
          },
          {
            name: 'address_visible',
            type: 'boolean',
            default: true,
          },
          {
            name: 'status',
            type: 'boolean',
            default: false,
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
            name: 'AdUser',
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            columnNames: ['user_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'AdProperty',
            referencedTableName: 'properties',
            referencedColumnNames: ['id'],
            columnNames: ['property_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('advertisements', 'AdProperty');

    await queryRunner.dropForeignKey('advertisements', 'AdUser');

    await queryRunner.dropTable('advertisements');

    await queryRunner.query(`DROP TYPE "advertisement_type_enum"`);
  }
}
