import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";

export const UserRepository = AppDataSource.getRepository(User).extend({
  findByEmail(email: string) {
    return this.findOne({ where: { email } });
  },

  async createWithDefaults(name: string, email: string, roleId: number) {
    const user = this.create({ name, email, roleId });
    return await this.save(user);
  },
});
