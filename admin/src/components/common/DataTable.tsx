'use client';

import { ReactNode, useState } from 'react';
import { Search, Edit, Trash2, Eye, Filter, Plus } from 'lucide-react';
import PermissionButton from '../rbac/PermissionButton';

export interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => ReactNode);
  className?: string;
}

interface DataTableProps<T> {
  title: string;
  icon: any;
  module: string;
  data: T[];
  columns: Column<T>[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onView?: (item: T) => void;
  onAdd?: () => void;
  loading?: boolean;
  searchPlaceholder?: string;
  searchKey?: keyof T;
}

export default function DataTable<T extends { id: any }>({
  title,
  icon: Icon,
  module,
  data,
  columns,
  onEdit,
  onDelete,
  onView,
  onAdd,
  loading,
  searchPlaceholder = 'Search...',
  searchKey,
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');

  const filteredData = searchKey
    ? data.filter((item) =>
        String(item[searchKey] || '')
          .toLowerCase()
          .includes(search.toLowerCase())
      )
    : data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 rounded-lg bg-[#00B8C6]/10">
              <Icon className="w-5 h-5 text-[#00B8C6]" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          </div>
          <p className="text-sm text-gray-500 mt-1">Manage your {title.toLowerCase()} and their details</p>
        </div>
        
        {onAdd && (
          <PermissionButton
            module={module}
            action="create"
            onClick={onAdd}
            icon={Plus}
          >
            Add {title.replace(/s$/, '')}
          </PermissionButton>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-100">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00B8C6]/20 focus:border-[#00B8C6] transition-all text-sm"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg border border-gray-200 transition-all text-sm font-medium">
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                {columns.map((col, i) => (
                  <th
                    key={i}
                    className={`px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 ${col.className || ''}`}
                  >
                    {col.header}
                  </th>
                ))}
                {(onEdit || onDelete || onView) && (
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 text-center">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={columns.length + 1} className="px-6 py-12 text-center">
                    <div className="flex justify-center">
                      <div className="w-8 h-8 border-4 border-[#00B8C6]/15 border-t-[#00B8C6] rounded-full animate-spin" />
                    </div>
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="px-6 py-12 text-center text-gray-500">
                    No records found
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    {columns.map((col, i) => (
                      <td key={i} className={`px-6 py-4 text-sm text-gray-600 ${col.className || ''}`}>
                        {typeof col.accessor === 'function'
                          ? col.accessor(item)
                          : (item[col.accessor] as any)}
                      </td>
                    ))}
                    {(onEdit || onDelete || onView) && (
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-1">
                          {onView && (
                            <button
                              onClick={() => onView(item)}
                              className="p-1.5 text-gray-400 hover:text-[#00B8C6] hover:bg-[#00B8C6]/5 rounded-md transition-all"
                              title="View"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          )}
                          {onEdit && (
                            <PermissionButton
                              module={module}
                              action="update"
                              onClick={() => onEdit(item)}
                              variant="ghost"
                              className="!p-1.5 !bg-transparent !text-gray-400 hover:!text-amber-600 hover:!bg-amber-50"
                              title="Edit"
                              icon={Edit}
                            />
                          )}
                          {onDelete && (
                            <PermissionButton
                              module={module}
                              action="delete"
                              onClick={() => onDelete(item)}
                              variant="ghost"
                              className="!p-1.5 !bg-transparent !text-gray-400 hover:!text-rose-600 hover:!bg-rose-50"
                              title="Delete"
                              icon={Trash2}
                            />
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
