import "reflect-metadata";
import { DataSource } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import * as path from "path";
import * as dotenv from "dotenv";

// Load .env explicitly for CLI usage (migrations)
dotenv.config({ path: path.join(__dirname, "../../.env") });

export const AppDataSource = new DataSource({
  type:            "mysql",
  host:            process.env.DB_HOST     || "localhost",
  port:            parseInt(process.env.DB_PORT || "3306"),
  username:        process.env.DB_USER     || "root",
  password:        process.env.DB_PASSWORD || "password",
  database:        process.env.DB_NAME     || "finestapp",
  synchronize:     false,
  namingStrategy:  new SnakeNamingStrategy(),
  logging:         process.env.NODE_ENV !== "production",
  // Entities remain in src/entities/ for TypeORM compatibility
  entities:        [path.join(__dirname, "../entities/*.{ts,js}")],
  // Migrations moved to database/migrations/
  migrations:      [path.join(__dirname, "../../database/migrations/*.{ts,js}")],
  subscribers:     [],
});
