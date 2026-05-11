'use client';

import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Save, X } from 'lucide-react';
import ImageUpload from '../common/ImageUpload';

type GalleryType = 'internal' | 'external';

interface Props {
  type: GalleryType;
  initialData?: any;
  onSave: (data: any, type: GalleryType) => void;
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

export default function UnifiedGalleryForm({ type: initialType, initialData, onSave, onCancel, loading }: Props) {
  const [mounted, setMounted] = useState(false);
  // Type is controlled inside the form (like Testimonial)
  const [galleryType, setGalleryType] = useState<GalleryType>(initialType);

  // External (events)
  const [event, setEvent] = useState({
    title: '',
    slug: '',
    location: '',
    coverImage: '',
    description: '',
    eventDate: '',
    galleryImages: [] as Array<{ imageUrl: string; altText: string }>,
  });

  // Internal (FC images / awesome clicks)
  const [internal, setInternal] = useState({
    imageUrl: '',
    altText: '',
  });

  const isExternal = galleryType === 'external';


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
    if (initialType === 'external') {
      setEvent({
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
    } else {
      setInternal({
        imageUrl: initialData.imageUrl ?? '',
        altText: initialData.altText ?? '',
      });
    }
  }, [initialData, initialType]);


  const generateSlug = (title: string) =>
    title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const titleText = initialData
    ? (isExternal ? 'Edit Event' : 'Edit Internal Image')
    : (isExternal ? 'New Gallery Event' : 'New Internal Image');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isExternal) {
      onSave(
        {
          ...event,
          location: event.location || null,
          coverImage: event.coverImage || null,
          description: event.description || null,
          eventDate: event.eventDate || null,
          galleryImages: event.galleryImages.filter((i) => i.imageUrl.trim().length > 0),
        },
        'external'
      );
    } else {
      onSave(
        {
          imageUrl: internal.imageUrl.trim(),
          altText: internal.altText.trim() || null,
        },
        'internal'
      );
    }
  };


  if (!mounted) return null;

  return createPortal(
    <>
      <div
        className="fixed z-[59] bg-[#00B8C6]/10 backdrop-blur-[2px]"
        style={{ left: `${SIDEBAR_WIDTH}px`, top: `${TOP_OFFSET}px`, right: `${RIGHT_OFFSET}px`, bottom: `${BOTTOM_OFFSET}px`, borderRadius: '10px' }}
        onClick={onCancel}
      />

      <div
        className="fixed z-[60] flex flex-col bg-white border border-slate-200 shadow-2xl rounded-[10px] overflow-hidden"
        style={{ left: `${SIDEBAR_WIDTH}px`, top: `${TOP_OFFSET}px`, right: `${RIGHT_OFFSET}px`, bottom: `${BOTTOM_OFFSET}px` }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-white flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="w-1 h-5 rounded-full bg-[#00B8C6]" />
            <h2 className="text-sm font-bold text-slate-900">{titleText}</h2>
            <span className="text-[11px] text-slate-400">
              {isExternal ? 'Manage event details and gallery images.' : 'Add an internal FC image.'}
            </span>
          </div>
          <button onClick={onCancel} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Type + Active strip — like Testimonial */}
        <div className="flex-shrink-0 flex items-center gap-4 px-5 py-2.5 border-b border-slate-100 bg-slate-50/40">
          <div className="w-36">
            <label className={lbl}>Gallery Type</label>
            <select
              value={galleryType}
              onChange={(e) => setGalleryType(e.target.value as GalleryType)}
              disabled={Boolean(initialData)}
              className={inp}
            >
              <option value="external">External (Event)</option>
              <option value="internal">Internal (FC Image)</option>
            </select>
          </div>
          <div className="w-px h-7 bg-slate-200 mt-3.5" />
          <div className="mt-3.5">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
              isExternal
                ? 'bg-cyan-50 text-cyan-700 border-cyan-100'
                : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}>
              {isExternal ? 'External Event' : 'Internal Image'}
            </span>
          </div>
        </div>

        <form id="unified-gallery-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {isExternal ? (
                <>
                  <div className="grid grid-cols-[1fr_220px] gap-4 items-start">
                    <div className="flex flex-col gap-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={lbl}>Title *</label>
                          <input
                            required
                            value={event.title}
                            onChange={(e) =>
                              setEvent((p) => ({ ...p, title: e.target.value, slug: generateSlug(e.target.value) }))
                            }
                            className={inp}
                          />
                        </div>
                        <div>
                          <label className={lbl}>Slug *</label>
                          <input
                            required
                            value={event.slug}
                            onChange={(e) => setEvent((p) => ({ ...p, slug: e.target.value }))}
                            className={`${inp} font-mono`}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={lbl}>Location</label>
                          <input value={event.location} onChange={(e) => setEvent((p) => ({ ...p, location: e.target.value }))} className={inp} />
                        </div>
                        <div>
                          <label className={lbl}>Event Date</label>
                          <input type="date" value={event.eventDate} onChange={(e) => setEvent((p) => ({ ...p, eventDate: e.target.value }))} className={inp} />
                        </div>
                      </div>

                      <div>
                        <label className={lbl}>Description</label>
                        <textarea
                          rows={3}
                          value={event.description}
                          onChange={(e) => setEvent((p) => ({ ...p, description: e.target.value }))}
                          className="w-full px-2 py-1.5 rounded border border-slate-200 bg-slate-50 text-[11px] text-slate-900 resize-none focus:outline-none focus:border-[#00B8C6] focus:bg-white transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className={lbl}>Cover Image</label>
                      <div className="h-[128px] rounded border border-slate-200 overflow-hidden">
                        <ImageUpload compact value={event.coverImage} onChange={(url) => setEvent((p) => ({ ...p, coverImage: url }))} />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1.5">
                    <span className={lbl} style={{ marginBottom: 0 }}>Images</span>
                    <button
                      type="button"
                      onClick={() => setEvent((p) => ({ ...p, galleryImages: [...p.galleryImages, { imageUrl: '', altText: '' }] }))}
                      className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded bg-cyan-50 text-cyan-700 hover:bg-cyan-100 transition-colors"
                    >
                      + Add Image
                    </button>
                  </div>

                  <div className="space-y-2">
                    {event.galleryImages.map((img, i) => (
                      <div key={i} className="grid grid-cols-[160px_1fr_32px] gap-3 items-end border border-slate-200 rounded p-2 bg-slate-50">
                        <div className="h-[80px] rounded border border-slate-200 overflow-hidden bg-white">
                          <ImageUpload
                            compact
                            value={img.imageUrl}
                            onChange={(url) =>
                              setEvent((p) => ({
                                ...p,
                                galleryImages: p.galleryImages.map((x, idx) => (idx === i ? { ...x, imageUrl: url } : x)),
                              }))
                            }
                          />
                        </div>
                        <div>
                          <label className={lbl}>Alt Text</label>
                          <input
                            value={img.altText}
                            onChange={(e) =>
                              setEvent((p) => ({
                                ...p,
                                galleryImages: p.galleryImages.map((x, idx) => (idx === i ? { ...x, altText: e.target.value } : x)),
                              }))
                            }
                            className={inp}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => setEvent((p) => ({ ...p, galleryImages: p.galleryImages.filter((_, idx) => idx !== i) }))}
                          className="p-1 rounded text-rose-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                          title="Remove"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <div>
                    <label className={lbl}>Image *</label>
                    <div className="h-[140px] rounded border border-slate-200 overflow-hidden">
                      <ImageUpload compact value={internal.imageUrl} onChange={(url) => setInternal((p) => ({ ...p, imageUrl: url }))} />
                    </div>
                  </div>
                  <div>
                    <label className={lbl}>Alt text</label>
                    <input value={internal.altText} onChange={(e) => setInternal((p) => ({ ...p, altText: e.target.value }))} className={inp} placeholder="Optional" />
                  </div>
                </div>
              )}
        </form>

        <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50 flex-shrink-0">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-1.5 rounded-lg text-[11px] font-medium text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            form="unified-gallery-form"
            type="submit"
            disabled={loading || (!isExternal && !internal.imageUrl.trim())}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#00B8C6] text-white text-[11px] font-semibold hover:bg-[#00a3b0] transition-colors disabled:opacity-50 shadow-sm"
          >
            <Save className="w-3 h-3" />
            Save
          </button>
        </div>
      </div>
    </>,
    document.body
  );
}

