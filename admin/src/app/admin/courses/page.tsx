'use client';

import { useState, useEffect } from 'react';
import { BookOpen } from 'lucide-react';
import { useSession } from 'next-auth/react';
import DataTable, { Column } from '@/components/common/DataTable';
import CourseForm from '@/components/courses/CourseForm';
import { toast } from 'react-hot-toast';

const API_BASE = '/api/proxy';

export default function CoursesPage() {
  const { data: session } = useSession();
  const [courses, setCourses]           = useState<any[]>([]);
  const [loading, setLoading]           = useState(true);
  const [isFormOpen, setIsFormOpen]     = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [formLoading, setFormLoading]   = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [deleting, setDeleting]         = useState(false);

  useEffect(() => { fetchCourses(); }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/courses`);
      if (res.ok) setCourses(await res.json());
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData: any) => {
    try {
      setFormLoading(true);
      const url = selectedCourse
        ? `${API_BASE}/courses/${selectedCourse.id}`
        : `${API_BASE}/courses`;
      const method = selectedCourse ? 'PUT' : 'POST';
      if (!selectedCourse) {
        const dbUserId = Number((session?.user as any)?.dbUserId);
        if (Number.isNaN(dbUserId)) {
          toast.error('Session is missing user id. Please sign in again.');
          return;
        }
        formData.createdBy = dbUserId;
      }
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        toast.success(selectedCourse ? 'Course updated' : 'Course created');
        setIsFormOpen(false);
        setSelectedCourse(null);
        fetchCourses();
      } else {
        const err = await res.json();
        toast.error(err.error || 'Failed to save course');
      }
    } catch (error) {
      console.error('Error saving course:', error);
      toast.error('An error occurred');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = (course: any) => {
    setDeleteTarget(course);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      const res = await fetch(`${API_BASE}/courses/${deleteTarget.id}`, { method: 'DELETE' });
      if (res.ok) { toast.success('Course deleted'); fetchCourses(); }
      else toast.error('Failed to delete course');
    } catch {
      toast.error('An error occurred');
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const handleEdit = async (course: any) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/courses/${course.id}`);
      if (res.ok) {
        setSelectedCourse(await res.json());
        setIsFormOpen(true);
      }
    } catch { toast.error('Failed to fetch course details'); }
    finally { setLoading(false); }
  };

  const handleTogglePublish = async (course: any) => {
    const next = !course.isActive;
    try {
      const res = await fetch(`${API_BASE}/courses/${course.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...course, isActive: next }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast.error(err.error || 'Failed to update publish status');
        return;
      }
      toast.success(next ? 'Course published' : 'Course unpublished');
      fetchCourses();
    } catch {
      toast.error('An error occurred');
    }
  };

  const columns: Column<any>[] = [
    {
      mobileTitle: true,
      header: 'Title',
      accessor: (item) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#00B8C6]/10 flex items-center justify-center text-[#00B8C6] font-bold text-[10px] shrink-0">
            {item.title[0].toUpperCase()}
          </div>
          <span className="font-semibold text-gray-900 text-sm">{item.title}</span>
        </div>
      ),
    },
    {
      mobileHidden: true,
      header: 'Slug',
      accessor: 'slug',
      className: 'font-mono text-xs text-gray-400 hidden sm:table-cell',
    },
    {
      mobileSubtitle: true,
      header: 'Status',
      accessor: (item) => (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
          item.isActive
            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
            : 'bg-amber-50 text-amber-600 border border-amber-100'
        }`}>
          {item.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      header: 'Created',
      accessor: (item) => new Date(item.createdAt).toLocaleDateString(),
      className: 'text-gray-400 text-xs hidden md:table-cell',
    },
  ];

  return (
    <div className="p-3 sm:p-4">
      <DataTable
        title="Courses"
        icon={BookOpen}
        module="courses"
        data={courses}
        columns={columns}
        loading={loading}
        searchKey="title"
        searchPlaceholder="Search courses..."
        onAdd={() => { setSelectedCourse(null); setIsFormOpen(true); }}
        onEdit={handleEdit}
        onDelete={handleDelete}
        renderRowActions={(item) => (
          <button
            onClick={() => handleTogglePublish(item)}
            title={item.isActive ? 'Unpublish' : 'Publish'}
            className={`h-6 px-2 rounded-md border text-[10px] font-bold uppercase tracking-wide transition-all ${
              item.isActive
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                : 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'
            }`}
          >
            {item.isActive ? 'Unpublish' : 'Publish'}
          </button>
        )}
      />

      {/* ── Delete confirmation modal ── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={() => setDeleteTarget(null)}
          />
          <div className="relative z-10 w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="h-1 w-full bg-rose-500" />
            <div className="px-5 pt-5 pb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">Delete Course</p>
                  <p className="text-[11px] text-slate-400">This action cannot be undone</p>
                </div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 mb-4">
                <p className="text-[10px] text-slate-400 mb-0.5">Course to be deleted</p>
                <p className="text-sm font-semibold text-slate-800 truncate">{deleteTarget.title}</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  disabled={deleting}
                  className="flex-1 py-2 rounded-lg bg-rose-500 text-white text-sm font-bold hover:bg-rose-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {deleting && (
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  )}
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isFormOpen && (
        <CourseForm
          initialData={selectedCourse}
          onSave={handleSave}
          onCancel={() => { setIsFormOpen(false); setSelectedCourse(null); }}
          loading={formLoading}
        />
      )}
    </div>
  );
}