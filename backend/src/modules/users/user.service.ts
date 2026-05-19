import { AppDataSource } from "../../config/data-source";
import { User } from "../../entities/User";
import { Role } from "../../entities/Role";
import { UserStatus } from "../../entities/enums/UserStatus";
import { normalizeEmail } from "../../shared/utils/stringHelpers";
import { CreateUserBody, UpdateUserBody } from "./user.interface";

const userRepo = () => AppDataSource.getRepository(User);
const roleRepo = () => AppDataSource.getRepository(Role);

const USER_SELECT = {
  id: true, email: true, name: true, status: true,
  authProvider: true, roleId: true, createdAt: true,
  role: { id: true, name: true, code: true },
} as const;

export const userService = {
  findAll: async () =>
    userRepo().find({ relations: ["role"], order: { createdAt: "DESC" }, select: USER_SELECT }),

  findByEmail: async (email: string) =>
    userRepo().findOne({
      where: { email },
      relations: ["role", "role.permissions"],
      select: {
        id: true, email: true, name: true, status: true, roleId: true,
        role: { id: true, name: true, code: true, permissions: { id: true, code: true, name: true } },
      },
    }),

  create: async (body: CreateUserBody) => {
    const email  = normalizeEmail(body.email);
    const name   = String(body.name).trim();
    const roleId = Number(body.roleId);

    const role = await roleRepo().findOne({ where: { id: roleId } });
    if (!role) return { badRequest: "Role not found" as const };

    const existing = await userRepo().findOne({ where: { email } });
    if (existing) return { conflict: true as const };

    const user = userRepo().create({
      email, name, roleId,
      status:          UserStatus.ACTIVE,
      authProvider:    "google",
      password:        null,
      oauthId:         null,
      inviteToken:     null,
      inviteExpiresAt: null,
    });
    const saved = await userRepo().save(user);
    return { data: { ...saved, role } };
  },

  update: async (id: number, body: Partial<UpdateUserBody>) => {
    const user = await userRepo().findOne({ where: { id } });
    if (!user) return { notFound: true as const };

    if (body.roleId !== undefined) {
      const role = await roleRepo().findOne({ where: { id: Number(body.roleId) } });
      if (!role) return { badRequest: "Role not found" as const };
      user.roleId = Number(body.roleId);
    }
    if (body.name !== undefined) user.name = String(body.name).trim();
    if (body.email !== undefined) {
      const email = normalizeEmail(body.email);
      const conflict = await userRepo().findOne({ where: { email } });
      if (conflict && conflict.id !== id) return { conflict: true as const };
      user.email = email;
    }
    if (body.status !== undefined) {
      if (!Object.values(UserStatus).includes(body.status as UserStatus))
        return { badRequest: "Invalid status value" as const };
      user.status = body.status as UserStatus;
    }

    const saved    = await userRepo().save(user);
    const withRole = await userRepo().findOne({ where: { id: saved.id }, relations: ["role"], select: USER_SELECT });
    return { data: withRole };
  },

  delete: async (id: number) => {
    const result = await userRepo().delete(id);
    if (result.affected === 0) return { notFound: true as const };
    return { success: true as const };
  },
};
