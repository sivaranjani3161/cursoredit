import { MigrationInterface, QueryRunner } from "typeorm";

export class CleanupOldCamelCaseTables1778069280689 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`SET FOREIGN_KEY_CHECKS = 0`);
        await queryRunner.query(`DROP TABLE IF EXISTS \`blogTags\``);
        await queryRunner.query(`DROP TABLE IF EXISTS \`courseFeatures\``);
        await queryRunner.query(`DROP TABLE IF EXISTS \`courseHighlights\``);
        await queryRunner.query(`DROP TABLE IF EXISTS \`courseStructure\``);
        await queryRunner.query(`DROP TABLE IF EXISTS \`galleryEvents\``);
        await queryRunner.query(`DROP TABLE IF EXISTS \`galleryImages\``);
        await queryRunner.query(`DROP TABLE IF EXISTS \`relatedBlogs\``);
        await queryRunner.query(`SET FOREIGN_KEY_CHECKS = 1`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // No down migration for cleanup
    }

}
