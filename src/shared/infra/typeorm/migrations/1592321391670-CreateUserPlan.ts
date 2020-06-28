import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class CreateUserPlan1592321391670 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('users', [
      new TableColumn({
        name: 'plan_id',
        type: 'uuid',
        isNullable: true,
      }),
      new TableColumn({
        name: 'plan_status',
        type: 'boolean',
        isNullable: true,
      }),
    ]);

    await queryRunner.createForeignKey(
      'users',
      new TableForeignKey({
        name: 'PlanUsers',
        columnNames: ['plan_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'plans',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('users', 'PlanUsers');

    await queryRunner.dropColumn('users', 'plan_id');

    await queryRunner.dropColumn('users', 'plan_status');
  }
}
