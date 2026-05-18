'use client';

import { useEffect, useState } from 'react';
import { FileText } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import BlogForm from '@/features/blogs/components/BlogForm';
import DataTable, { Column } from '@/shared/components/DataTable';
import { resolveMediaUrl } from '@/shared/lib/resolveMediaUrl';
import type { ApiBlog, BlogFormData } from '@/shared/types';
import { useError } from '@/shared/context/ErrorContext';

const API_BASE = '/api/proxy';

const STATUS_STYLES: Record<string, string> = {
  PUBLISHED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  DRAFT:     'bg-amber-50 text-amber-700 border-amber-200',
  ARCHIVED:  'bg-slate-100 text-slate-500 border-slate-200',
};

export default function BlogsPage() {
  const { setError } = useError();
  const { data: session } = useSession();
  const [blogs, setBlogs]               = useState<ApiBlog[]>([]);
  const [loading, setLoading]           = useState(true);
  const [formLoading, setFormLoading]   = useState(false);
  const [isFormOpen, setIsFormOpen]     = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<ApiBlog | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ApiBlog | null>(null);
  const [deleting, setDeleting]         = useState(false);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/blogs`);
      if (res.ok) setBlogs(await res.json());
    } catch {
      setError('Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBlogs(); }, []);

  const handleSave = async (formData: BlogFormData) => {
    try {
      setFormLoading(true);
      const url    = selectedBlog ? `${API_BASE}/blogs/${selectedBlog.id}` : `${API_BASE}/blogs`;
      const method = selectedBlog ? 'PUT' : 'POST';
      const payload = selectedBlog
        ? formData
        : { ...formData, createdBy: Number(session?.user?.dbUserId) };
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setError(err.error || 'Failed to save blog');
        return;
      }
      toast.success(selectedBlog ? 'Blog updated' : 'Blog created');
      setIsFormOpen(false);
      setSelectedBlog(null);
      fetchBlogs();
    } catch {
      setError('An error occurred');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = async (item: ApiBlog) => {
    try {
      const res = await fetch(`${API_BASE}/blogs/${item.id}`);
      if (!res.ok) { setError('Failed to fetch blog details'); return; }
      setSelectedBlog(await res.json());
      setIsFormOpen(true);
    } catch {
      setError('Failed to fetch blog details');
    }
  };

  const handleDelete = (item: ApiBlog) => {
    setDeleteTarget(item);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      const res = await fetch(`${API_BASE}/blogs/${deleteTarget.id}`, { method: 'DELETE' });
      if (!res.ok) { setError('Failed to delete blog'); return; }
      toast.success('Blog deleted');
      fetchBlogs();
    } catch {
      setError('An error occurred');
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const handleTogglePublish = async (item: ApiBlog) => {
    const newStatus: ApiBlog['status'] = item.status === 'published' ? 'draft' : 'published';
    try {
      const res = await fetch(`${API_BASE}/blogs/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...item, status: newStatus }),
      });
      if (!res.ok) { setError('Failed to update status'); return; }
      toast.success(`Blog ${newStatus === 'published' ? 'published' : 'unpublished'}`);
      fetchBlogs();
    } catch {
      setError('An error occurred');
    }
  };

  const columns: Column<ApiBlog>[] = [
    {
      mobileTitle: true,
      header: 'Blog',
      accessor: (blog) => (
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-lg flex-shrink-0 overflow-hidden bg-slate-100 border border-slate-200">
            {blog.coverImage ? (
              <img src={resolveMediaUrl(blog.coverImage)} alt={blog.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <FileText className="w-4 h-4 text-slate-300" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">{blog.title}</p>
            <p className="text-[10px] text-slate-400 font-mono truncate">{blog.slug}</p>
          </div>
        </div>
      ),
    },
    {
      mobileSubtitle: true,
      header: 'Status',
      accessor: (blog) => {
        const status = (blog.status as string) || 'DRAFT';
        return (
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${STATUS_STYLES[status] ?? STATUS_STYLES.DRAFT}`}>
            {status}
          </span>
        );
      },
    },
    {
      header: 'Excerpt',
      accessor: (blog) => (
        <span className="text-xs text-slate-500 line-clamp-2 max-w-[340px]">
          {blog.excerpt || '-'}
        </span>
      ),
      className: 'hidden md:table-cell',
    },
    {
      header: 'Created',
      accessor: (blog) =>
        blog.createdAt
          ? new Date(blog.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
          : '-',
      className: 'text-xs text-slate-500',
    },
  ];

  return (
    <div className="p-3 sm:p-4">
      <DataTable
        title="Blogs"
        icon={FileText}
        module="blogs"
        data={blogs}
        columns={columns}
        loading={loading}
        searchKey="title"
        searchPlaceholder="Search blogs..."
        onAdd={() => { setSelectedBlog(null); setIsFormOpen(true); }}
        onEdit={handleEdit}
        onDelete={handleDelete}
        renderRowActions={(blog) => {
          const status = (blog.status as string) || 'DRAFT';
          const isPublished = status === 'PUBLISHED';
          return (
            <button
              onClick={() => handleTogglePublish(blog)}
              title={isPublished ? 'Unpublish' : 'Publish'}
              className={`h-6 px-2 rounded-md border text-[10px] font-bold uppercase tracking-wide transition-all ${
                isPublished
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                  : 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'
              }`}
            >
              {isPublished ? 'Unpublish' : 'Publish'}
            </button>
          );
        }}
      />

      {/* ── Delete confirmation modal ── */}
      {deleteTarget && (
<div className="fixed inset-0 z-50 flex items-center justify-center px-4">     
       <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={() => setDeleteTarget(null)}
          />
<div className="relative z-10 w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">            <div className="h-1 w-full bg-rose-500" />
            <div className="px-5 pt-5 pb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">Delete Blog</p>
                  <p className="text-[11px] text-slate-400">This action cannot be undone</p>
                </div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 mb-4">
                <p className="text-[10px] text-slate-400 mb-0.5">Blog to be deleted</p>
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
        <BlogForm
          initialData={selectedBlog ?? undefined}
          existingBlogs={blogs}
          onSave={handleSave}
          onCancel={() => { setIsFormOpen(false); setSelectedBlog(null); }}
          loading={formLoading}
        />
      )}
    </div>
  );
}