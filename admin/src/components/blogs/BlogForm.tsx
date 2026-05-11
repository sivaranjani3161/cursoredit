'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Save, X, Info, FileText } from 'lucide-react';
import MDEditor from '@uiw/react-md-editor';
import ImageUpload from '../common/ImageUpload';

interface BlogFormProps {
  initialData?: any;
  existingBlogs: any[];
  onSave: (value: any) => void;
  onCancel: () => void;
  loading?: boolean;
}

const inp = 'w-full h-7 px-2 rounded border border-slate-200 bg-slate-50 text-[11px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#00B8C6] focus:bg-white transition-colors';
const lbl = 'block text-[9px] font-bold uppercase tracking-wide text-slate-400 mb-0.5';

const SIDEBAR_WIDTH = 262;
const TOP_OFFSET = 12;
const RIGHT_OFFSET = 12;
const BOTTOM_OFFSET = 12;

export default function BlogForm({ initialData, existingBlogs, onSave, onCancel, loading }: BlogFormProps) {
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImage: '',
    status: 'DRAFT',
    publishedAt: '',
    tagsInput: '',
    relatedBlogIds: [] as number[],
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
      excerpt: initialData.excerpt ?? '',
      content: initialData.content ?? '',
      coverImage: initialData.coverImage ?? '',
      status: initialData.status ?? 'DRAFT',
      publishedAt: initialData.publishedAt ? String(initialData.publishedAt).slice(0, 10) : '',
      tagsInput: Array.isArray(initialData.tags) ? initialData.tags.join(', ') : '',
      relatedBlogIds: Array.isArray(initialData.relatedBlogIds) ? initialData.relatedBlogIds : [],
    });
  }, [initialData]);

  const relatedCandidates = existingBlogs.filter((b) => b.id !== initialData?.id);

  const generateSlug = (title: string) =>
    title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tags = formData.tagsInput.split(',').map((t) => t.trim()).filter(Boolean);
    onSave({
      title: formData.title,
      slug: formData.slug,
      excerpt: formData.excerpt || null,
      content: formData.content.trim(),
      coverImage: formData.coverImage || null,
      status: formData.status,
      publishedAt: formData.publishedAt || null,
      tags,
      relatedBlogIds: formData.relatedBlogIds,
    });
  };

  if (!mounted) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed z-[59] bg-black/20 backdrop-blur-[1px]"
        style={{ left: SIDEBAR_WIDTH, top: TOP_OFFSET, right: RIGHT_OFFSET, bottom: BOTTOM_OFFSET, borderRadius: 10 }}
        onClick={onCancel}
      />

      {/* Panel */}
      <div
        className="fixed z-[60] flex flex-col bg-white border border-slate-200 shadow-2xl overflow-hidden"
        style={{ left: SIDEBAR_WIDTH, top: TOP_OFFSET, right: RIGHT_OFFSET, bottom: BOTTOM_OFFSET, borderRadius: 10 }}
      >

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-4 h-10 border-b border-slate-100 bg-white flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-[3px] h-3.5 rounded-full bg-[#00B8C6]" />
            <FileText className="w-3.5 h-3.5 text-[#00B8C6]" />
            <h2 className="text-[12.5px] font-bold text-slate-800">
              {initialData ? 'Edit Blog' : 'New Blog'}
            </h2>
            <span className="text-[10.5px] text-slate-400 font-normal">Metadata · Content · Tags</span>
          </div>
          <button onClick={onCancel} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* ── Form ── */}
        <form id="blog-form" onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">

          {/* ────────────────────────────────────────────────
              META STRIP — flex-shrink-0, NEVER grows
              Structure: [3-col grid | cover image 130px]
              Row 1: Title(×2)   | Status    | [image]
              Row 2: Slug(×2)    | Tags      | [image]
              Row 3: Excerpt(×2) | Related   | [image]
          ──────────────────────────────────────────────── */}
          <div className="flex-shrink-0 border-b border-slate-100 bg-slate-50/40 px-4 py-2.5">
            <div className="flex gap-3 items-start">

              {/* Left 3-col grid */}
              <div className="flex-1 grid grid-cols-3 gap-x-2.5 gap-y-2 min-w-0">

                {/* Row 1 */}
                <div className="col-span-2">
                  <label className={lbl}>Title <span className="text-rose-400">*</span></label>
                  <input
                    required
                    value={formData.title}
                    onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value, slug: generateSlug(e.target.value) }))}
                    placeholder="Enter blog title…"
                    className={inp}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className={lbl}>Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData((p) => ({ ...p, status: e.target.value }))}
                      className={inp}
                    >
                      <option value="DRAFT">Draft</option>
                      <option value="PUBLISHED">Published</option>
                      <option value="ARCHIVED">Archived</option>
                    </select>
                  </div>
                  <div>
                    <label className={lbl}>Published Date</label>
                    <input
                      type="date"
                      value={formData.publishedAt}
                      onChange={(e) => setFormData((p) => ({ ...p, publishedAt: e.target.value }))}
                      className={inp}
                    />
                  </div>
                </div>

                {/* Row 2 */}
                <div className="col-span-2">
                  <label className={lbl}>Slug <span className="text-rose-400">*</span></label>
                  <div className="relative">
                    <input
                      required
                      value={formData.slug}
                      onChange={(e) => setFormData((p) => ({ ...p, slug: e.target.value }))}
                      className={`${inp} pr-6 font-mono`}
                      placeholder="auto-generated-from-title"
                    />
                    <Info className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-300" />
                  </div>
                </div>
                <div>
                  <label className={lbl}>Tags <span className="text-slate-300 font-normal normal-case">(comma)</span></label>
                  <input
                    value={formData.tagsInput}
                    onChange={(e) => setFormData((p) => ({ ...p, tagsInput: e.target.value }))}
                    placeholder="design, web…"
                    className={inp}
                  />
                </div>

                {/* Row 3 */}
                <div className="col-span-2">
                  <label className={lbl}>Excerpt</label>
                  <textarea
                    value={formData.excerpt}
                    rows={2}
                    onChange={(e) => setFormData((p) => ({ ...p, excerpt: e.target.value }))}
                    placeholder="Short summary for listings and SEO…"
                    className="w-full px-2 py-1.5 rounded border border-slate-200 bg-slate-50 text-[11px] text-slate-900 placeholder:text-slate-400 resize-none focus:outline-none focus:border-[#00B8C6] focus:bg-white transition-colors leading-relaxed"
                  />
                </div>
                <div>
                  <label className={lbl}>Related Blogs</label>
                  {relatedCandidates.length === 0 ? (
                    <div className="h-[46px] flex items-center px-2 rounded border border-dashed border-slate-200 text-[10px] text-slate-400 italic">
                      No other blogs
                    </div>
                  ) : (
                    <div className="h-[46px] overflow-y-auto rounded border border-slate-200 bg-slate-50 px-2 py-1 space-y-0.5">
                      {relatedCandidates.map((item) => (
                        <label key={item.id} className="flex items-center gap-1.5 text-[10px] text-slate-700 cursor-pointer hover:text-slate-900">
                          <input
                            type="checkbox"
                            checked={formData.relatedBlogIds.includes(item.id)}
                            onChange={(e) => setFormData((p) => ({
                              ...p,
                              relatedBlogIds: e.target.checked
                                ? [...p.relatedBlogIds, item.id]
                                : p.relatedBlogIds.filter((id) => id !== item.id),
                            }))}
                            className="accent-[#00B8C6] flex-shrink-0"
                          />
                          <span className="truncate">{item.title}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

              </div>

              {/* Cover image — fixed width, spans full 3-row height */}
              <div className="flex-shrink-0 w-[130px]">
                <label className={lbl}>Cover Image</label>
                {/* 3 rows × ~28px each + 2 gaps × 8px = ~100px, close enough */}
                <div className="h-[112px] rounded border border-slate-200 overflow-hidden bg-slate-50">
                  <ImageUpload compact value={formData.coverImage} onChange={(url) => setFormData((p) => ({ ...p, coverImage: url }))} />
                </div>
              </div>

            </div>
          </div>

          {/* ── Content editor — takes ALL remaining vertical space ── */}
          <div className="flex-1 flex flex-col min-h-0 px-4 py-2.5">
            <label className={lbl}>Content <span className="text-rose-400">*</span></label>
            <div data-color-mode="light" className="flex-1 min-h-0 rounded border border-slate-200 overflow-hidden">
              <MDEditor
                value={formData.content}
                onChange={(value) => setFormData((p) => ({ ...p, content: value || '' }))}
                height="100%"
                visibleDragbar={false}
                textareaProps={{ placeholder: 'Write blog content here…' }}
                style={{ height: '100%', minHeight: 0 }}
              />
            </div>
          </div>

        </form>

        {/* ── Footer ── */}
        <div className="flex-shrink-0 px-4 h-10 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50/60">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 rounded-lg text-[11px] font-medium text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            form="blog-form"
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#00B8C6] text-white text-[11px] font-semibold hover:bg-[#00a3b0] transition-colors disabled:opacity-50 shadow-sm"
          >
            {loading ? (
              <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-3 h-3" />
            )}
            {initialData ? 'Update Blog' : 'Create Blog'}
          </button>
        </div>

      </div>
    </>,
    document.body
  );
}