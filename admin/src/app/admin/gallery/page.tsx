'use client';

import { useEffect, useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import DataTable, { Column } from '@/components/common/DataTable';
import UnifiedGalleryForm from '@/components/gallery/UnifiedGalleryForm';
import { resolveMediaUrl } from '@/lib/resolveMediaUrl';

const API_BASE = '/api/proxy';

type GalleryType = 'internal' | 'external';

export default function GalleryPage() {
  const { data: session } = useSession();
  const [events, setEvents] = useState<any[]>([]);
  const [fcRows, setFcRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [formLoading, setFormLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [selectedType, setSelectedType] = useState<GalleryType>('external');

  const fetchEvents = async () => {
    try {
      const res = await fetch(`${API_BASE}/gallery`);
      if (res.ok) setEvents(await res.json());
    } catch {
      toast.error('Failed to fetch gallery events');
    }
  };

  const fetchFcImages = async () => {
    try {
      const res = await fetch(`${API_BASE}/awesome-clicks`);
      if (res.ok) setFcRows(await res.json());
    } catch {
      toast.error('Failed to fetch FC images');
    }
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        await Promise.all([fetchEvents(), fetchFcImages()]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSave = async (formData: any, type: GalleryType) => {
    try {
      setFormLoading(true);
      const isEdit = Boolean(selected);

      if (type === 'external') {
        const url = isEdit ? `${API_BASE}/gallery/${selected.id}` : `${API_BASE}/gallery`;
        const method = isEdit ? 'PUT' : 'POST';
        if (!isEdit) {
          const dbUserId = Number((session?.user as any)?.dbUserId);
          if (Number.isNaN(dbUserId)) {
            toast.error('Session is missing user id. Please sign in again.');
            return;
          }
          formData.createdBy = dbUserId;
        }
        const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          toast.error(err.error || 'Failed to save');
          return;
        }
        toast.success(isEdit ? 'Event updated' : 'Event created');
        setSelected(null);
        setIsFormOpen(false);
        fetchEvents();
      } else {
        const url = isEdit ? `${API_BASE}/awesome-clicks/${selected.id}` : `${API_BASE}/awesome-clicks`;
        const method = isEdit ? 'PUT' : 'POST';
        const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          toast.error(err.error || 'Failed to save');
          return;
        }
        toast.success(isEdit ? 'Image updated' : 'Image added');
        setSelected(null);
        setIsFormOpen(false);
        fetchFcImages();
      }
    } catch {
      toast.error('An error occurred');
    } finally {
      setFormLoading(false);
    }
  };

  const rows = [
    ...events.map((e) => ({ ...e, __type: 'external' as const })),
    ...fcRows.map((i) => ({ ...i, __type: 'internal' as const })),
  ];

  const columns: Column<any>[] = [
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
      accessor: (item) =>
        item.__type === 'internal' ? (
          <div className="flex items-center gap-2">
            {item.imageUrl ? (
              <img src={resolveMediaUrl(item.imageUrl)} alt="" className="w-10 h-10 rounded-lg object-cover border border-slate-100" />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-slate-100" />
            )}
            <span className="text-sm font-semibold text-slate-800">FC Image</span>
          </div>
        ) : (
          <span className="font-semibold text-gray-900">{item.title}</span>
        ),
    },
    {
      header: 'Details',
      accessor: (item) =>
        item.__type === 'internal'
          ? (item.altText || '-')
          : (item.location || '-'),
      className: 'text-xs text-gray-500',
    },
    {
      header: 'Date',
      accessor: (item) =>
        item.__type === 'internal'
          ? (item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '-')
          : (item.eventDate ? new Date(item.eventDate).toLocaleDateString() : '-'),
      className: 'text-xs text-gray-500',
    },
  ];

  const handleEdit = async (item: any) => {
    try {
      const type = item.__type as GalleryType;
      setSelectedType(type);
      const res = await fetch(
        type === 'external' ? `${API_BASE}/gallery/${item.id}` : `${API_BASE}/awesome-clicks/${item.id}`
      );
      if (!res.ok) {
        toast.error('Failed to fetch details');
        return;
      }
      setSelected(await res.json());
      setIsFormOpen(true);
    } catch {
      toast.error('Failed to fetch details');
    }
  };

  const handleDelete = async (item: any) => {
    const type = item.__type as GalleryType;
    const msg =
      type === 'external' ? `Delete event "${item.title}"?` : 'Delete this internal image?';
    if (!confirm(msg)) return;
    try {
      const res = await fetch(
        type === 'external' ? `${API_BASE}/gallery/${item.id}` : `${API_BASE}/awesome-clicks/${item.id}`,
        { method: 'DELETE' }
      );
      if (!res.ok) {
        toast.error('Failed to delete');
        return;
      }
      toast.success('Deleted');
      if (type === 'external') fetchEvents();
      else fetchFcImages();
    } catch {
      toast.error('An error occurred');
    }
  };

  return (
    <div className="p-3 sm:p-4 space-y-3">
      <div className="bg-white rounded-xl border border-slate-200 px-4 py-3 shadow-sm flex items-end justify-between gap-3">
        <div>
          <h1 className="text-base font-bold text-slate-900 leading-tight">Gallery</h1>
          <p className="text-[11px] text-slate-400 leading-tight">Internal and external entries in one place.</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as GalleryType)}
            className="h-8 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00B8C6]/20 focus:border-[#00B8C6] focus:bg-white"
          >
            <option value="external">External (Events)</option>
            <option value="internal">Internal (FC Images)</option>
          </select>
          <button
            type="button"
            onClick={() => {
              setSelected(null);
              setIsFormOpen(true);
            }}
            className="h-8 px-3 rounded-lg bg-[#00B8C6] text-white text-xs font-bold hover:brightness-95 transition-all"
          >
            Add
          </button>
        </div>
      </div>

      <DataTable
        title="Gallery"
        icon={ImageIcon}
        module="gallery"
        data={rows}
        columns={columns}
        loading={loading}
        searchKey="title"
        searchPlaceholder="Search..."
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {isFormOpen && (
        <UnifiedGalleryForm
          type={selectedType}
          initialData={selected}
          onSave={handleSave}
          onCancel={() => {
            setSelected(null);
            setIsFormOpen(false);
          }}
          loading={formLoading}
        />
      )}
    </div>
  );
}
