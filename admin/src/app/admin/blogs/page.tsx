'use client';

import { useEffect, useState } from 'react';
import { FileText } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import BlogForm from '@/components/blogs/BlogForm';
import DataTable, { Column } from '@/components/common/DataTable';
import { resolveMediaUrl } from '@/lib/resolveMediaUrl';

const API_BASE = '/api/proxy';

const STATUS_STYLES: Record<string, string> = {
  PUBLISHED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  DRAFT: 'bg-amber-50 text-amber-700 border-amber-200',
  ARCHIVED: 'bg-slate-100 text-slate-500 border-slate-200',
};

export default function BlogsPage() {
  const { data: session } = useSession();
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<any>(null);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/blogs`);
      if (res.ok) setBlogs(await res.json());
    } catch {
      toast.error('Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBlogs(); }, []);

  const handleSave = async (formData: any) => {
    try {
      setFormLoading(true);
      const url    = selectedBlog ? `${API_BASE}/blogs/${selectedBlog.id}` : `${API_BASE}/blogs`;
      const method = selectedBlog ? 'PUT' : 'POST';
      if (!selectedBlog) {
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
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast.error(err.error || 'Failed to save blog');
        return;
      }
      toast.success(selectedBlog ? 'Blog updated' : 'Blog created');
      setIsFormOpen(false);
      setSelectedBlog(null);
      fetchBlogs();
    } catch {
      toast.error('An error occurred');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = async (item: any) => {
    try {
      const res = await fetch(`${API_BASE}/blogs/${item.id}`);
      if (!res.ok) { toast.error('Failed to fetch blog details'); return; }
      setSelectedBlog(await res.json());
      setIsFormOpen(true);
    } catch {
      toast.error('Failed to fetch blog details');
    }
  };

  const handleDelete = async (item: any) => {
    if (!confirm(`Delete "${item.title}"?`)) return;
    try {
      const res = await fetch(`${API_BASE}/blogs/${item.id}`, { method: 'DELETE' });
      if (!res.ok) { toast.error('Failed to delete blog'); return; }
      toast.success('Blog deleted');
      fetchBlogs();
    } catch {
      toast.error('An error occurred');
    }
  };

  const handleTogglePublish = async (item: any) => {
    const newStatus = item.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      const res = await fetch(`${API_BASE}/blogs/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...item, status: newStatus }),
      });
      if (!res.ok) { toast.error('Failed to update status'); return; }
      toast.success(`Blog ${newStatus === 'PUBLISHED' ? 'published' : 'unpublished'}`);
      fetchBlogs();
    } catch {
      toast.error('An error occurred');
    }
  };
  
  const columns: Column<any>[] = [
    {
      header: 'Blog',
      accessor: (blog) => (
        <div className="flex items-center gap-2 min-w-0">
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
        showSearch={false}
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

      {/* Form modal */}
      {isFormOpen && (
        <BlogForm
          initialData={selectedBlog}
          existingBlogs={blogs}
          onSave={handleSave}
          onCancel={() => { setIsFormOpen(false); setSelectedBlog(null); }}
          loading={formLoading}
        />
      )}
    </div>
  );
}
