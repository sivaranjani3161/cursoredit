'use client';

import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Info, Save, X } from 'lucide-react';
import ImageUpload from '../common/ImageUpload';

interface BlogFormProps {
  initialData?: any;
  existingBlogs: any[];
  onSave: (value: any) => void;
  onCancel: () => void;
  loading?: boolean;
}

const inputClass =
  'w-full h-9 px-3 rounded-md border border-slate-300 bg-white text-[13px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#00B8C6]';

const SIDEBAR_WIDTH = 252;

export default function BlogForm({ initialData, existingBlogs, onSave, onCancel, loading }: BlogFormProps) {
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImage: '',
    publishedAt: '',
    status: 'DRAFT',
    tagsInput: '',
    relatedBlogIds: [] as number[],
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
      excerpt: initialData.excerpt ?? '',
      content: initialData.content ?? '',
      coverImage: initialData.coverImage ?? '',
      publishedAt: initialData.publishedAt ? String(initialData.publishedAt).slice(0, 16) : '',
      status: initialData.status ?? 'DRAFT',
      tagsInput: Array.isArray(initialData.tags) ? initialData.tags.join(', ') : '',
      relatedBlogIds: Array.isArray(initialData.relatedBlogIds) ? initialData.relatedBlogIds : [],
    });
  }, [initialData]);

  const relatedCandidates = useMemo(
    () => existingBlogs.filter((item) => item.id !== initialData?.id),
    [existingBlogs, initialData?.id]
  );

  const generateSlug = (title: string) =>
    title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tags = formData.tagsInput
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    onSave({
      title: formData.title,
      slug: formData.slug,
      excerpt: formData.excerpt || null,
      content: formData.content,
      coverImage: formData.coverImage || null,
      publishedAt: formData.publishedAt || null,
      status: formData.status,
      tags,
      relatedBlogIds: formData.relatedBlogIds,
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
      <div
        className="fixed inset-y-0 right-0 z-[60] flex items-center justify-center p-2"
        style={{ left: `${SIDEBAR_WIDTH}px`, pointerEvents: 'none' }}
      >
        <div style={{ pointerEvents: 'auto' }} className="w-full max-w-[860px]">
          <div className="w-full max-h-[80vh] bg-white rounded-md border border-slate-200 shadow-sm flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100 flex-shrink-0">
              <div>
                <h2 className="text-[18px] font-semibold text-slate-900 leading-none">
                  {initialData ? 'Edit Blog' : 'New Blog'}
                </h2>
                <p className="text-[11px] text-slate-500 mt-1">Manage metadata, content, tags, and related posts.</p>
              </div>
              <button onClick={onCancel} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form id="blog-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-3">
              <div className="grid grid-cols-[1fr_280px] gap-3 items-start">
                <div className="space-y-2">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-700 mb-1">Title *</label>
                    <input
                      required
                      value={formData.title}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          title: e.target.value,
                          slug: generateSlug(e.target.value),
                        }))
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-700 mb-1">Slug *</label>
                    <div className="relative">
                      <input
                        required
                        value={formData.slug}
                        onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                        className={`${inputClass} pr-8 font-mono`}
                      />
                      <Info className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-700 mb-1">Excerpt</label>
                    <textarea
                      value={formData.excerpt}
                      rows={2}
                      onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
                      className="w-full px-3 py-2 rounded-md border border-slate-300 bg-white text-[13px] text-slate-900 placeholder:text-slate-400 resize-none focus:outline-none focus:border-[#00B8C6]"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <ImageUpload
                    label="Cover Image"
                    compact
                    value={formData.coverImage}
                    onChange={(url) => setFormData((prev) => ({ ...prev, coverImage: url }))}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-700 mb-1">Status</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
                        className={inputClass}
                      >
                        <option value="DRAFT">Draft</option>
                        <option value="PUBLISHED">Published</option>
                        <option value="ARCHIVED">Archived</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-700 mb-1">Published At</label>
                      <input
                        type="datetime-local"
                        value={formData.publishedAt}
                        onChange={(e) => setFormData((prev) => ({ ...prev, publishedAt: e.target.value }))}
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-700 mb-1">Content *</label>
                <textarea
                  required
                  value={formData.content}
                  rows={10}
                  onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                  className="w-full px-3 py-2 rounded-md border border-slate-300 bg-white text-[13px] text-slate-900 placeholder:text-slate-400 resize-y focus:outline-none focus:border-[#00B8C6]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-700 mb-1">Tags (comma separated)</label>
                  <input
                    value={formData.tagsInput}
                    onChange={(e) => setFormData((prev) => ({ ...prev, tagsInput: e.target.value }))}
                    placeholder="design, web, mobile"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-700 mb-1">Related Blogs</label>
                  <div className="max-h-[110px] overflow-y-auto rounded-md border border-slate-200 p-2 space-y-1">
                    {relatedCandidates.length === 0 && <p className="text-xs text-slate-400">No other blogs available.</p>}
                    {relatedCandidates.map((item) => (
                      <label key={item.id} className="flex items-center gap-2 text-xs text-slate-700">
                        <input
                          type="checkbox"
                          checked={formData.relatedBlogIds.includes(item.id)}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              relatedBlogIds: e.target.checked
                                ? [...prev.relatedBlogIds, item.id]
                                : prev.relatedBlogIds.filter((id) => id !== item.id),
                            }))
                          }
                        />
                        <span>{item.title}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </form>

            <div className="px-4 py-2 border-t border-slate-100 flex items-center justify-end gap-2 bg-white flex-shrink-0">
              <button type="button" onClick={onCancel} className="px-3 py-1.5 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-100 transition">
                Cancel
              </button>
              <button
                form="blog-form"
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 transition disabled:opacity-50"
              >
                <Save className="w-3 h-3" />
                {initialData ? 'Update Blog' : 'Create Blog'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
