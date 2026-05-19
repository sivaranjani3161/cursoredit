"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CleanupOldCamelCaseTables1778069280689 = void 0;
class CleanupOldCamelCaseTables1778069280689 {
    async up(queryRunner) {
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
    async down(queryRunner) {
        // No down migration for cleanup
    }
}
exports.CleanupOldCamelCaseTables1778069280689 = CleanupOldCamelCaseTables1778069280689;
