'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Save, X } from 'lucide-react';
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

export default function TestimonialForm({ initialData, onSave, onCancel, loading }: Props) {
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    type: 'text',
    name: '',
    role: '',
    company: '',
    title: '',
    description: '',
    videoUrl: '',
    thumbnailUrl: '',
    isActive: true,
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
      type: initialData.type ?? 'text',
      name: initialData.name ?? '',
      role: initialData.role ?? '',
      company: initialData.company ?? '',
      title: initialData.title ?? '',
      description: initialData.description ?? '',
      videoUrl: initialData.videoUrl ?? '',
      thumbnailUrl: initialData.thumbnailUrl ?? '',
      isActive: initialData.isActive ?? true,
    });
  }, [initialData]);

  const isVideo = formData.type === 'video';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isVideo) {
      const videoUrl = formData.videoUrl.trim();
      if (!videoUrl) return;
      onSave({
        type: 'video',
        videoUrl,
        thumbnailUrl: formData.thumbnailUrl.trim() || null,
        name: formData.name.trim() || 'Video',
        role: null,
        company: null,
        title: null,
        description: null,
        isActive: formData.isActive,
      });
      return;
    }

    const name = formData.name.trim();
    if (!name) return;

    onSave({
      type: 'text',
      name,
      role: formData.role.trim() || null,
      company: formData.company.trim() || null,
      title: formData.title.trim() || null,
      description: formData.description.trim() || null,
      thumbnailUrl: formData.thumbnailUrl.trim() || null,
      videoUrl: null,
      isActive: formData.isActive,
    });
  };

  if (!mounted) return null;

  return createPortal(
    <>
      <div
        className="fixed z-[59] bg-[#00B8C644] rounded-xl"
        style={{ left: `${SIDEBAR_WIDTH + 12}px`, top: '12px', right: '12px', bottom: '12px' }}
        onClick={onCancel}
      />
      <div className="fixed inset-y-0 right-0 z-[60] flex items-center justify-center p-2" style={{ left: `${SIDEBAR_WIDTH}px`, pointerEvents: 'none' }}>
        <div style={{ pointerEvents: 'auto' }} className="w-full max-w-[700px]">
          <div className="w-full max-h-[80vh] bg-white rounded-md border border-slate-200 shadow-sm flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100 flex-shrink-0">
              <h2 className="text-[18px] font-semibold text-slate-900">{initialData ? 'Edit Testimonial' : 'New Testimonial'}</h2>
              <button type="button" onClick={onCancel} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form id="testimonial-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-700 mb-1">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData((p) => ({ ...p, type: e.target.value }))}
                  className={inputClass}
                >
                  <option value="text">Text</option>
                  <option value="video">Video</option>
                </select>
              </div>

              {isVideo ? (
                <>
                  <p className="text-[11px] text-slate-500">Video entries use the video URL and poster thumbnail.</p>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-700 mb-1">Video URL *</label>
                    <input
                      required={isVideo}
                      value={formData.videoUrl}
                      onChange={(e) => setFormData((p) => ({ ...p, videoUrl: e.target.value }))}
                      className={inputClass}
                      placeholder="https://..."
                    />
                  </div>
                  <ImageUpload label="Thumbnail / poster" compact value={formData.thumbnailUrl} onChange={(url) => setFormData((p) => ({ ...p, thumbnailUrl: url }))} />
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-700 mb-1">Internal label (optional)</label>
                    <input
                      value={formData.name}
                      onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                      className={inputClass}
                      placeholder='Defaults to "Video" if empty'
                    />
                  </div>
                </>
              ) : (
                <>
                  <p className="text-[11px] text-slate-500">Text entries use person details and quote copy. Avatar uses thumbnail.</p>
                  <div className="grid grid-cols-[120px_1fr] gap-3 items-start">
                    <ImageUpload label="Avatar" compact value={formData.thumbnailUrl} onChange={(url) => setFormData((p) => ({ ...p, thumbnailUrl: url }))} />
                    <div className="space-y-2">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-700 mb-1">Name *</label>
                        <input required={!isVideo} value={formData.name} onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))} className={inputClass} />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-700 mb-1">Role</label>
                          <input value={formData.role} onChange={(e) => setFormData((p) => ({ ...p, role: e.target.value }))} className={inputClass} />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-700 mb-1">Company</label>
                          <input value={formData.company} onChange={(e) => setFormData((p) => ({ ...p, company: e.target.value }))} className={inputClass} />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-700 mb-1">Title</label>
                        <input value={formData.title} onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))} className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-700 mb-1">Description</label>
                        <textarea
                          rows={4}
                          value={formData.description}
                          onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                          className="w-full px-3 py-2 rounded-md border border-slate-300 bg-white text-[13px] text-slate-900 focus:outline-none focus:border-[#00B8C6]"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData((p) => ({ ...p, isActive: e.target.checked }))} />
                <span className="text-xs text-slate-700">Active (visible on site)</span>
              </label>
            </form>

            <div className="px-4 py-2 border-t border-slate-100 flex items-center justify-end gap-2 bg-white flex-shrink-0">
              <button type="button" onClick={onCancel} className="px-3 py-1.5 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-100 transition">
                Cancel
              </button>
              <button
                form="testimonial-form"
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 transition disabled:opacity-50"
              >
                <Save className="w-3 h-3" />
                {initialData ? 'Update Testimonial' : 'Create Testimonial'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
