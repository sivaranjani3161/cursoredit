'use client';

import { useState, useEffect } from 'react';
import { Tag, Plus, Pencil, Trash2, X, Save, ChevronUp, ChevronDown } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useError } from '@/shared/context/ErrorContext';
import { z } from 'zod';

const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  slug: z.string().optional(),
  description: z.string().optional(),
  sortOrder: z.number().int().min(0).optional(),
});

const API = '/api/proxy';

const inp = 'w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-[13px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#00B8C6] focus:ring-2 focus:ring-[#00B8C6]/10 transition-all';
const lbl = 'block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1';



const makeSlug = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  sortOrder: number;
  createdAt: string;
}

interface FormState {
  name: string;
  slug: string;
  description: string;
  sortOrder: number;
}

const empty: FormState = { name: '', slug: '', description: '', sortOrder: 0 };

export default function CourseCategoriesPage() {
  const { setError } = useError();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading]       = useState(true);
  const [formOpen, setFormOpen]     = useState(false);
  const [editing, setEditing]       = useState<Category | null>(null);
  const [form, setForm]             = useState<FormState>(empty);
  const [saving, setSaving]         = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [deleting, setDeleting]     = useState(false);

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/course-categories`);
      if (res.ok) setCategories(await res.json());
    } catch { setError('Failed to load categories'); }
    finally { setLoading(false); }
  };

  const openAdd = () => {
    setEditing(null);
    setForm(empty);
    setFormOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditing(cat);
    setForm({ name: cat.name, slug: cat.slug, description: cat.description || '', sortOrder: cat.sortOrder });
    setFormOpen(true);
  };

  const closeForm = () => { setFormOpen(false); setEditing(null); setForm(empty); };

  const handleSave = async () => {
    const parsed = categorySchema.safeParse({ ...form, slug: form.slug || makeSlug(form.name) });
    if (!parsed.success) { setError(parsed.error.issues[0]?.message || 'Validation failed'); return; }
    try {
      setSaving(true);
      const payload = parsed.data;
      const url    = editing ? `${API}/course-categories/${editing.id}` : `${API}/course-categories`;
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        toast.success(editing ? 'Category updated' : 'Category created');
        closeForm();
        fetchCategories();
      } else {
        const err = await res.json().catch(() => ({}));
        setError(err.error || 'Failed to save category');
      }
    } catch { setError('An error occurred'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      const res = await fetch(`${API}/course-categories/${deleteTarget.id}`, { method: 'DELETE' });
      if (res.ok) { toast.success('Category deleted'); fetchCategories(); }
      else setError('Failed to delete category');
    } catch { setError('An error occurred'); }
    finally { setDeleting(false); setDeleteTarget(null); }
  };

  return (
    <div className="p-3 sm:p-5 max-w-4xl">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#00B8C6]/10 flex items-center justify-center flex-shrink-0">
            <Tag className="w-4.5 h-4.5 text-[#00B8C6]" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">Course Categories</h1>
            <p className="text-[12px] text-slate-400">{categories.length} {categories.length === 1 ? 'category' : 'categories'} total</p>
          </div>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00B8C6] text-white text-[13px] font-semibold hover:bg-[#00a3b0] active:scale-[0.97] transition-all shadow-[0_4px_14px_rgba(0,184,198,0.3)]"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {/* ── Categories Grid ── */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 rounded-xl bg-slate-100 animate-pulse" />
          ))}
        </div>
     ) : categories.length === 0 ? (
  <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-2xl">
    <Tag className="w-10 h-10 text-slate-300 mx-auto mb-3" />
    <p className="text-slate-500 font-semibold text-sm">No categories yet</p>
    <p className="text-slate-400 text-[12px] mt-1">
      Click "Add Category" to get started
    </p>
  </div>
) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {categories.map((cat, idx) => (
            <div
              key={cat.id}
              className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-2 hover:border-[#00B8C6]/40 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-7 h-7 rounded-lg bg-[#00B8C6]/10 flex items-center justify-center text-[#00B8C6] font-bold text-[11px] flex-shrink-0">
                    {idx + 1}
                  </span>
                  <p className="font-semibold text-[13px] text-slate-900 leading-snug">{cat.name}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEdit(cat)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-[#00B8C6] hover:bg-[#00B8C6]/10 transition-colors"
                    title="Edit"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(cat)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <p className="font-mono text-[10px] text-slate-400 truncate">/courses?category={cat.slug}</p>
              {cat.description && (
                <p className="text-[12px] text-slate-500 line-clamp-2">{cat.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Add / Edit Form Modal ── */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={closeForm} />
          <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-[3px] h-4 rounded-full bg-[#00B8C6]" />
                <Tag className="w-4 h-4 text-[#00B8C6]" />
                <h2 className="text-[14px] font-bold text-slate-800">
                  {editing ? 'Edit Category' : 'Add Category'}
                </h2>
              </div>
              <button onClick={closeForm} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="px-5 py-5 space-y-4">
              <div>
                <label className={lbl}>Name <span className="text-rose-400">*</span></label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value, slug: makeSlug(e.target.value) }))}
                  placeholder="e.g. Campus-to-Corporate Programs"
                  className={inp}
                  autoFocus
                />
              </div>
              <div>
                <label className={lbl}>Slug</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
                  placeholder="campus-to-corporate-programs"
                  className={`${inp} font-mono text-[12px]`}
                />
              </div>
              <div>
                <label className={lbl}>Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Optional short description…"
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-[13px] text-slate-900 placeholder:text-slate-400 resize-none focus:outline-none focus:border-[#00B8C6] focus:ring-2 focus:ring-[#00B8C6]/10 transition-all"
                />
              </div>
              <div>
                <label className={lbl}>Sort Order</label>
                <input
                  type="number"
                  min={0}
                  value={form.sortOrder}
                  onChange={(e) => setForm((p) => ({ ...p, sortOrder: Number(e.target.value) }))}
                  className={inp}
                />
              </div>

             
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-slate-100 bg-slate-50/60">
              <button
                type="button"
                onClick={closeForm}
                className="px-4 py-2 rounded-lg text-[13px] font-medium text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#00B8C6] text-white text-[13px] font-semibold hover:bg-[#00a3b0] transition-colors disabled:opacity-50 shadow-sm"
              >
                {saving ? (
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                {editing ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={() => setDeleteTarget(null)} />
          <div className="relative z-10 w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="h-1 w-full bg-rose-500" />
            <div className="px-5 pt-5 pb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center flex-shrink-0">
                  <Trash2 className="w-4 h-4 text-rose-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">Delete Category</p>
                  <p className="text-[11px] text-slate-400">Courses in this category will be uncategorised</p>
                </div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 mb-4">
                <p className="text-[10px] text-slate-400 mb-0.5">Category to be deleted</p>
                <p className="text-sm font-semibold text-slate-800">{deleteTarget.name}</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 py-2 rounded-lg bg-rose-500 text-white text-sm font-bold hover:bg-rose-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {deleting && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
