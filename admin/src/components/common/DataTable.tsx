'use client';

import { ReactNode, useMemo, useState } from 'react';
import { Search, Edit, Trash2, Eye, Plus, type LucideIcon } from 'lucide-react';
import PermissionButton from '../rbac/PermissionButton';

export interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => ReactNode);
  className?: string;
  mobileHidden?: boolean;
  mobileTitle?: boolean;
  mobileSubtitle?: boolean;
}

interface DataTableProps<T> {
  title: string;
  icon: LucideIcon;
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
  addButtonLabel?: string;
  renderRowActions?: (item: T) => ReactNode;
  showSearch?: boolean;
}

function getCellValue<T>(item: T, accessor: keyof T | ((item: T) => ReactNode)): ReactNode {
  return typeof accessor === 'function' ? accessor(item) : (item[accessor] as ReactNode);
}

export default function DataTable<T extends { id: number | string }>({
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

  const hasActions = !!(renderRowActions || onEdit || onDelete || onView);

  // Identify special columns for card layout
  const titleCol = columns.find((c) => c.mobileTitle) ?? columns[0];
  const subtitleCol = columns.find((c) => c.mobileSubtitle) ?? columns[1];
  const bodyColumns = columns.filter(
    (c) => c !== titleCol && c !== subtitleCol && !c.mobileHidden
  );

  return (
    <div className="space-y-2">

      {/* ── Header ── */}
      <div className="flex items-center justify-between bg-white rounded-xl border border-slate-200 px-3 sm:px-4 py-2.5 shadow-sm gap-2">
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <div className="p-1.5 rounded-lg bg-[#00B8C6]/10 flex-shrink-0">
            <Icon className="w-4 h-4 text-[#00B8C6]" />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm sm:text-base font-bold text-gray-900 leading-tight">{title}</h1>
            <p className="text-[10px] sm:text-[11px] text-gray-400 leading-tight hidden sm:block">
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
            className="!rounded-lg !px-2.5 sm:!px-3 !py-1.5 !text-xs !bg-[#00B8C6] hover:!bg-[#009da9] flex-shrink-0"
          >
            <span className="hidden sm:inline">{addButtonLabel ?? `Add ${title.replace(/s$/, '')}`}</span>
            <span className="sm:hidden">Add</span>
          </PermissionButton>
        )}
      </div>

      {/* ── Search bar ── */}
      {showSearch && (
        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200">
          <Search className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent focus:outline-none text-sm text-slate-800 placeholder:text-slate-400 min-w-0"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="text-[10px] font-semibold text-slate-400 hover:text-slate-600 flex-shrink-0"
            >
              Clear
            </button>
          )}
          <span className="text-[10px] text-gray-400 whitespace-nowrap shrink-0">
            {filteredData.length} / {data.length}
          </span>
        </div>
      )}

      {/* ── Mobile card list (< sm) ── */}
      <div className="sm:hidden space-y-2">
        {loading ? (
          <div className="bg-white rounded-xl border border-slate-200 px-4 py-8 flex justify-center">
            <div className="w-5 h-5 border-2 border-[#00B8C6]/20 border-t-[#00B8C6] rounded-full animate-spin" />
          </div>
        ) : filteredData.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 px-4 py-8 text-center text-sm text-gray-400">
            No records found
          </div>
        ) : (
          filteredData.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-slate-200 px-3.5 py-3 shadow-sm space-y-2"
            >
              {/* Card header: title + actions */}
             {/* Card header: title + actions */}
<div className="flex items-start justify-between gap-2">
  <div className="min-w-0 flex-1">
    <div className="min-w-0">
      {getCellValue(item, titleCol.accessor)}
    </div>
    {subtitleCol && subtitleCol !== titleCol && (
      <div className="mt-1">
        {getCellValue(item, subtitleCol.accessor)}
      </div>
    )}
  </div>

  {hasActions && (
    <div className="flex items-center gap-0.5 flex-shrink-0 mt-0.5">
      {renderRowActions?.(item)}
      {onView && (
        <button
          onClick={() => onView(item)}
          className="p-1.5 text-gray-400 hover:text-[#00B8C6] hover:bg-[#00B8C6]/5 rounded-lg transition-all"
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
          className="!p-1.5 !bg-transparent !text-gray-400 hover:!text-amber-600 hover:!bg-amber-50 !rounded-lg"
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
          className="!p-1.5 !bg-transparent !text-gray-400 hover:!text-rose-600 hover:!bg-rose-50 !rounded-lg"
          title="Delete"
          icon={Trash2}
        />
      )}
    </div>
  )}
</div>

              {/* Remaining body columns as label/value pairs */}
              {bodyColumns.length > 0 && (
                <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 pt-1 border-t border-slate-100">
                  {bodyColumns.map((col, i) => (
                    <div key={i} className="min-w-0">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">
                        {col.header}
                      </p>
                      <div className="text-xs text-gray-600 truncate">
                        {getCellValue(item, col.accessor)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* ── Desktop / tablet table (sm+) ── */}
      <div className="hidden sm:block bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {columns.map((col, i) => (
                  <th
                    key={i}
                    className={`px-3 sm:px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-400 ${col.className ?? ''}`}
                  >
                    {col.header}
                  </th>
                ))}
                {hasActions && (
                  <th className="px-3 sm:px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-400 text-center">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={columns.length + (hasActions ? 1 : 0)}
                    className="px-4 py-8 text-center"
                  >
                    <div className="flex justify-center">
                      <div className="w-5 h-5 border-2 border-[#00B8C6]/20 border-t-[#00B8C6] rounded-full animate-spin" />
                    </div>
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (hasActions ? 1 : 0)}
                    className="px-4 py-8 text-center text-sm text-gray-400"
                  >
                    No records found
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-cyan-50/30 transition-colors">
                    {columns.map((col, i) => (
                      <td
                        key={i}
                        className={`px-3 sm:px-4 py-2 text-sm text-gray-600 ${col.className || ''}`}
                      >
                        {getCellValue(item, col.accessor)}
                      </td>
                    ))}
                    {hasActions && (
                      <td className="px-3 sm:px-4 py-2">
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