'use client';

import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import DataTable, { Column } from '@/components/common/DataTable';
import TestimonialForm from '@/components/testimonials/TestimonialForm';

const API_BASE = '/api/proxy';

export default function TestimonialsPage() {
  const { data: session } = useSession();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/testimonials`);
      if (res.ok) setItems(await res.json());
    } catch {
      toast.error('Failed to fetch testimonials');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSave = async (formData: any) => {
    try {
      setFormLoading(true);
      const url = selectedItem ? `${API_BASE}/testimonials/${selectedItem.id}` : `${API_BASE}/testimonials`;
      const method = selectedItem ? 'PUT' : 'POST';
      if (!selectedItem) {
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
        toast.error(err.error || 'Failed to save testimonial');
        return;
      }
      toast.success(selectedItem ? 'Testimonial updated' : 'Testimonial created');
      setIsFormOpen(false);
      setSelectedItem(null);
      fetchItems();
    } catch {
      toast.error('An error occurred');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (item: any) => {
    setSelectedItem(item);
    setIsFormOpen(true);
  };

  const handleDelete = async (item: any) => {
    if (!confirm(`Delete testimonial "${item.name}"?`)) return;
    try {
      const res = await fetch(`${API_BASE}/testimonials/${item.id}`, { method: 'DELETE' });
      if (!res.ok) {
        toast.error('Failed to delete testimonial');
        return;
      }
      toast.success('Testimonial deleted');
      fetchItems();
    } catch {
      toast.error('An error occurred');
    }
  };

  const columns: Column<any>[] = [
    { header: 'Name', accessor: 'name', className: 'font-semibold text-gray-900' },
    { header: 'Type', accessor: (item) => String(item.type || '-').toUpperCase(), className: 'text-xs text-gray-500' },
    { header: 'Company', accessor: (item) => item.company || '-', className: 'text-sm text-gray-600' },
    {
      header: 'Status',
      accessor: (item) => (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${item.isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
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
        onAdd={() => {
          setSelectedItem(null);
          setIsFormOpen(true);
        }}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {isFormOpen && (
        <TestimonialForm
          initialData={selectedItem}
          onSave={handleSave}
          onCancel={() => {
            setIsFormOpen(false);
            setSelectedItem(null);
          }}
          loading={formLoading}
        />
      )}
    </div>
  );
}
