
import "next-auth";
import "next-auth/jwt";
import { AdminUser } from "./types";

declare module "next-auth" {
  interface Session {
    user: AdminUser;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface User extends AdminUser {}
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    roleId?: number;
    roleName?: string;
    dbUserId?: number;
    permissions?: Record<string, Record<string, boolean>>;
  }
}
