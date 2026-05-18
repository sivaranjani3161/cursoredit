'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Save, Trash2, X } from 'lucide-react';
import ImageUpload from '@/shared/components/ImageUpload';
import type { ApiGalleryEvent, GalleryFormData, GalleryImage } from '@/shared/types';

interface Props {
  initialData?: ApiGalleryEvent;
  onSave: (data: GalleryFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

const SIDEBAR_WIDTH = 262;
const TOP_OFFSET = 12;
const RIGHT_OFFSET = 12;
const BOTTOM_OFFSET = 12;

const inp =
  'w-full h-7 px-2 rounded border border-slate-200 bg-slate-50 text-[11px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#00B8C6] focus:bg-white transition-colors';

const lbl = 'block text-[9px] font-bold uppercase tracking-wide text-slate-400 mb-0.5';

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
    return () => { document.body.style.overflow = original; };
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
        ? (initialData.galleryImages as GalleryImage[]).map((img) => ({
            imageUrl: img.imageUrl ?? '',
            altText: img.altText ?? '',
          }))
        : [],
    });
  }, [initialData]);

  const generateSlug = (title: string) =>
    title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

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
      {/* Full-area tinted backdrop */}
      <div
        className="fixed z-[59] bg-[#00B8C6]/10 backdrop-blur-[2px]"
        style={{ left: `${SIDEBAR_WIDTH}px`, top: `${TOP_OFFSET}px`, right: `${RIGHT_OFFSET}px`, bottom: `${BOTTOM_OFFSET}px`, borderRadius: '10px' }}
        onClick={onCancel}
      />

      {/* Page-size card */}
      <div
        className="fixed z-[60] flex flex-col bg-white border border-slate-200 shadow-2xl rounded-[10px] overflow-hidden"
        style={{ left: `${SIDEBAR_WIDTH}px`, top: `${TOP_OFFSET}px`, right: `${RIGHT_OFFSET}px`, bottom: `${BOTTOM_OFFSET}px` }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-white flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="w-1 h-5 rounded-full bg-[#00B8C6]" />
            <h2 className="text-sm font-bold text-slate-900">
              {initialData ? 'Edit Gallery Event' : 'New Gallery Event'}
            </h2>
            <span className="text-[11px] text-slate-400">Manage event details and gallery images.</span>
          </div>
          <button onClick={onCancel} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form
          id="gallery-form"
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4"
        >
          {/* Event meta */}
          <div className="grid grid-cols-[1fr_200px] gap-4 items-start">
            {/* Left fields */}
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={lbl}>Title *</label>
                  <input
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, title: e.target.value, slug: generateSlug(e.target.value) }))
                    }
                    placeholder="Event title…"
                    className={inp}
                  />
                </div>
                <div>
                  <label className={lbl}>Slug *</label>
                  <input
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData((p) => ({ ...p, slug: e.target.value }))}
                    className={`${inp} font-mono`}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={lbl}>Location</label>
                  <input
                    value={formData.location}
                    onChange={(e) => setFormData((p) => ({ ...p, location: e.target.value }))}
                    placeholder="City, Venue…"
                    className={inp}
                  />
                </div>
                <div>
                  <label className={lbl}>Event Date</label>
                  <input
                    type="date"
                    value={formData.eventDate}
                    onChange={(e) => setFormData((p) => ({ ...p, eventDate: e.target.value }))}
                    className={inp}
                  />
                </div>
              </div>
              <div>
                <label className={lbl}>Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Brief event description…"
                  className="w-full px-2 py-1.5 rounded border border-slate-200 bg-slate-50 text-[11px] text-slate-900 resize-none focus:outline-none focus:border-[#00B8C6] focus:bg-white transition-colors"
                />
              </div>
            </div>

            {/* Right: Cover Image */}
            <div>
              <label className={lbl}>Cover Image</label>
              <div className="h-[140px] rounded border border-slate-200 overflow-hidden">
                <ImageUpload
                  compact
                  value={formData.coverImage}
                  onChange={(url) => setFormData((p) => ({ ...p, coverImage: url }))}
                />
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-slate-100" />

          {/* Gallery Images */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Gallery Images
                <span className="ml-1 text-slate-300">({formData.galleryImages.length})</span>
              </h3>
              <button
                type="button"
                onClick={() =>
                  setFormData((p) => ({
                    ...p,
                    galleryImages: [...p.galleryImages, { imageUrl: '', altText: '' }],
                  }))
                }
                className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold rounded-lg bg-cyan-50 text-cyan-700 border border-cyan-200 hover:bg-cyan-100 transition-colors"
              >
                <Plus className="w-3 h-3" /> Add Image
              </button>
            </div>

            {formData.galleryImages.length === 0 && (
              <p className="text-[11px] text-slate-400 py-4 text-center border border-dashed border-slate-200 rounded-lg">
                No images yet — click "Add Image" to upload.
              </p>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {formData.galleryImages.map((item, index) => (
                <div
                  key={index}
                  className="border border-slate-200 rounded-lg p-2 bg-slate-50 flex flex-col gap-1.5"
                >
                  <div className="h-[100px] rounded border border-slate-200 overflow-hidden bg-white">
                    <ImageUpload
                      compact
                      value={item.imageUrl}
                      onChange={(url) =>
                        setFormData((p) => ({
                          ...p,
                          galleryImages: p.galleryImages.map((img, i) =>
                            i === index ? { ...img, imageUrl: url } : img
                          ),
                        }))
                      }
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <input
                      value={item.altText}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          galleryImages: p.galleryImages.map((img, i) =>
                            i === index ? { ...img, altText: e.target.value } : img
                          ),
                        }))
                      }
                      placeholder="Alt text…"
                      className="flex-1 h-6 px-1.5 rounded border border-slate-200 bg-white text-[10px] text-slate-800 focus:outline-none focus:border-[#00B8C6] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((p) => ({
                          ...p,
                          galleryImages: p.galleryImages.filter((_, i) => i !== index),
                        }))
                      }
                      className="p-0.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50 flex-shrink-0">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-1.5 rounded-lg text-[11px] font-medium text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            form="gallery-form"
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#00B8C6] text-white text-[11px] font-semibold hover:bg-[#00a3b0] transition-colors disabled:opacity-50 shadow-sm"
          >
            {loading ? (
              <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-3 h-3" />
            )}
            {initialData ? 'Update Event' : 'Create Event'}
          </button>
        </div>
      </div>
    </>,
    document.body
  );
}