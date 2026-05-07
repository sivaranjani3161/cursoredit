export type Role = 'admin' | 'editor' | 'viewer';

export type Module =
  | 'courses'
  | 'blogs'
  | 'gallery'
  | 'enquiries'
  | 'testimonials';

export type CrudOperation = 'create' | 'read' | 'update' | 'delete';

export type ModulePermissions = {
  [key in CrudOperation]: boolean;
};

export type RolePermissions = {
  [module in Module]: ModulePermissions;
};

export type PermissionsConfig = {
  roles: Role[];
  modules: Module[];
  roleRoutes: { [role in Role]: string };
  userRoles: { [email: string]: Role };
  permissions: { [role in Role]: RolePermissions };
};

export interface ExtendedUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: Role;
}
