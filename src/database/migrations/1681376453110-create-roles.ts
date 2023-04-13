import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRoles1681376453110 implements MigrationInterface {
  name = 'createRoles1681376453110';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "roles" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "updated" TIMESTAMP(3) NOT NULL DEFAULT now(),
        "created" TIMESTAMP(3) NOT NULL DEFAULT now(),
        "deleted" TIMESTAMP(3),
        "name" character varying(255) NOT NULL,
        CONSTRAINT "UQ_8eadedb8470c92966389ecc2165" UNIQUE ("name"),
        CONSTRAINT "PK_efba48c6a0c7a9b6260f771b165" PRIMARY KEY ("id")
      )`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_340aed0783210b336f816c74a7" ON "roles" ("name") WHERE deleted IS NULL`,
    );
    await queryRunner.query(`ALTER TABLE "users" ADD "role_id" uuid NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD
        CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1" FOREIGN KEY ("role_id") REFERENCES "roles"("id")
        ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role_id"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_340aed0783210b336f816c74a7"`,
    );
    await queryRunner.query(`DROP TABLE "roles"`);
  }
}
