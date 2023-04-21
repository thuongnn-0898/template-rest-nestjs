import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePermissionResource1681378309288
  implements MigrationInterface
{
  name = 'createPermissionResource1681378309288';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "permission_resources" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "updated" TIMESTAMP(3) NOT NULL DEFAULT now(),
        "created" TIMESTAMP(3) NOT NULL DEFAULT now(),
        "deleted" TIMESTAMP(3),
        "name" character varying(255) NOT NULL,
        CONSTRAINT "UQ_c9635342c64035c12e21a49d5e3" UNIQUE ("name"),
        CONSTRAINT "PK_bd9a852794ac5359ce685607ca2" PRIMARY KEY ("id")
      )`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_f1701ecc9756a4db2b53a230ea" ON "permission_resources" ("name") WHERE deleted IS NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f1701ecc9756a4db2b53a230ea"`,
    );
    await queryRunner.query(`DROP TABLE "permission_resources"`);
  }
}
