import { FastifyInstance } from "fastify";
import { getAllUsers, getUserByEmail, createUser, updateUser, deleteUser } from "./user.controller";
import { UserIdParam, UserEmailParam, CreateUserBody, UpdateUserBody } from "./user.interface";

export default async function userRoutes(app: FastifyInstance): Promise<void> {
  app.get("/users", getAllUsers);
  app.get<{ Params: UserEmailParam }>("/users/email/:email", getUserByEmail);
  app.post<{ Body: CreateUserBody }>("/users", createUser);
  app.put<{ Params: UserIdParam; Body: UpdateUserBody }>("/users/:id", updateUser);
  app.delete<{ Params: UserIdParam }>("/users/:id", deleteUser);
}
