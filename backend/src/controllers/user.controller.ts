import { FastifyRequest, FastifyReply } from "fastify";
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";
import { Role } from "../entities/Role";
import { UserStatus } from "../entities/enums/UserStatus";
import { CreateUserBody, UpdateUserBody, UserIdParam, UserEmailParam } from "../interfaces/user.interface";
import { normalizeEmail } from "../utils/stringHelpers";
import { validateCreateUser, validateUpdateUser } from "../validators";

const userRepo = () => AppDataSource.getRepository(User);
const roleRepo = () => AppDataSource.getRepository(Role);

const USER_SELECT = {
  id: true,
  email: true,
  name: true,
  status: true,
  authProvider: true,
  roleId: true,
  createdAt: true,
  role: { id: true, name: true, code: true },
} as const;

export async function getAllUsers(_req: FastifyRequest, reply: FastifyReply): Promise<void> {
  const users = await userRepo().find({
    relations: ["role"],
    order: { createdAt: "DESC" },
    select: USER_SELECT,
  });
  reply.send(users);
}

export async function getUserByEmail(
  req: FastifyRequest<{ Params: UserEmailParam }>,
  reply: FastifyReply
): Promise<void> {
  const { email } = req.params;
  const user = await userRepo().findOne({
    where: { email },
    relations: ["role", "role.permissions"],
    select: {
      id: true,
      email: true,
      name: true,
      status: true,
      roleId: true,
      role: {
        id: true,
        name: true,
        code: true,
        permissions: { id: true, code: true, name: true },
      },
    },
  });
  if (!user) { reply.status(404).send({ error: "User not found" }); return; }
  reply.send(user);
}

export async function createUser(
  req: FastifyRequest<{ Body: CreateUserBody }>,
  reply: FastifyReply
): Promise<void> {
  try {
    const body = req.body as unknown as Record<string, unknown>;
    const validation = validateCreateUser(body);
    if (!validation.valid) {
      reply.status(400).send({ error: "Validation failed", details: validation.errors }); return;
    }

    const email = normalizeEmail(body.email);
    const name = String(body.name).trim();
    const roleId = Number(body.roleId);

    const role = await roleRepo().findOne({ where: { id: roleId } });
    if (!role) { reply.status(400).send({ error: "Role not found" }); return; }

    const existing = await userRepo().findOne({ where: { email } });
    if (existing) { reply.status(409).send({ error: "User already exists" }); return; }

    const user = userRepo().create({
      email,
      name,
      roleId,
      status: UserStatus.ACTIVE,
      authProvider: "google",
      password: null,
      oauthId: null,
      inviteToken: null,
      inviteExpiresAt: null,
    });
    const saved = await userRepo().save(user);
    reply.status(201).send({ ...saved, role });
  } catch (err) {
    reply.log.error(err);
    reply.status(500).send({ error: "Failed to create user" });
  }
}

export async function updateUser(
  req: FastifyRequest<{ Params: UserIdParam; Body: UpdateUserBody }>,
  reply: FastifyReply
): Promise<void> {
  try {
    const body = req.body as unknown as Record<string, unknown>;
    const validation = validateUpdateUser(body);
    if (!validation.valid) {
      reply.status(400).send({ error: "Validation failed", details: validation.errors }); return;
    }

    const userId = Number(req.params.id);
    const user = await userRepo().findOne({ where: { id: userId } });
    if (!user) { reply.status(404).send({ error: "User not found" }); return; }

    if (body?.roleId !== undefined) {
      const role = await roleRepo().findOne({ where: { id: Number(body.roleId) } });
      if (!role) { reply.status(400).send({ error: "Role not found" }); return; }
      user.roleId = Number(body.roleId);
    }

    if (body?.name !== undefined) user.name = String(body.name).trim();

    if (body?.email !== undefined) {
      const email = normalizeEmail(body.email);
      const conflict = await userRepo().findOne({ where: { email } });
      if (conflict && conflict.id !== userId) {
        reply.status(409).send({ error: "Email already in use" }); return;
      }
      user.email = email;
    }

    if (body?.status !== undefined) {
      if (!Object.values(UserStatus).includes(body.status as UserStatus)) {
        reply.status(400).send({ error: "Invalid status value" }); return;
      }
      user.status = body.status as UserStatus;
    }

    const saved = await userRepo().save(user);
    const withRole = await userRepo().findOne({
      where: { id: saved.id },
      relations: ["role"],
      select: USER_SELECT,
    });
    reply.send(withRole);
  } catch (err) {
    reply.log.error(err);
    reply.status(500).send({ error: "Failed to update user" });
  }
}

export async function deleteUser(
  req: FastifyRequest<{ Params: UserIdParam }>,
  reply: FastifyReply
): Promise<void> {
  try {
    const id = Number(req.params.id);
    reply.log.info(`Attempting to delete user with ID: ${id}`);
    const result = await userRepo().delete(id);
    if (result.affected === 0) {
      reply.log.warn(`User with ID ${id} not found for deletion`);
      reply.status(404).send({ error: "User not found" }); return;
    }
    reply.log.info(`Successfully deleted user with ID: ${id}`);
    reply.status(204).send();
  } catch (err) {
    reply.log.error(err);
    const msg = err instanceof Error ? err.message : "Unknown error";
    reply.status(500).send({ error: "Failed to delete user", details: msg });
  }
}
