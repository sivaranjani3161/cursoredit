'use client';

import { useEffect, useState } from 'react';
import { Camera, Image as ImageIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import DataTable, { Column } from '@/components/common/DataTable';
import GalleryForm from '@/components/gallery/GalleryForm';
import AwesomeClickForm from '@/components/gallery/AwesomeClickForm';

const API_BASE = '/api/proxy';

export default function GalleryPage() {
  const { data: session } = useSession();
  const [events, setEvents] = useState<any[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const [fcRows, setFcRows] = useState<any[]>([]);
  const [loadingFc, setLoadingFc] = useState(true);
  const [fcFormLoading, setFcFormLoading] = useState(false);
  const [fcFormOpen, setFcFormOpen] = useState(false);
  const [selectedFc, setSelectedFc] = useState<any>(null);

  const fetchEvents = async () => {
    try {
      setLoadingEvents(true);
      const res = await fetch(`${API_BASE}/gallery`);
      if (res.ok) setEvents(await res.json());
    } catch {
      toast.error('Failed to fetch gallery events');
    } finally {
      setLoadingEvents(false);
    }
  };

  const fetchFcImages = async () => {
    try {
      setLoadingFc(true);
      const res = await fetch(`${API_BASE}/awesome-clicks`);
      if (res.ok) setFcRows(await res.json());
    } catch {
      toast.error('Failed to fetch FC images');
    } finally {
      setLoadingFc(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchFcImages();
  }, []);

  const handleSaveEvent = async (formData: any) => {
    try {
      setFormLoading(true);
      const url = selectedEvent ? `${API_BASE}/gallery/${selectedEvent.id}` : `${API_BASE}/gallery`;
      const method = selectedEvent ? 'PUT' : 'POST';
      if (!selectedEvent) {
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
        toast.error(err.error || 'Failed to save gallery event');
        return;
      }
      toast.success(selectedEvent ? 'Gallery event updated' : 'Gallery event created');
      setSelectedEvent(null);
      setIsFormOpen(false);
      fetchEvents();
    } catch {
      toast.error('An error occurred');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditEvent = async (item: any) => {
    try {
      const res = await fetch(`${API_BASE}/gallery/${item.id}`);
      if (!res.ok) {
        toast.error('Failed to fetch event details');
        return;
      }
      setSelectedEvent(await res.json());
      setIsFormOpen(true);
    } catch {
      toast.error('Failed to fetch event details');
    }
  };

  const handleDeleteEvent = async (item: any) => {
    if (!confirm(`Delete event "${item.title}"?`)) return;
    try {
      const res = await fetch(`${API_BASE}/gallery/${item.id}`, { method: 'DELETE' });
      if (!res.ok) {
        toast.error('Failed to delete gallery event');
        return;
      }
      toast.success('Gallery event deleted');
      fetchEvents();
    } catch {
      toast.error('An error occurred');
    }
  };

  const handleSaveFc = async (payload: { imageUrl: string; altText: string | null }) => {
    try {
      setFcFormLoading(true);
      const url = selectedFc ? `${API_BASE}/awesome-clicks/${selectedFc.id}` : `${API_BASE}/awesome-clicks`;
      const method = selectedFc ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast.error(err.error || 'Failed to save');
        return;
      }
      toast.success(selectedFc ? 'Image updated' : 'Image added');
      setFcFormOpen(false);
      setSelectedFc(null);
      fetchFcImages();
    } catch {
      toast.error('An error occurred');
    } finally {
      setFcFormLoading(false);
    }
  };

  const handleEditFc = (item: any) => {
    setSelectedFc(item);
    setFcFormOpen(true);
  };

  const handleDeleteFc = async (item: any) => {
    if (!confirm('Delete this image?')) return;
    try {
      const res = await fetch(`${API_BASE}/awesome-clicks/${item.id}`, { method: 'DELETE' });
      if (!res.ok) {
        toast.error('Failed to delete');
        return;
      }
      toast.success('Deleted');
      fetchFcImages();
    } catch {
      toast.error('An error occurred');
    }
  };

  const eventColumns: Column<any>[] = [
    { header: 'Title', accessor: 'title', className: 'font-semibold text-gray-900' },
    { header: 'Slug', accessor: 'slug', className: 'font-mono text-xs text-gray-400' },
    { header: 'Location', accessor: (item) => item.location || '-', className: 'text-sm text-gray-600' },
    { header: 'Images', accessor: (item) => (Array.isArray(item.galleryImages) ? item.galleryImages.length : 0), className: 'text-xs text-gray-500' },
    {
      header: 'Date',
      accessor: (item) => (item.eventDate ? new Date(item.eventDate).toLocaleDateString() : '-'),
      className: 'text-xs text-gray-500',
    },
  ];

  const fcColumns: Column<any>[] = [
    {
      header: 'Preview',
      accessor: (item) =>
        item.imageUrl ? (
          <img src={item.imageUrl} alt="" className="w-14 h-14 rounded-lg object-cover border border-slate-100" />
        ) : (
          '-'
        ),
    },
    { header: 'Alt', accessor: (item) => item.altText || '-', className: 'text-xs text-gray-500 max-w-[200px] truncate' },
    {
      header: 'Added',
      accessor: (item) => new Date(item.createdAt).toLocaleString(),
      className: 'text-[11px] text-gray-400',
    },
  ];

  return (
    <div className="p-3 sm:p-4 space-y-6">
      <DataTable
        title="Events"
        icon={ImageIcon}
        module="gallery"
        data={events}
        columns={eventColumns}
        loading={loadingEvents}
        searchKey="title"
        searchPlaceholder="Search events..."
        onAdd={() => {
          setSelectedEvent(null);
          setIsFormOpen(true);
        }}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
        addButtonLabel="Add event"
      />

      {isFormOpen && (
        <GalleryForm
          initialData={selectedEvent}
          onSave={handleSaveEvent}
          onCancel={() => {
            setSelectedEvent(null);
            setIsFormOpen(false);
          }}
          loading={formLoading}
        />
      )}

      <DataTable
        title="FC Images"
        icon={Camera}
        module="gallery"
        data={fcRows}
        columns={fcColumns}
        loading={loadingFc}
        searchKey="imageUrl"
        searchPlaceholder="Search by image URL..."
        onAdd={() => {
          setSelectedFc(null);
          setFcFormOpen(true);
        }}
        onEdit={handleEditFc}
        onDelete={handleDeleteFc}
        addButtonLabel="Add FC Images"
      />

      {fcFormOpen && (
        <AwesomeClickForm
          initialData={selectedFc}
          onSave={handleSaveFc}
          onCancel={() => {
            setSelectedFc(null);
            setFcFormOpen(false);
          }}
          loading={fcFormLoading}
        />
      )}
    </div>
  );
}
