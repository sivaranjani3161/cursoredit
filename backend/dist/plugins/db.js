"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const data_source_1 = require("../config/data-source");
const typeOrmPlugin = async (fastify) => {
    try {
        if (!data_source_1.AppDataSource.isInitialized) {
            await data_source_1.AppDataSource.initialize();
            fastify.log.info("TypeORM connected to the database!");
        }
        // Add it to fastify instance for convenience (optional, mostly use AppDataSource directly)
        fastify.decorate("db", data_source_1.AppDataSource);
        // Graceful shutdown
        fastify.addHook("onClose", async (instance) => {
            if (data_source_1.AppDataSource.isInitialized) {
                await data_source_1.AppDataSource.destroy();
                fastify.log.info("TypeORM connection closed.");
            }
        });
    }
    catch (error) {
        fastify.log.error("Failed to connect to the database");
        fastify.log.error(error);
        process.exit(1);
    }
};
exports.default = (0, fastify_plugin_1.default)(typeOrmPlugin);
