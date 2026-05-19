'use client';

import { ReactNode } from 'react';
import usePermission from '@/shared/hooks/usePermission';

interface Props {
  module: string;
  action: string;
  children: ReactNode;
}

export default function PermissionGuard({
  module,
  action,
  children,
}: Props) {
  const { isAdmin, hasPermission } = usePermission();

  if (!isAdmin && !hasPermission(module, action)) {
    return null;
  }

  return <>{children}</>;
}