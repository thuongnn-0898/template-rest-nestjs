import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePostTable1680512743032 implements MigrationInterface {
  name = 'CreatePostTable1680512743032';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "posts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "updated" TIMESTAMP(3) NOT NULL DEFAULT now(), "created" TIMESTAMP(3) NOT NULL DEFAULT now(), "deleted" TIMESTAMP(3), "user_id" uuid NOT NULL, "title" character varying(255) NOT NULL, "description" character varying(2000), CONSTRAINT "UQ_2d82eb2bb2ddd7a6bfac8804d8a" UNIQUE ("title"), CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_e21c0487defbb1428a718415ad" ON "posts" ("title") WHERE deleted IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "posts" ADD CONSTRAINT "FK_c4f9a7bd77b489e711277ee5986" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "posts" DROP CONSTRAINT "FK_c4f9a7bd77b489e711277ee5986"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e21c0487defbb1428a718415ad"`,
    );
    await queryRunner.query(`DROP TABLE "posts"`);
  }
}
