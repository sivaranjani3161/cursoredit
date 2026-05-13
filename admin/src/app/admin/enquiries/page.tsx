'use client';

import { useEffect, useMemo, useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { toast } from 'react-hot-toast';
import DataTable, { Column } from '@/components/common/DataTable';

const API_BASE = '/api/proxy';

export default function EnquiriesPage() {
  const [items, setItems] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [courseFilter, setCourseFilter] = useState<string>('all');

  const fetchItems = async () => {
    try {
      setLoading(true);
      const [enquiriesRes, coursesRes] = await Promise.all([
        fetch(`${API_BASE}/enquiries`),
        fetch(`${API_BASE}/courses`),
      ]);
      if (enquiriesRes.ok) setItems(await enquiriesRes.json());
      if (coursesRes.ok) setCourses(await coursesRes.json());
    } catch {
      toast.error('Failed to fetch enquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const filteredItems = useMemo(() => {
    return items.filter((row) => {
      if (statusFilter !== 'all' && row.status !== statusFilter) return false;
      if (courseFilter === 'all') return true;
      if (courseFilter === 'none') return row.courseId == null;
      return String(row.courseId) === courseFilter;
    });
  }, [items, statusFilter, courseFilter]);

  const columns: Column<any>[] = [
    { header: 'Name',    accessor: 'fullName',                                   className: 'font-semibold text-gray-900 text-sm' },
    { header: 'Email',   accessor: 'email',                                      className: 'text-sm text-gray-600 hidden sm:table-cell' },
    { header: 'Phone',   accessor: (item) => item.phone || '-',                  className: 'text-xs text-gray-500 hidden md:table-cell' },
    { header: 'Course',  accessor: (item) => item.course?.title || '-',          className: 'text-xs text-gray-500 hidden sm:table-cell' },
    {
      header: 'Status',
      accessor: (item) => (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-cyan-50 text-cyan-700 border border-cyan-100">
          {item.status}
        </span>
      ),
    },
    {
      header: 'Submitted',
      accessor: (item) => new Date(item.createdAt).toLocaleDateString(),
      className: 'text-[11px] text-gray-400 hidden lg:table-cell',
    },
  ];

  return (
    <div className="p-3 sm:p-4 space-y-2">
      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 bg-white px-3 py-2.5 rounded-xl border border-slate-200">
        {/* Status filter */}
        <div className="flex flex-col gap-1 sm:min-w-[140px]">
          <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#00B8C6]"
          >
            <option value="all">All statuses</option>
            <option value="NEW">New</option>
            <option value="CONTACTED">Contacted</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>

        {/* Course filter */}
        <div className="flex flex-col gap-1 flex-1 sm:min-w-[180px]">
          <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Course</label>
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#00B8C6]"
          >
            <option value="all">All courses</option>
            <option value="none">No course</option>
            {courses.map((c) => (
              <option key={c.id} value={String(c.id)}>{c.title}</option>
            ))}
          </select>
        </div>

        {/* Count */}
        <div className="flex items-center sm:items-end text-[11px] text-slate-400 sm:pb-1 sm:ml-auto">
          Showing {filteredItems.length} of {items.length}
        </div>
      </div>

      <DataTable
        title="Enquiries"
        icon={MessageSquare}
        module="enquiries"
        data={filteredItems}
        columns={columns}
        loading={loading}
        searchKey="fullName"
        searchPlaceholder="Search by name..."
      />
    </div>
  );
}