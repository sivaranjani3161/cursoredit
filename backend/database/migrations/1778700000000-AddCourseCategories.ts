import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCourseCategories1778700000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Create course_categories table (MySQL 5.7+ syntax)
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`course_categories\` (
        \`id\`          INT NOT NULL AUTO_INCREMENT,
        \`name\`        VARCHAR(255) NOT NULL,
        \`slug\`        VARCHAR(255) NOT NULL,
        \`description\` TEXT NULL,
        \`sort_order\`  INT NOT NULL DEFAULT 0,
        \`created_at\`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`UQ_course_categories_name\` (\`name\`),
        UNIQUE KEY \`UQ_course_categories_slug\` (\`slug\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // 2. Add category_id to courses (plain ADD COLUMN, no IF NOT EXISTS)
    try {
      await queryRunner.query(`
        ALTER TABLE \`courses\`
          ADD COLUMN \`category_id\` INT NULL
      `);
    } catch (_) { /* column already exists — ignore */ }

    // 3. Add FK separately (also wrapped in try/catch)
    try {
      await queryRunner.query(`
        ALTER TABLE \`courses\`
          ADD CONSTRAINT \`FK_courses_category\`
          FOREIGN KEY (\`category_id\`) REFERENCES \`course_categories\`(\`id\`)
          ON DELETE SET NULL
      `);
    } catch (_) { /* FK already exists — ignore */ }

    // 4. Seed the 4 default categories
    await queryRunner.query(`
      INSERT IGNORE INTO \`course_categories\` (\`name\`, \`slug\`, \`sort_order\`)
      VALUES
        ('Campus-to-Corporate Programs',      'campus-to-corporate-programs',      1),
        ('Job-Ready Skill Programs',          'job-ready-skill-programs',          2),
        ('Workforce Transformation Programs', 'workforce-transformation-programs', 3),
        ('Industry Internship Programs',      'industry-internship-programs',      4)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    try { await queryRunner.query(`ALTER TABLE \`courses\` DROP FOREIGN KEY \`FK_courses_category\``); } catch (_) {}
    try { await queryRunner.query(`ALTER TABLE \`courses\` DROP COLUMN \`category_id\``); } catch (_) {}
    try { await queryRunner.query(`DROP TABLE IF EXISTS \`course_categories\``); } catch (_) {}
  }
}
