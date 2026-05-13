import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTypeToGalleryEvents1778577592294 implements MigrationInterface {
    name = 'AddTypeToGalleryEvents1778577592294'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`UQ_permission_role_code\` ON \`permissions\``);
        await queryRunner.query(`ALTER TABLE \`gallery_events\` ADD \`type\` enum ('internal', 'external') NOT NULL DEFAULT 'external'`);
        await queryRunner.query(`ALTER TABLE \`gallery_events\` DROP FOREIGN KEY \`FK_0248e9c62013a88c39a5d821c1a\``);
        await queryRunner.query(`ALTER TABLE \`gallery_events\` CHANGE \`title\` \`title\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`gallery_events\` CHANGE \`slug\` \`slug\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`gallery_events\` CHANGE \`created_by\` \`created_by\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`course_highlights\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`course_highlights\` ADD \`description\` json NULL`);
        await queryRunner.query(`ALTER TABLE \`course_structures\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`course_structures\` ADD \`description\` json NULL`);
        await queryRunner.query(`ALTER TABLE \`course_features\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`course_features\` ADD \`description\` json NULL`);
        await queryRunner.query(`ALTER TABLE \`gallery_events\` ADD CONSTRAINT \`FK_0248e9c62013a88c39a5d821c1a\` FOREIGN KEY (\`created_by\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`gallery_events\` DROP FOREIGN KEY \`FK_0248e9c62013a88c39a5d821c1a\``);
        await queryRunner.query(`ALTER TABLE \`course_features\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`course_features\` ADD \`description\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`course_structures\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`course_structures\` ADD \`description\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`course_highlights\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`course_highlights\` ADD \`description\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`gallery_events\` CHANGE \`created_by\` \`created_by\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`gallery_events\` CHANGE \`slug\` \`slug\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`gallery_events\` CHANGE \`title\` \`title\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`gallery_events\` ADD CONSTRAINT \`FK_0248e9c62013a88c39a5d821c1a\` FOREIGN KEY (\`created_by\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`gallery_events\` DROP COLUMN \`type\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`UQ_permission_role_code\` ON \`permissions\` (\`role_id\`, \`code\`)`);
    }

}
