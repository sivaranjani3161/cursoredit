"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CleanupOldTables1778065886336 = void 0;
class CleanupOldTables1778065886336 {
    async up(queryRunner) {
        await queryRunner.query(`SET FOREIGN_KEY_CHECKS = 0;`);
        await queryRunner.query(`DROP TABLE IF EXISTS blog_tags;`);
        await queryRunner.query(`DROP TABLE IF EXISTS course_features;`);
        await queryRunner.query(`DROP TABLE IF EXISTS course_highlights;`);
        await queryRunner.query(`DROP TABLE IF EXISTS course_phase_points;`);
        await queryRunner.query(`DROP TABLE IF EXISTS course_phases;`);
        await queryRunner.query(`DROP TABLE IF EXISTS gallery_events;`);
        await queryRunner.query(`DROP TABLE IF EXISTS gallery_images;`);
        await queryRunner.query(`DROP TABLE IF EXISTS related_blogs;`);
        await queryRunner.query(`DROP TABLE IF EXISTS role_permissions;`);
        await queryRunner.query(`SET FOREIGN_KEY_CHECKS = 1;`);
    }
    async down(queryRunner) {
    }
}
exports.CleanupOldTables1778065886336 = CleanupOldTables1778065886336;
