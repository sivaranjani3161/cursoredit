'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Save, X, MessageSquare } from 'lucide-react';
import ImageUpload from '@/shared/components/ImageUpload';
import type { ApiTestimonial, TestimonialFormData } from '@/shared/types';
import { z } from 'zod';
import { useError } from '@/shared/context/ErrorContext';

const testimonialSchema = z.object({
  type: z.enum(['text', 'video']),
  name: z.string().min(1, 'Name is required'),
  role: z.string().nullable(),
  company: z.string().nullable(),
  title: z.string().nullable(),
  description: z.string().nullable(),
  thumbnailUrl: z.string().nullable(),
  videoUrl: z.string().nullable(),
  isActive: z.boolean(),
});

interface Props {
  initialData?: ApiTestimonial;
  onSave: (data: TestimonialFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

const SIDEBAR_WIDTH = 262;
const TOP_OFFSET    = 12;
const RIGHT_OFFSET  = 12;
const BOTTOM_OFFSET = 12;

const inp = 'w-full h-7 px-2 rounded border border-slate-200 bg-slate-50 text-[11px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#00B8C6] focus:bg-white transition-colors';
const lbl = 'block text-[9px] font-bold uppercase tracking-wide text-slate-400 mb-0.5';

export default function TestimonialForm({ initialData, onSave, onCancel, loading }: Props) {
  const { setError } = useError();
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    type: 'text', name: '', role: '', company: '',
    title: '', description: '', videoUrl: '', thumbnailUrl: '', isActive: true,
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
      type:         initialData.type         ?? 'text',
      name:         initialData.name         ?? '',
      role:         initialData.role         ?? '',
      company:      initialData.company      ?? '',
      title:        initialData.title        ?? '',
      description:  initialData.description  ?? '',
      videoUrl:     initialData.videoUrl     ?? '',
      thumbnailUrl: initialData.thumbnailUrl ?? '',
      isActive:     initialData.isActive     ?? true,
    });
  }, [initialData]);

  const isVideo = formData.type === 'video';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isVideo = formData.type === 'video';
    
    let payload: Record<string, any>;

    if (isVideo) {
      payload = {
        type: 'video',
        videoUrl: formData.videoUrl.trim() || null,
        thumbnailUrl: formData.thumbnailUrl.trim() || null,
        name: formData.name.trim() || 'Video',
        role: null, company: null, title: null, description: null,
        isActive: formData.isActive,
      };
    } else {
      payload = {
        type: 'text',
        name: formData.name.trim(),
        role: formData.role.trim() || null,
        company: formData.company.trim() || null,
        title: formData.title.trim() || null,
        description: formData.description.trim() || null,
        thumbnailUrl: formData.thumbnailUrl.trim() || null,
        videoUrl: null,
        isActive: formData.isActive,
      };
    }

    const parsed = testimonialSchema.safeParse(payload);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || 'Validation failed');
      return;
    }

    if (isVideo && !parsed.data.videoUrl) {
      setError('Video URL is required for video testimonials');
      return;
    }

    onSave(parsed.data as TestimonialFormData);
  };

  if (!mounted) return null;

  return createPortal(
    <>
      {/* ── Backdrop ── */}
     // Replace ONLY the panel div className and backdrop section:

{/* Backdrop — tablet only */}
<div className="fixed inset-0 z-[59] bg-black/30 backdrop-blur-sm hidden md:block lg:hidden" onClick={onCancel} />
{/* Backdrop — desktop only */}
<div
  className="fixed z-[59] bg-black/20 backdrop-blur-[1px] hidden lg:block"
  style={{ left: SIDEBAR_WIDTH, top: TOP_OFFSET, right: RIGHT_OFFSET, bottom: BOTTOM_OFFSET, borderRadius: 10 }}
  onClick={onCancel}
/>

<div
  className="
    fixed z-[60] flex flex-col bg-white overflow-hidden

    inset-0

    md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2
    md:w-[620px] md:max-h-[88dvh] md:rounded-2xl md:border md:border-slate-200 md:shadow-2xl

    lg:translate-x-0 lg:translate-y-0 lg:rounded-[10px] lg:border lg:border-slate-200 lg:shadow-2xl
  "
  ref={(el) => {
    if (!el) return;
    if (window.innerWidth >= 1024) {
      el.style.left = `${SIDEBAR_WIDTH}px`; el.style.top = `${TOP_OFFSET}px`;
      el.style.right = `${RIGHT_OFFSET}px`; el.style.bottom = `${BOTTOM_OFFSET}px`;
      el.style.width = 'auto'; el.style.maxHeight = 'none'; el.style.transform = 'none';
    }
  }}
>
  {/* rest unchanged — header h-12, footer h-14 */}
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-4 h-10 border-b border-slate-100 bg-white flex-shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-[3px] h-3.5 rounded-full bg-[#00B8C6] flex-shrink-0" />
            <MessageSquare className="w-3.5 h-3.5 text-[#00B8C6] flex-shrink-0" />
            <h2 className="text-[12.5px] font-bold text-slate-800 flex-shrink-0">
              {initialData ? 'Edit Testimonial' : 'New Testimonial'}
            </h2>
            <span className="text-[10.5px] text-slate-400 font-normal hidden sm:block">
              {isVideo ? 'Video testimonial' : 'Text quote'}
            </span>
          </div>
          <button type="button" onClick={onCancel} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors flex-shrink-0">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* ── Form ── */}
        <form id="testimonial-form" onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">

          {/* Controls strip */}
          <div className="flex-shrink-0 flex items-center gap-3 sm:gap-4 px-4 py-2.5 border-b border-slate-100 bg-slate-50/40 flex-wrap">
            <div className="w-28">
              <label className={lbl}>Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData((p) => ({ ...p, type: e.target.value }))}
                className={inp}
              >
                <option value="text">Text</option>
                <option value="video">Video</option>
              </select>
            </div>
            <div className="w-px h-7 bg-slate-200 mt-3.5 hidden sm:block" />
            <div className="mt-0 sm:mt-3.5 flex items-center gap-2">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData((p) => ({ ...p, isActive: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-7 h-3.5 bg-slate-200 rounded-full peer-checked:bg-[#00B8C6] transition-all after:content-[''] after:absolute after:left-[2px] after:top-[1px] after:w-2.5 after:h-2.5 after:bg-white after:rounded-full after:transition-all peer-checked:after:translate-x-3.5" />
              </label>
              <span className="text-[11px] text-slate-600 font-medium">Active</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${formData.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                {formData.isActive ? 'Live' : 'Draft'}
              </span>
            </div>
          </div>

          {/* ── Main fields ── */}
          <div className="flex-1 flex flex-col min-h-0 px-4 py-3 overflow-y-auto">
            {isVideo ? (
              <div className="flex flex-col gap-3">
                {/* Video fields — stacked on mobile, side by side on sm+ */}
                <div className="flex flex-col sm:grid sm:grid-cols-[120px_1fr] gap-3 items-start">
                  <div className="w-full sm:w-auto">
                    <label className={lbl}>Thumbnail</label>
                    <div className="h-[90px] rounded border border-slate-200 overflow-hidden bg-slate-50">
                      <ImageUpload compact value={formData.thumbnailUrl} onChange={(url) => setFormData((p) => ({ ...p, thumbnailUrl: url }))} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 flex-1">
                    <div>
                      <label className={lbl}>Video URL <span className="text-rose-400">*</span></label>
                      <input
                        required={isVideo}
                        value={formData.videoUrl}
                        onChange={(e) => setFormData((p) => ({ ...p, videoUrl: e.target.value }))}
                        className={inp}
                        placeholder="https://youtube.com/watch?v=…"
                      />
                    </div>
                    <div>
                      <label className={lbl}>Internal Label</label>
                      <input
                        value={formData.name}
                        onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                        className={inp}
                        placeholder='e.g. "Customer Story"'
                      />
                    </div>
                  </div>
                </div>

                {/* Video preview */}
                <div className="h-[180px] sm:h-[220px] rounded-lg border border-dashed border-slate-200 bg-slate-50/60 flex flex-col items-center justify-center gap-2 overflow-hidden">
                  {formData.videoUrl ? (
                    <iframe
                      src={(() => {
                        try {
                          const url = new URL(formData.videoUrl);
                          const id = url.searchParams.get('v') || url.pathname.split('/').pop();
                          return `https://www.youtube.com/embed/${id}`;
                        } catch { return ''; }
                      })()}
                      className="w-full h-full rounded-lg"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-full bg-slate-200/80 flex items-center justify-center">
                        <svg className="w-5 h-5 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                      <p className="text-[11px] font-medium text-slate-400">Video preview will appear here</p>
                      <p className="text-[10px] text-slate-300">Paste a YouTube URL above</p>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {/* Row 1: Avatar + fields — 2-col on mobile, 4-col on sm+ */}
                <div className="flex flex-col sm:grid sm:grid-cols-[72px_1fr_1fr_1fr] gap-2 sm:gap-2.5 items-start sm:items-end">
                  <div className="w-[72px]">
                    <label className={lbl}>Avatar</label>
                    <div className="h-[72px] rounded border border-slate-200 overflow-hidden bg-slate-50">
                      <ImageUpload compact value={formData.thumbnailUrl} onChange={(url) => setFormData((p) => ({ ...p, thumbnailUrl: url }))} />
                    </div>
                  </div>
                  <div>
                    <label className={lbl}>Name <span className="text-rose-400">*</span></label>
                    <input
                      required={!isVideo}
                      value={formData.name}
                      onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                      className={inp}
                      placeholder="Full name"
                    />
                  </div>
                  <div>
                    <label className={lbl}>Role</label>
                    <input
                      value={formData.role}
                      onChange={(e) => setFormData((p) => ({ ...p, role: e.target.value }))}
                      className={inp}
                      placeholder="e.g. CEO"
                    />
                  </div>
                  <div>
                    <label className={lbl}>Company</label>
                    <input
                      value={formData.company}
                      onChange={(e) => setFormData((p) => ({ ...p, company: e.target.value }))}
                      className={inp}
                      placeholder="e.g. Acme Inc."
                    />
                  </div>
                </div>

                <div className="h-px bg-slate-100" />

                <div>
                  <label className={lbl}>Quote Title</label>
                  <input
                    value={formData.title}
                    onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                    className={inp}
                    placeholder="Short headline for the quote"
                  />
                </div>

                <div className="flex flex-col flex-1">
                  <label className={lbl}>Testimonial Text</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                    placeholder="The full testimonial text…"
                    rows={5}
                    className="w-full px-2 py-1.5 rounded border border-slate-200 bg-slate-50 text-[11px] text-slate-900 placeholder:text-slate-400 resize-none focus:outline-none focus:border-[#00B8C6] focus:bg-white transition-colors leading-relaxed"
                  />
                </div>
              </div>
            )}
          </div>
        </form>

        {/* ── Footer ── */}
        <div className="flex-shrink-0 px-4 h-11 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50/60">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 rounded-lg text-[11px] font-medium text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            form="testimonial-form"
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#00B8C6] text-white text-[11px] font-semibold hover:bg-[#00a3b0] transition-colors disabled:opacity-50 shadow-sm"
          >
            {loading
              ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <Save className="w-3 h-3" />
            }
            {initialData ? 'Update Testimonial' : 'Create Testimonial'}
          </button>
        </div>
      </div>
    </>,
    document.body
  );
}