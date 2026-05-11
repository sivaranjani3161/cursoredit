'use client';

import { ReactNode, useMemo, useState } from 'react';
import { Search, Edit, Trash2, Eye, Plus } from 'lucide-react';
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
  /** Overrides the default “Add {title}” primary button label */
  addButtonLabel?: string;
  /** Optional custom actions rendered before default actions */
  renderRowActions?: (item: T) => ReactNode;
  showSearch?: boolean;
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
  addButtonLabel,
  renderRowActions,
  showSearch = true,
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');

  const filteredData = useMemo(() => {
    return data.filter((item) =>
      searchKey
        ? String(item[searchKey] || '').toLowerCase().includes(search.toLowerCase())
        : true
    );
  }, [data, searchKey, search]);

  return (
    <div className="space-y-2">

      {/* Header */}
      <div className="flex items-center justify-between bg-white rounded-xl border border-slate-200 px-4 py-2.5 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-[#00B8C6]/10">
            <Icon className="w-4 h-4 text-[#00B8C6]" />
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-900 leading-tight">{title}</h1>
            <p className="text-[11px] text-gray-400 leading-tight">
              Manage your {title.toLowerCase()} and keep records up to date.
            </p>
          </div>
        </div>
        {onAdd && (
          <PermissionButton
            module={module}
            action="create"
            onClick={onAdd}
            icon={Plus}
            className="!rounded-lg !px-3 !py-1.5 !text-xs !bg-[#00B8C6] hover:!bg-[#009da9]"
          >
            {addButtonLabel ?? `Add ${title.replace(/s$/, '')}`}
          </PermissionButton>
        )}
      </div>

      {showSearch && (
        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200">
          <Search className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent focus:outline-none text-sm text-slate-800 placeholder:text-slate-400"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="text-[10px] font-semibold text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
          <span className="text-[10px] text-gray-400 whitespace-nowrap shrink-0">
            {filteredData.length} / {data.length}
          </span>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {columns.map((col, i) => (
                  <th
                    key={i}
                    className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-400"
                  >
                    {col.header}
                  </th>
                ))}
                {(renderRowActions || onEdit || onDelete || onView) && (
                  <th className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-400 text-center">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={columns.length + ((renderRowActions || onEdit || onDelete || onView) ? 1 : 0)} className="px-4 py-8 text-center">
                    <div className="flex justify-center">
                      <div className="w-5 h-5 border-2 border-[#00B8C6]/20 border-t-[#00B8C6] rounded-full animate-spin" />
                    </div>
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + ((renderRowActions || onEdit || onDelete || onView) ? 1 : 0)} className="px-4 py-8 text-center text-sm text-gray-400">
                    No records found
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-cyan-50/30 transition-colors">
                    {columns.map((col, i) => (
                      <td
                        key={i}
                        className={`px-4 py-2 text-sm text-gray-600 ${col.className || ''}`}
                      >
                        {typeof col.accessor === 'function'
                          ? col.accessor(item)
                          : (item[col.accessor] as any)}
                      </td>
                    ))}
                    {(renderRowActions || onEdit || onDelete || onView) && (
                      <td className="px-4 py-2">
                        <div className="flex items-center justify-center gap-0.5">
                          {renderRowActions?.(item)}
                          {onView && (
                            <button
                              onClick={() => onView(item)}
                              className="p-1 text-gray-400 hover:text-[#00B8C6] hover:bg-[#00B8C6]/5 rounded transition-all"
                              title="View"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {onEdit && (
                            <PermissionButton
                              module={module}
                              action="update"
                              onClick={() => onEdit(item)}
                              variant="ghost"
                              className="!p-1 !bg-transparent !text-gray-400 hover:!text-amber-600 hover:!bg-amber-50"
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
                              className="!p-1 !bg-transparent !text-gray-400 hover:!text-rose-600 hover:!bg-rose-50"
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