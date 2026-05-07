'use client';

import { useSession } from 'next-auth/react';

export default function usePermission() {
  const { data: session } = useSession();

  const user = session?.user as any;

  const hasPermission = (
    module: string,
    action: string
  ) => {
    return !!user?.permissions?.[module]?.[action];
  };

  return {
    user,
    role: user?.role,
    roleName: user?.roleName,
    isAdmin: user?.role === 'admin',
    permissions: user?.permissions || {},
    hasPermission,
  };
}