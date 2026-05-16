import { FastifyInstance } from "fastify";
import {
  getAllUsers,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller";
import { UserIdParam, UserEmailParam, CreateUserBody, UpdateUserBody } from "../interfaces/user.interface";

export default async function userRoutes(app: FastifyInstance): Promise<void> {
  // /by-email/:email must be registered before /:id to avoid param collision
  app.get("/users", getAllUsers);
  app.get<{ Params: UserEmailParam }>("/users/by-email/:email", getUserByEmail);
  app.post<{ Body: CreateUserBody }>("/users", createUser);
  app.put<{ Params: UserIdParam; Body: UpdateUserBody }>("/users/:id", updateUser);
  app.delete<{ Params: UserIdParam }>("/users/:id", deleteUser);
}
