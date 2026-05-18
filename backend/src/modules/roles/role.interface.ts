export interface CreateRoleBody {
  name: string;
  code: string;
  description?: string;
}

export interface UpdateRoleBody {
  description?: string | null;
  name?: string;
  code?: string;
}

export interface RoleIdParam {
  id: string;
}
