import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1680504957167 implements MigrationInterface {
  name = 'CreateUserTable1680504957167';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "updated" TIMESTAMP(3) NOT NULL DEFAULT now(), "created" TIMESTAMP(3) NOT NULL DEFAULT now(), "deleted" TIMESTAMP(3), "username" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "code" character varying(255) NOT NULL, CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_1f7a2b11e29b1422a2622beab36" UNIQUE ("code"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_b818392e7d444ec6e634ee3bae" ON "users" ("code") WHERE deleted IS NULL`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_ae7b5c71de5f255b5fc800d2e3" ON "users" ("email") WHERE deleted IS NULL`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_661c2557c3d9c885aa72cdcb74" ON "users" ("username") WHERE deleted IS NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_661c2557c3d9c885aa72cdcb74"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ae7b5c71de5f255b5fc800d2e3"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b818392e7d444ec6e634ee3bae"`,
    );
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
