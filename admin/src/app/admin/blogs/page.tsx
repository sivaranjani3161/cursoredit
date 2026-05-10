'use client';

import { useEffect, useState } from 'react';
import { FileText } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import DataTable, { Column } from '@/components/common/DataTable';
import BlogForm from '@/components/blogs/BlogForm';

const API_BASE = '/api/proxy';

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

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleSave = async (formData: any) => {
    try {
      setFormLoading(true);
      const url = selectedBlog ? `${API_BASE}/blogs/${selectedBlog.id}` : `${API_BASE}/blogs`;
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
      if (!res.ok) {
        toast.error('Failed to fetch blog details');
        return;
      }
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
      if (!res.ok) {
        toast.error('Failed to delete blog');
        return;
      }
      toast.success('Blog deleted');
      fetchBlogs();
    } catch {
      toast.error('An error occurred');
    }
  };

  const columns: Column<any>[] = [
    { header: 'Title', accessor: 'title', className: 'font-semibold text-gray-900' },
    { header: 'Slug', accessor: 'slug', className: 'font-mono text-xs text-gray-400' },
    {
      header: 'Status',
      accessor: (item) => (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-cyan-50 text-cyan-700 border border-cyan-100">
          {item.status}
        </span>
      ),
    },
    {
      header: 'Tags',
      accessor: (item) => (Array.isArray(item.tags) ? item.tags.slice(0, 3).join(', ') || '-' : '-'),
      className: 'text-xs text-gray-500',
    },
    {
      header: 'Created',
      accessor: (item) => new Date(item.createdAt).toLocaleDateString(),
      className: 'text-gray-400 text-xs',
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
        onAdd={() => {
          setSelectedBlog(null);
          setIsFormOpen(true);
        }}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {isFormOpen && (
        <BlogForm
          initialData={selectedBlog}
          existingBlogs={blogs}
          onSave={handleSave}
          onCancel={() => {
            setIsFormOpen(false);
            setSelectedBlog(null);
          }}
          loading={formLoading}
        />
      )}
    </div>
  );
}
