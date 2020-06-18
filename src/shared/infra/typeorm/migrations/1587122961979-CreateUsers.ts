import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateUsers1587122961979 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
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
            name: 'responsible',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'description',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'creci',
            type: 'varchar',
            isNullable: true,
            isUnique: true,
          },
          {
            name: 'email',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'password',
            type: 'varchar',
          },
          {
            name: 'avatar',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'phone',
            type: 'varchar',
          },
          {
            name: 'secondary_phone',
            type: 'varchar',
            isNullable: true,
          },
          {
            enum: ['novo', 'inativo', 'ativo'],
            name: 'status',
            type: 'enum',
            enumName: 'user_status_enum',
          },
          {
            enum: ['adm', 'anunciante', 'usuario'],
            name: 'type',
            type: 'enum',
            enumName: 'user_type_enum',
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
    await queryRunner.dropTable('users');

    await queryRunner.query(`DROP TYPE "user_status_enum"`);

    await queryRunner.query(`DROP TYPE "user_type_enum"`);
  }
}
