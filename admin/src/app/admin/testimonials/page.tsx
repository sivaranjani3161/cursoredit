'use client';

import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import DataTable, { Column } from '@/shared/components/DataTable';
import TestimonialForm from '@/features/testimonials/components/TestimonialForm';
import { resolveMediaUrl } from '@/shared/lib/resolveMediaUrl';
import type { ApiTestimonial, TestimonialFormData } from '@/shared/types';

const API_BASE = '/api/proxy';

export default function TestimonialsPage() {
  const { data: session } = useSession();
  const [items, setItems]             = useState<ApiTestimonial[]>([]);
  const [loading, setLoading]         = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [isFormOpen, setIsFormOpen]   = useState(false);
  const [selectedItem, setSelectedItem] = useState<ApiTestimonial | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ApiTestimonial | null>(null);
  const [deleting, setDeleting]       = useState(false);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/testimonials`);
      if (res.ok) setItems(await res.json());
    } catch { toast.error('Failed to fetch testimonials'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleSave = async (formData: TestimonialFormData) => {
    try {
      setFormLoading(true);
      const url    = selectedItem ? `${API_BASE}/testimonials/${selectedItem.id}` : `${API_BASE}/testimonials`;
      const method = selectedItem ? 'PUT' : 'POST';
      const payload = selectedItem
        ? formData
        : { ...formData, createdBy: Number(session?.user?.dbUserId) };
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast.error(err.error || 'Failed to save testimonial');
        return;
      }
      toast.success(selectedItem ? 'Testimonial updated' : 'Testimonial created');
      setIsFormOpen(false);
      setSelectedItem(null);
      fetchItems();
    } catch { toast.error('An error occurred'); }
    finally { setFormLoading(false); }
  };

  const handleEdit = (item: ApiTestimonial) => { setSelectedItem(item); setIsFormOpen(true); };

  const handleDelete = (item: ApiTestimonial) => {
    setDeleteTarget(item);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      const res = await fetch(`${API_BASE}/testimonials/${deleteTarget.id}`, { method: 'DELETE' });
      if (res.ok) { toast.success('Testimonial deleted'); fetchItems(); }
      else toast.error('Failed to delete testimonial');
    } catch {
      toast.error('An error occurred');
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const columns: Column<ApiTestimonial>[] = [
    {
      header: 'Preview',
      accessor: (item) =>
        item.thumbnailUrl ? (
          <img
            src={resolveMediaUrl(item.thumbnailUrl)}
            alt={item.name || 'testimonial'}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg object-cover border border-slate-200"
          />
        ) : (
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-slate-100 border border-slate-200" />
        ),
    },
    { header: 'Name',    accessor: 'name',                                           className: 'font-semibold text-gray-900 text-sm' },
    { header: 'Type',    accessor: (item) => String(item.type || '-').toUpperCase(), className: 'text-xs text-gray-500 hidden sm:table-cell' },
    { header: 'Company', accessor: (item) => item.company || '-',                   className: 'text-sm text-gray-600 hidden md:table-cell' },
    {
      header: 'Status',
      accessor: (item) => (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
          item.isActive
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
            : 'bg-slate-100 text-slate-500 border border-slate-200'
        }`}>
          {item.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
  ];

  return (
    <div className="p-3 sm:p-4">
      <DataTable
        title="Testimonials"
        icon={Star}
        module="testimonials"
        data={items}
        columns={columns}
        loading={loading}
        searchKey="name"
        searchPlaceholder="Search testimonials..."
        onAdd={() => { setSelectedItem(null); setIsFormOpen(true); }}
        onEdit={handleEdit}
        onDelete={handleDelete}
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
                  <p className="text-sm font-bold text-slate-800">Delete Testimonial</p>
                  <p className="text-[11px] text-slate-400">This action cannot be undone</p>
                </div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 mb-4">
                <p className="text-[10px] text-slate-400 mb-0.5">Testimonial to be deleted</p>
                <p className="text-sm font-semibold text-slate-800 truncate">{deleteTarget.name}</p>
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
        <TestimonialForm
          initialData={selectedItem ?? undefined}
          onSave={handleSave}
          onCancel={() => { setIsFormOpen(false); setSelectedItem(null); }}
          loading={formLoading}
        />
      )}
    </div>
  );
}