import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDescriptionToJson1778148353765 implements MigrationInterface {
  name = "UpdateDescriptionToJson1778148353765";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_8dad765629e83229da6feda1c1\` ON \`permissions\``
    );
    await queryRunner.query(
      `ALTER TABLE \`course_highlights\` DROP COLUMN \`description\``
    );
    await queryRunner.query(
      `ALTER TABLE \`course_highlights\` ADD \`description\` json NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`course_structures\` DROP COLUMN \`description\``
    );
    await queryRunner.query(
      `ALTER TABLE \`course_structures\` ADD \`description\` json NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`course_features\` DROP COLUMN \`description\``
    );
    await queryRunner.query(
      `ALTER TABLE \`course_features\` ADD \`description\` json NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`course_features\` DROP COLUMN \`description\``
    );
    await queryRunner.query(
      `ALTER TABLE \`course_features\` ADD \`description\` text NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`course_structures\` DROP COLUMN \`description\``
    );
    await queryRunner.query(
      `ALTER TABLE \`course_structures\` ADD \`description\` text NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`course_highlights\` DROP COLUMN \`description\``
    );
    await queryRunner.query(
      `ALTER TABLE \`course_highlights\` ADD \`description\` text NULL`
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_8dad765629e83229da6feda1c1\` ON \`permissions\` (\`code\`)`
    );
  }
}
