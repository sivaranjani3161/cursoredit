'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Tag, Plus, X, Save, Trash2, Pencil } from 'lucide-react';
import { useSession } from 'next-auth/react';
import DataTable, { Column } from '@/components/common/DataTable';
import CourseForm from '@/components/courses/CourseForm';
import { toast } from 'react-hot-toast';

const API_BASE = '/api/proxy';

const inp  = 'w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-[13px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#00B8C6] focus:ring-2 focus:ring-[#00B8C6]/10 transition-all';
const lbl  = 'block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1';
const makeSlug = (n: string) => n.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');



interface Category { id: number; name: string; slug: string; description: string | null; }

/* ─── Category Manager Modal ─────────────────────────────────── */
function CategoryManagerModal({ onClose, onChanged }: { onClose: () => void; onChanged: () => void }) {
  const [categories, setCategories]   = useState<Category[]>([]);
  const [loading, setLoading]         = useState(true);
  const [addName, setAddName]         = useState('');
  const [addSlug, setAddSlug]         = useState('');
  const [addDesc, setAddDesc]         = useState('');
  const [saving, setSaving]           = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [deleting, setDeleting]       = useState(false);
  const [view, setView]               = useState<'list' | 'add'>('list');

  const fetchCats = async () => {
    try {
      setLoading(true);
      const r = await fetch(`${API_BASE}/course-categories`);
      if (r.ok) setCategories(await r.json());
    } catch { toast.error('Failed to load categories'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCats(); }, []);

  const handleAdd = async () => {
    if (!addName.trim()) { toast.error('Name is required'); return; }
    try {
      setSaving(true);
      const res = await fetch(`${API_BASE}/course-categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: addName.trim(), slug: addSlug || makeSlug(addName), description: addDesc || null }),
      });
      if (res.ok) {
        toast.success('Category created!');
        setAddName(''); setAddSlug(''); setAddDesc('');
        setView('list');
        await fetchCats();
        onChanged();
      } else {
        const e = await res.json().catch(() => ({}));
        toast.error(e.error || 'Failed to create');
      }
    } catch { toast.error('An error occurred'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      const res = await fetch(`${API_BASE}/course-categories/${deleteTarget.id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Category deleted');
        setDeleteTarget(null);
        await fetchCats();
        onChanged();
      } else toast.error('Failed to delete');
    } catch { toast.error('An error occurred'); }
    finally { setDeleting(false); }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-3 sm:px-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose}/>
      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90dvh]">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-[#00B8C6]/5 to-white flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#00B8C6]/10 flex items-center justify-center">
              <Tag className="w-3.5 h-3.5 text-[#00B8C6]"/>
            </div>
            <h2 className="text-[14px] font-bold text-slate-800">Course Categories</h2>
          </div>
          <div className="flex items-center gap-2">
            {view === 'list' && (
              <button onClick={() => setView('add')}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#00B8C6] text-white text-[12px] font-semibold hover:bg-[#00a3b0] transition-colors">
                <Plus className="w-3 h-3"/> Add
              </button>
            )}
            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors">
              <X className="w-4 h-4"/>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">

          {/* ── ADD FORM VIEW ── */}
          {view === 'add' && (
            <div className="px-5 py-5 space-y-4">
             
              <div>
                <label className={lbl}>Name <span className="text-rose-400">*</span></label>
                <input type="text" value={addName} autoFocus
                  onChange={(e) => { setAddName(e.target.value); setAddSlug(makeSlug(e.target.value)); }}
                  placeholder="e.g. Campus-to-Corporate Programs" className={inp}/>
              </div>
              <div>
                <label className={lbl}>Slug</label>
                <input type="text" value={addSlug}
                  onChange={(e) => setAddSlug(e.target.value)}
                  placeholder="campus-to-corporate-programs"
                  className={`${inp} font-mono text-[12px]`}/>
              </div>
              <div>
                <label className={lbl}>Description <span className="text-slate-300">(optional)</span></label>
                <input type="text" value={addDesc}
                  onChange={(e) => setAddDesc(e.target.value)}
                  placeholder="Short description…" className={inp}/>
              </div>
            </div>
          )}

          {/* ── LIST VIEW ── */}
          {view === 'list' && (
            <div className="divide-y divide-slate-100">
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <div key={i} className="h-12 mx-4 my-2 rounded-lg bg-slate-100 animate-pulse"/>
                ))
              ) : categories.length === 0 ? (
                <div className="text-center py-10 px-4">
                  <Tag className="w-8 h-8 text-slate-300 mx-auto mb-2"/>
                  <p className="text-[13px] text-slate-500 font-medium">No categories yet</p>
                  <p className="text-[11px] text-slate-400 mt-1">Click "Add" to create your first category</p>
                </div>
              ) : categories.map((cat, idx) => (
                <div key={cat.id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 group transition-colors">
                  <span className="w-6 h-6 rounded-md bg-[#00B8C6]/10 flex items-center justify-center text-[#00B8C6] font-bold text-[10px] flex-shrink-0">
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-slate-800 truncate">{cat.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono truncate">{cat.slug}</p>
                  </div>
                  <button
                    onClick={() => setDeleteTarget(cat)}
                    className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all flex-shrink-0"
                    title="Delete category"
                  >
                    <Trash2 className="w-3.5 h-3.5"/>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 px-5 py-4 border-t border-slate-100 bg-slate-50/60 flex items-center justify-end gap-2">
          {view === 'add' ? (
            <>
              <button onClick={() => setView('list')}
                className="px-4 py-2 rounded-lg text-[13px] font-medium text-slate-600 hover:bg-slate-100 transition-colors">
                Back
              </button>
              <button onClick={handleAdd} disabled={saving}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#00B8C6] text-white text-[13px] font-semibold hover:bg-[#00a3b0] transition-colors disabled:opacity-50 shadow-sm">
                {saving
                  ? <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                  : <Save className="w-3.5 h-3.5"/>}
                Create
              </button>
            </>
          ) : (
            <button onClick={onClose}
              className="px-4 py-2 rounded-lg text-[13px] font-medium text-slate-600 hover:bg-slate-100 transition-colors">
              Close
            </button>
          )}
        </div>
      </div>

      {/* Delete confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" onClick={() => setDeleteTarget(null)}/>
          <div className="relative z-10 w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="h-1 w-full bg-rose-500"/>
            <div className="px-5 pt-5 pb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center flex-shrink-0">
                  <Trash2 className="w-4 h-4 text-rose-500"/>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">Delete Category</p>
                  <p className="text-[11px] text-slate-400">Courses in this category will be uncategorised</p>
                </div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 mb-4">
                <p className="text-[10px] text-slate-400 mb-0.5">Category to delete</p>
                <p className="text-sm font-semibold text-slate-800">{deleteTarget.name}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setDeleteTarget(null)}
                  className="flex-1 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                  Cancel
                </button>
                <button onClick={handleDelete} disabled={deleting}
                  className="flex-1 py-2 rounded-lg bg-rose-500 text-white text-sm font-bold hover:bg-rose-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5">
                  {deleting && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"/>}
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

export default function CoursesPage() {
  const { data: session }                       = useSession();
  const [courses, setCourses]                   = useState<any[]>([]);
  const [loading, setLoading]                   = useState(true);
  const [isFormOpen, setIsFormOpen]             = useState(false);
  const [selectedCourse, setSelectedCourse]     = useState<any>(null);
  const [formLoading, setFormLoading]           = useState(false);
  const [deleteTarget, setDeleteTarget]         = useState<any>(null);
  const [deleting, setDeleting]                 = useState(false);
  const [catModalOpen, setCatModalOpen]         = useState(false);
  const [catRefreshKey, setCatRefreshKey]       = useState(0);

  useEffect(() => { fetchCourses(); }, []);

  const fetchCourses = async () => {
    try { setLoading(true); const r = await fetch(`${API_BASE}/courses`); if (r.ok) setCourses(await r.json()); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleSave = async (formData: any) => {
    try {
      setFormLoading(true);
      const url    = selectedCourse ? `${API_BASE}/courses/${selectedCourse.id}` : `${API_BASE}/courses`;
      const method = selectedCourse ? 'PUT' : 'POST';
      if (!selectedCourse) {
        const dbUserId = Number(session?.user?.dbUserId);
        if (Number.isNaN(dbUserId)) { toast.error('Session missing user id — sign in again'); return; }
        formData.createdBy = dbUserId;
      }
      const r = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
      if (r.ok) { toast.success(selectedCourse ? 'Course updated' : 'Course created'); setIsFormOpen(false); setSelectedCourse(null); fetchCourses(); }
      else { const e = await r.json().catch(() => ({})); toast.error(e.error || 'Failed to save'); }
    } catch { toast.error('An error occurred'); } finally { setFormLoading(false); }
  };

  const handleEdit = async (course: any) => {
    try {
      setLoading(true);
      const r = await fetch(`${API_BASE}/courses/${course.id}`);
      if (r.ok) { setSelectedCourse(await r.json()); setIsFormOpen(true); }
    } catch { toast.error('Failed to fetch course details'); } finally { setLoading(false); }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      const r = await fetch(`${API_BASE}/courses/${deleteTarget.id}`, { method: 'DELETE' });
      if (r.ok) { toast.success('Course deleted'); fetchCourses(); }
      else toast.error('Failed to delete');
    } catch { toast.error('An error occurred'); } finally { setDeleting(false); setDeleteTarget(null); }
  };

  const handleTogglePublish = async (course: any) => {
    const next = !course.isActive;
    try {
      const r = await fetch(`${API_BASE}/courses/${course.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...course, isActive: next }),
      });
      if (!r.ok) { const e = await r.json().catch(() => ({})); toast.error(e.error || 'Failed'); return; }
      toast.success(next ? 'Published' : 'Unpublished'); fetchCourses();
    } catch { toast.error('An error occurred'); }
  };

  const columns: Column<any>[] = [
    {
      mobileTitle: true, header: 'Title',
      accessor: (item) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#00B8C6]/10 flex items-center justify-center text-[#00B8C6] font-bold text-[10px] shrink-0">
            {item.title[0].toUpperCase()}
          </div>
          <span className="font-semibold text-gray-900 text-sm">{item.title}</span>
        </div>
      ),
    },
    { mobileHidden: true, header: 'Slug', accessor: 'slug', className: 'font-mono text-xs text-gray-400 hidden sm:table-cell' },
    {
      mobileSubtitle: true, header: 'Status',
      accessor: (item) => (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
          item.isActive ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
        }`}>{item.isActive ? 'Active' : 'Inactive'}</span>
      ),
    },
    { header: 'Created', accessor: (item) => new Date(item.createdAt).toLocaleDateString(), className: 'text-gray-400 text-xs hidden md:table-cell' },
  ];

  return (
    <div className="p-3 sm:p-4">

      {/* ── Category manager banner ── */}
      <div className="mb-3 flex flex-col sm:flex-row sm:items-center gap-2 p-3 rounded-xl bg-gradient-to-r from-[#00B8C6]/8 to-transparent border border-[#00B8C6]/20">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-[#00B8C6]/10 flex items-center justify-center flex-shrink-0">
            <Tag className="w-3.5 h-3.5 text-[#00B8C6]"/>
          </div>
          <div className="min-w-0">
            <p className="text-[12px] font-bold text-slate-700">Course Categories</p>
            <p className="text-[11px] text-slate-400 truncate">Manage categories — add or delete them, then assign courses below</p>
          </div>
        </div>
        <button
          onClick={() => setCatModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#00B8C6] text-white text-[12px] font-semibold hover:bg-[#00a3b0] active:scale-[0.97] transition-all shadow-[0_3px_10px_rgba(0,184,198,0.25)] flex-shrink-0 w-full sm:w-auto justify-center"
        >
          <Tag className="w-3.5 h-3.5"/>
          Manage Categories
        </button>
      </div>

      <DataTable
        title="Courses" icon={BookOpen} module="courses"
        data={courses} columns={columns} loading={loading}
        searchKey="title" searchPlaceholder="Search courses..."
        onAdd={() => { setSelectedCourse(null); setIsFormOpen(true); }}
        onEdit={handleEdit} onDelete={(c) => setDeleteTarget(c)}
        renderRowActions={(item) => (
          <button onClick={() => handleTogglePublish(item)}
            className={`h-6 px-2 rounded-md border text-[10px] font-bold uppercase tracking-wide transition-all ${
              item.isActive
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                : 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'
            }`}>{item.isActive ? 'Unpublish' : 'Publish'}
          </button>
        )}
      />

      {/* ── Course delete confirm ── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={() => setDeleteTarget(null)}/>
          <div className="relative z-10 w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="h-1 w-full bg-rose-500"/>
            <div className="px-5 pt-5 pb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center flex-shrink-0">
                  <Trash2 className="w-4 h-4 text-rose-500"/>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">Delete Course</p>
                  <p className="text-[11px] text-slate-400">This cannot be undone</p>
                </div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 mb-4">
                <p className="text-[10px] text-slate-400 mb-0.5">Course to delete</p>
                <p className="text-sm font-semibold text-slate-800 truncate">{deleteTarget.title}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setDeleteTarget(null)}
                  className="flex-1 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
                <button onClick={confirmDelete} disabled={deleting}
                  className="flex-1 py-2 rounded-lg bg-rose-500 text-white text-sm font-bold hover:bg-rose-600 disabled:opacity-50 flex items-center justify-center gap-1.5">
                  {deleting && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"/>}
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Category Manager Modal ── */}
      {catModalOpen && (
        <CategoryManagerModal
          onClose={() => setCatModalOpen(false)}
          onChanged={() => setCatRefreshKey(k => k + 1)}
        />
      )}

      {/* ── Course Form ── */}
      {isFormOpen && (
        <CourseForm
          initialData={selectedCourse}
          onSave={handleSave}
          onCancel={() => { setIsFormOpen(false); setSelectedCourse(null); }}
          loading={formLoading}
          categoryRefreshKey={catRefreshKey}
        />
      )}
    </div>
  );
}