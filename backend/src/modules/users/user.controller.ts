import { FastifyRequest, FastifyReply } from "fastify";
import { userService } from "./user.service";
import { validateCreateUser, validateUpdateUser } from "./user.validator";
import { UserIdParam, UserEmailParam, CreateUserBody, UpdateUserBody } from "./user.interface";

export async function getAllUsers(_req: FastifyRequest, reply: FastifyReply): Promise<void> {
  try { reply.send(await userService.findAll()); }
  catch (err) { reply.log.error(err); reply.status(500).send({ error: "Failed to fetch users" }); }
}

export async function getUserByEmail(req: FastifyRequest<{ Params: UserEmailParam }>, reply: FastifyReply): Promise<void> {
  try {
    const user = await userService.findByEmail(req.params.email);
    if (!user) { reply.status(404).send({ error: "User not found" }); return; }
    reply.send(user);
  } catch (err) { reply.log.error(err); reply.status(500).send({ error: "Failed to fetch user" }); }
}

export async function createUser(req: FastifyRequest<{ Body: CreateUserBody }>, reply: FastifyReply): Promise<void> {
  try {
    const body = req.body as unknown as Record<string, unknown>;
    const validation = validateCreateUser(body);
    if (!validation.valid) { reply.status(400).send({ error: "Validation failed", details: validation.errors }); return; }
    const result = await userService.create(body as unknown as CreateUserBody);
    if ("badRequest" in result) { reply.status(400).send({ error: result.badRequest }); return; }
    if ("conflict"   in result) { reply.status(409).send({ error: "User already exists" }); return; }
    reply.status(201).send(result.data);
  } catch (err) { reply.log.error(err); reply.status(500).send({ error: "Failed to create user" }); }
}

export async function updateUser(req: FastifyRequest<{ Params: UserIdParam; Body: UpdateUserBody }>, reply: FastifyReply): Promise<void> {
  try {
    const body = req.body as unknown as Record<string, unknown>;
    const validation = validateUpdateUser(body);
    if (!validation.valid) { reply.status(400).send({ error: "Validation failed", details: validation.errors }); return; }
    const result = await userService.update(Number(req.params.id), body as Partial<UpdateUserBody>);
    if ("notFound"   in result) { reply.status(404).send({ error: "User not found" }); return; }
    if ("badRequest" in result) { reply.status(400).send({ error: result.badRequest }); return; }
    if ("conflict"   in result) { reply.status(409).send({ error: "Email already in use" }); return; }
    reply.send(result.data);
  } catch (err) { reply.log.error(err); reply.status(500).send({ error: "Failed to update user" }); }
}

export async function deleteUser(req: FastifyRequest<{ Params: UserIdParam }>, reply: FastifyReply): Promise<void> {
  try {
    const result = await userService.delete(Number(req.params.id));
    if ("notFound" in result) { reply.status(404).send({ error: "User not found" }); return; }
    reply.status(204).send();
  } catch (err) {
    reply.log.error(err);
    reply.status(500).send({ error: "Failed to delete user", details: err instanceof Error ? err.message : "Unknown" });
  }
}
