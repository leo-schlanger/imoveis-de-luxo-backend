import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateAdvertisementMedia1592322746581
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'media',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'advertisement_id',
            type: 'uuid',
          },
          {
            enum: ['photo', 'video'],
            name: 'type',
            type: 'enum',
            enumName: 'media_type_enum',
          },
          {
            name: 'name',
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
            name: 'AdMedia',
            referencedTableName: 'advertisements',
            referencedColumnNames: ['id'],
            columnNames: ['advertisement_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('media', 'AdMedia');

    await queryRunner.dropTable('media');

    await queryRunner.query(`DROP TYPE "media_type_enum"`);
  }
}
