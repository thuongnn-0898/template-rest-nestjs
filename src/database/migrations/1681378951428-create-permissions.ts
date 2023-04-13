import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePermissions1681378951428 implements MigrationInterface {
  name = 'createPermissions1681378951428';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "permissions" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "updated" TIMESTAMP(3) NOT NULL DEFAULT now(),
        "created" TIMESTAMP(3) NOT NULL DEFAULT now(),
        "deleted" TIMESTAMP(3),
        "action" character varying(255) NOT NULL,
        "permission_resource_id" uuid NOT NULL,
        CONSTRAINT "UQ_1c1e0637ecf1f6401beb9a68abe" UNIQUE ("action"),
        CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY ("id")
      )`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_f3079edecdf9acd7a1125b8c9d" ON "permissions" ("action") WHERE deleted IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "permissions" ADD
        CONSTRAINT "FK_e6087951f1b66112bf1a8169d2c" FOREIGN KEY ("permission_resource_id")
        REFERENCES "permission_resources"("id")
        ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "permissions" DROP CONSTRAINT "FK_e6087951f1b66112bf1a8169d2c"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f3079edecdf9acd7a1125b8c9d"`,
    );
    await queryRunner.query(`DROP TABLE "permissions"`);
  }
}
