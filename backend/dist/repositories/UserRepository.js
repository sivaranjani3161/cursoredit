"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const data_source_1 = require("../config/data-source");
const User_1 = require("../entities/User");
exports.UserRepository = data_source_1.AppDataSource.getRepository(User_1.User).extend({
    findByEmail(email) {
        return this.findOne({ where: { email } });
    },
    async createWithDefaults(name, email, roleId) {
        const user = this.create({ name, email, roleId });
        return await this.save(user);
    },
});
