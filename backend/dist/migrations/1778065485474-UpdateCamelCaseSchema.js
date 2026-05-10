"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCamelCaseSchema1778065485474 = void 0;
class UpdateCamelCaseSchema1778065485474 {
    name = 'UpdateCamelCaseSchema1778065485474';
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`galleryImages\` DROP FOREIGN KEY \`FK_bddfac1fb07f5c967f1a3fd96b7\``);
        await queryRunner.query(`CREATE TABLE \`galleryEvents\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`location\` varchar(255) NULL, \`slug\` varchar(255) NOT NULL, \`coverImage\` varchar(500) NULL, \`description\` text NULL, \`eventDate\` date NULL, \`createdBy\` int NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), INDEX \`IDX_9429aefd60f899f57895b30ff2\` (\`createdBy\`), UNIQUE INDEX \`IDX_62d3f7d046830b850ce5aedb28\` (\`slug\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`galleryImages\` ADD CONSTRAINT \`FK_bddfac1fb07f5c967f1a3fd96b7\` FOREIGN KEY (\`eventId\`) REFERENCES \`galleryEvents\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`galleryEvents\` ADD CONSTRAINT \`FK_9429aefd60f899f57895b30ff21\` FOREIGN KEY (\`createdBy\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`galleryEvents\` DROP FOREIGN KEY \`FK_9429aefd60f899f57895b30ff21\``);
        await queryRunner.query(`ALTER TABLE \`galleryImages\` DROP FOREIGN KEY \`FK_bddfac1fb07f5c967f1a3fd96b7\``);
        await queryRunner.query(`DROP INDEX \`IDX_62d3f7d046830b850ce5aedb28\` ON \`galleryEvents\``);
        await queryRunner.query(`DROP INDEX \`IDX_9429aefd60f899f57895b30ff2\` ON \`galleryEvents\``);
        await queryRunner.query(`DROP TABLE \`galleryEvents\``);
        await queryRunner.query(`ALTER TABLE \`galleryImages\` ADD CONSTRAINT \`FK_bddfac1fb07f5c967f1a3fd96b7\` FOREIGN KEY (\`eventId\`) REFERENCES \`gallery_events\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }
}
exports.UpdateCamelCaseSchema1778065485474 = UpdateCamelCaseSchema1778065485474;
