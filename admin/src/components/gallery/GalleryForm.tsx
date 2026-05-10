'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Save, Trash2, X } from 'lucide-react';
import ImageUpload from '../common/ImageUpload';

interface Props {
  initialData?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
  loading?: boolean;
}

const SIDEBAR_WIDTH = 252;
const inputClass =
  'w-full h-9 px-3 rounded-md border border-slate-300 bg-white text-[13px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#00B8C6]';

export default function GalleryForm({ initialData, onSave, onCancel, loading }: Props) {
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    location: '',
    coverImage: '',
    description: '',
    eventDate: '',
    galleryImages: [] as Array<{ imageUrl: string; altText: string }>,
  });

  useEffect(() => {
    setMounted(true);
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  useEffect(() => {
    if (!initialData) return;
    setFormData({
      title: initialData.title ?? '',
      slug: initialData.slug ?? '',
      location: initialData.location ?? '',
      coverImage: initialData.coverImage ?? '',
      description: initialData.description ?? '',
      eventDate: initialData.eventDate ? String(initialData.eventDate).slice(0, 10) : '',
      galleryImages: Array.isArray(initialData.galleryImages)
        ? initialData.galleryImages.map((img: any) => ({
            imageUrl: img.imageUrl ?? '',
            altText: img.altText ?? '',
          }))
        : [],
    });
  }, [initialData]);

  const generateSlug = (title: string) =>
    title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      location: formData.location || null,
      coverImage: formData.coverImage || null,
      description: formData.description || null,
      eventDate: formData.eventDate || null,
      galleryImages: formData.galleryImages.filter((item) => item.imageUrl.trim().length > 0),
    });
  };

  if (!mounted) return null;

  return createPortal(
    <>
      <div className="fixed z-[59] bg-[#00B8C644] rounded-xl" style={{ left: `${SIDEBAR_WIDTH + 12}px`, top: '12px', right: '12px', bottom: '12px' }} onClick={onCancel} />
      <div className="fixed inset-y-0 right-0 z-[60] flex items-center justify-center p-2" style={{ left: `${SIDEBAR_WIDTH}px`, pointerEvents: 'none' }}>
        <div style={{ pointerEvents: 'auto' }} className="w-full max-w-[820px]">
          <div className="w-full max-h-[80vh] bg-white rounded-md border border-slate-200 shadow-sm flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100 flex-shrink-0">
              <h2 className="text-[18px] font-semibold text-slate-900">{initialData ? 'Edit Gallery Event' : 'New Gallery Event'}</h2>
              <button onClick={onCancel} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form id="gallery-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-3">
              <div className="grid grid-cols-[1fr_280px] gap-3 items-start">
                <div className="space-y-2">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-700 mb-1">Title *</label>
                    <input required value={formData.title} onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value, slug: generateSlug(e.target.value) }))} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-700 mb-1">Slug *</label>
                    <input required value={formData.slug} onChange={(e) => setFormData((p) => ({ ...p, slug: e.target.value }))} className={`${inputClass} font-mono`} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-700 mb-1">Location</label>
                      <input value={formData.location} onChange={(e) => setFormData((p) => ({ ...p, location: e.target.value }))} className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-700 mb-1">Event Date</label>
                      <input type="date" value={formData.eventDate} onChange={(e) => setFormData((p) => ({ ...p, eventDate: e.target.value }))} className={inputClass} />
                    </div>
                  </div>
                </div>
                <ImageUpload label="Cover Image" compact value={formData.coverImage} onChange={(url) => setFormData((p) => ({ ...p, coverImage: url }))} />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-700 mb-1">Description</label>
                <textarea rows={3} value={formData.description} onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))} className="w-full px-3 py-2 rounded-md border border-slate-300 bg-white text-[13px] text-slate-900 focus:outline-none focus:border-[#00B8C6]" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-bold uppercase tracking-wide text-slate-700">Gallery Images</h3>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((p) => ({
                        ...p,
                        galleryImages: [...p.galleryImages, { imageUrl: '', altText: '' }],
                      }))
                    }
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md bg-cyan-50 text-cyan-700"
                  >
                    <Plus className="w-3 h-3" /> Add Image
                  </button>
                </div>
                {formData.galleryImages.map((item, index) => (
                  <div key={index} className="grid grid-cols-[190px_1fr_40px] gap-2 items-end border border-slate-200 rounded-md p-2">
                    <ImageUpload compact value={item.imageUrl} onChange={(url) => setFormData((p) => ({ ...p, galleryImages: p.galleryImages.map((img, i) => (i === index ? { ...img, imageUrl: url } : img)) }))} />
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-700 mb-1">Alt Text</label>
                      <input value={item.altText} onChange={(e) => setFormData((p) => ({ ...p, galleryImages: p.galleryImages.map((img, i) => (i === index ? { ...img, altText: e.target.value } : img)) }))} className={inputClass} />
                    </div>
                    <button type="button" onClick={() => setFormData((p) => ({ ...p, galleryImages: p.galleryImages.filter((_, i) => i !== index) }))} className="p-2 rounded-md text-rose-500 hover:bg-rose-50">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </form>

            <div className="px-4 py-2 border-t border-slate-100 flex items-center justify-end gap-2 bg-white flex-shrink-0">
              <button type="button" onClick={onCancel} className="px-3 py-1.5 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-100 transition">
                Cancel
              </button>
              <button form="gallery-form" type="submit" disabled={loading} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 transition disabled:opacity-50">
                <Save className="w-3 h-3" />
                {initialData ? 'Update Event' : 'Create Event'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
