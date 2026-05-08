'use client';

import { ReactNode } from 'react';
import PermissionGuard from '../rbac/PermissionGuard';
import { LucideIcon } from 'lucide-react';

interface PermissionButtonProps {
  module: string;
  action: string;
  onClick?: () => void;
  children?: ReactNode;
  icon?: LucideIcon;
  variant?: 'primary' | 'danger' | 'warning' | 'ghost' | 'outline';
  className?: string;
  title?: string;
}

export default function PermissionButton({
  module,
  action,
  onClick,
  children,
  icon: Icon,
  variant = 'primary',
  className = '',
  title,
}: PermissionButtonProps) {
  const variants = {
    primary: 'bg-[#00B8C6] text-white hover:bg-[#00B8C6]/90',
    danger: 'bg-rose-50 text-rose-600 hover:bg-rose-100',
    warning: 'bg-amber-50 text-amber-600 hover:bg-amber-100',
    ghost: 'hover:bg-gray-100 text-gray-500 hover:text-gray-900',
    outline: 'border border-gray-200 text-gray-600 hover:bg-gray-50',
  };

  return (
    <PermissionGuard module={module} action={action}>
      <button
        onClick={onClick}
        title={title}
        className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      >
        {Icon && <Icon className="w-4 h-4" />}
        {children}
      </button>
    </PermissionGuard>
  );
}
