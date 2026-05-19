import { MigrationInterface, QueryRunner } from "typeorm";

export class GallerySortRemovalAndAwesomeClicks1778069400000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE \`gallery_images\` DROP COLUMN \`sort_order\`
    `);
    await queryRunner.query(`
      CREATE TABLE \`awesome_clicks\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`image_url\` varchar(500) NOT NULL,
        \`alt_text\` varchar(255) NULL,
        \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS \`awesome_clicks\``);
    await queryRunner.query(`
      ALTER TABLE \`gallery_images\` ADD \`sort_order\` int NOT NULL DEFAULT '0'
    `);
  }
}
