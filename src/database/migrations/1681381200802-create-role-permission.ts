import { MigrationInterface, QueryRunner } from 'typeorm';

export class createRolePermission1681381200802 implements MigrationInterface {
  name = 'createRolePermission1681381200802';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "role_permissions" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "updated" TIMESTAMP(3) NOT NULL DEFAULT now(),
        "created" TIMESTAMP(3) NOT NULL DEFAULT now(),
        "deleted" TIMESTAMP(3),
        "permission_id" uuid NOT NULL,
        "role_id" uuid NOT NULL,
        CONSTRAINT "PK_84059017c90bfcb701b8fa42297" PRIMARY KEY ("id")
      )`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" ADD
        CONSTRAINT "FK_17022daf3f885f7d35423e9971e" FOREIGN KEY ("permission_id")
        REFERENCES "permissions"("id")
        ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" ADD
        CONSTRAINT "FK_178199805b901ccd220ab7740ec" FOREIGN KEY ("role_id")
        REFERENCES "roles"("id")
        ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_178199805b901ccd220ab7740ec"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_17022daf3f885f7d35423e9971e"`,
    );
    await queryRunner.query(`DROP TABLE "role_permissions"`);
  }
}
