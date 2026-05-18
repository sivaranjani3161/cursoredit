'use client';

import { useEffect, useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import DataTable, { Column } from '@/shared/components/DataTable';
import UnifiedGalleryForm from '@/features/gallery/components/UnifiedGalleryForm';
import { resolveMediaUrl } from '@/shared/lib/resolveMediaUrl';
import type { ApiGalleryEvent, GalleryFormData, GalleryType } from '@/shared/types';
import { useError } from '@/shared/context/ErrorContext';

const API_BASE = '/api/proxy';

interface GalleryRow extends ApiGalleryEvent {
  __type: GalleryType;
}

export default function GalleryPage() {
  const { setError } = useError();
  const { data: session } = useSession();
  const [rows, setRows]               = useState<GalleryRow[]>([]);
  const [loading, setLoading]         = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [isFormOpen, setIsFormOpen]   = useState(false);
  const [selected, setSelected]       = useState<ApiGalleryEvent | null>(null);
  const [selectedType, setSelectedType] = useState<GalleryType>('external');
  const [deleteTarget, setDeleteTarget] = useState<GalleryRow | null>(null);
  const [deleting, setDeleting]       = useState(false);

  const fetchAll = async () => {
    try {
      const res = await fetch(`${API_BASE}/gallery`);
      if (res.ok) {
        const data = await res.json();
        setRows(data.map((e: ApiGalleryEvent) => ({ ...e, __type: e.type as GalleryType })));
      } else {
        setError('Failed to fetch gallery');
      }
    } catch { setError('Failed to fetch gallery'); }
  };

  useEffect(() => {
    (async () => {
      try { setLoading(true); await fetchAll(); }
      finally { setLoading(false); }
    })();
  }, []);

  const handleSave = async (formData: GalleryFormData | { imageUrl: string; altText: string | null }, type: GalleryType) => {
    try {
      setFormLoading(true);
      const isEdit = Boolean(selected);
      const url = isEdit ? `${API_BASE}/gallery/${selected!.id}` : `${API_BASE}/gallery`;
      const method = isEdit ? 'PUT' : 'POST';
      const finalPayload = (type === 'external' && !isEdit)
        ? { ...formData, type, createdBy: Number(session?.user?.dbUserId) }
        : { ...formData, type };
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(finalPayload) });
      if (!res.ok) { const err = await res.json().catch(() => ({})); setError(err.error || 'Failed to save'); return; }
      toast.success(isEdit ? 'Updated' : 'Created');
      setSelected(null); setIsFormOpen(false);
      await fetchAll();
    } catch { setError('An error occurred'); }
    finally { setFormLoading(false); }
  };

  const handleEdit = async (item: GalleryRow) => {
    try {
      setSelectedType(item.__type as GalleryType);
      const res = await fetch(`${API_BASE}/gallery/${item.id}`);
      if (!res.ok) { setError('Failed to fetch details'); return; }
      setSelected(await res.json());
      setIsFormOpen(true);
    } catch { setError('Failed to fetch details'); }
  };

  const handleDelete = (item: GalleryRow) => {
    setDeleteTarget(item);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      const res = await fetch(`${API_BASE}/gallery/${deleteTarget.id}`, { method: 'DELETE' });
      if (!res.ok) { setError('Failed to delete'); return; }
      toast.success('Deleted');
      await fetchAll();
    } catch { setError('An error occurred'); }
    finally { setDeleting(false); setDeleteTarget(null); }
  };

  const columns: Column<GalleryRow>[] = [
    {
      header: 'Type',
      accessor: (item) => (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
          item.__type === 'internal'
            ? 'bg-slate-100 text-slate-600 border border-slate-200'
            : 'bg-cyan-50 text-cyan-700 border border-cyan-100'
        }`}>
          {item.__type === 'internal' ? 'Internal' : 'External'}
        </span>
      ),
    },
    {
      header: 'Title / Preview',
      mobileTitle: true,
      accessor: (item) =>
        item.__type === 'internal' ? (
          <div className="flex items-center gap-2">
            {item.galleryImages?.[0]?.imageUrl ? (
              <img src={resolveMediaUrl(item.galleryImages[0].imageUrl)} alt="" className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg object-cover border border-slate-100" />
            ) : (
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-slate-100" />
            )}
            <span className="text-sm font-semibold text-slate-800">{item.galleryImages?.[0]?.altText || 'FC Image'}</span>
          </div>
        ) : (
          <span className="font-semibold text-gray-900 text-sm truncate max-w-[120px] sm:max-w-none block">{item.title}</span>
        ),
    },
    {
      header: 'Details',
      mobileSubtitle: true,
      accessor: (item) => item.__type === 'internal' ? '-' : (item.location || '-'),
      className: 'text-xs text-gray-500 hidden sm:table-cell',
    },
    {
      header: 'Date',
      accessor: (item) => item.eventDate
        ? new Date(item.eventDate).toLocaleDateString()
        : (item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '-'),
      className: 'text-xs text-gray-500 hidden md:table-cell',
    },
  ];

  const deleteLabel = deleteTarget?.__type === 'internal' ? 'Image' : 'Event';
  const deleteTitle = deleteTarget?.__type === 'internal'
    ? (deleteTarget?.galleryImages?.[0]?.altText || 'FC Image')
    : (deleteTarget?.title || '');

  return (
    <div className="p-3 sm:p-4">
      <DataTable
        title="Gallery"
        icon={ImageIcon}
        module="gallery"
        data={rows}
        columns={columns}
        loading={loading}
        searchKey="title"
        searchPlaceholder="Search..."
        onAdd={() => { setSelected(null); setSelectedType('external'); setIsFormOpen(true); }}
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
                  <p className="text-sm font-bold text-slate-800">Delete {deleteLabel}</p>
                  <p className="text-[11px] text-slate-400">This action cannot be undone</p>
                </div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 mb-4">
                <p className="text-[10px] text-slate-400 mb-0.5">{deleteLabel} to be deleted</p>
                <p className="text-sm font-semibold text-slate-800 truncate">{deleteTitle}</p>
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
        <UnifiedGalleryForm
          type={selectedType}
          initialData={selected ?? undefined}
          onSave={handleSave}
          onCancel={() => { setSelected(null); setIsFormOpen(false); }}
          loading={formLoading}
        />
      )}
    </div>
  );
}