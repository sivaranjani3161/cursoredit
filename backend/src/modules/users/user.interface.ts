import { UserStatus } from "../../entities/enums/UserStatus";

export interface CreateUserBody {
  email: string;
  name: string;
  roleId: number;
}

export interface UpdateUserBody {
  roleId?: number;
  name?: string;
  email?: string;
  status?: UserStatus;
}

export interface UserIdParam {
  id: string;
}

export interface UserEmailParam {
  email: string;
}
