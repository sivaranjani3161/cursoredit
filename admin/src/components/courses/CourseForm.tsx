'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Save, Info, BookOpen } from 'lucide-react';
import NestedEntityManager from '../common/NestedEntityManager';
import ImageUpload from '../common/ImageUpload';
import CourseHighlightsManager from './CourseHighlightsManager';

interface CourseFormProps {
  initialData?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
  loading?: boolean;
}

const SIDEBAR_WIDTH = 262;
const TOP_OFFSET    = 12;
const RIGHT_OFFSET  = 12;
const BOTTOM_OFFSET = 12;

const SECTION_ORDER: Array<'highlights' | 'features' | 'structure'> = [
  'highlights',
  'features',
  'structure',
];

const inp = 'w-full h-8 px-2.5 rounded-md border border-slate-200 bg-slate-50 text-[12px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#00B8C6] focus:bg-white transition-colors';
const lbl = 'block text-[9.5px] font-bold uppercase tracking-wide text-slate-500 mb-0.5';

export default function CourseForm({ initialData, onSave, onCancel, loading }: CourseFormProps) {
  const [mounted, setMounted]         = useState(false);
  const [openSection, setOpenSection] = useState<'highlights' | 'features' | 'structure' | null>('highlights');
  const [formData, setFormData]       = useState({
    title: '',
    slug: '',
    description: '',
    heroImage: '',
    isActive: true,
    courseHighlights: [] as any[],
    courseStructure:  [] as any[],
    courseFeatures:   [] as any[],
  });

  useEffect(() => { setMounted(true); return () => setMounted(false); }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        courseHighlights: initialData.courseHighlights || [],
        courseStructure:  initialData.courseStructure  || [],
        courseFeatures:   initialData.courseFeatures   || [],
      });
    }
  }, [initialData]);

  useEffect(() => {
    const orig = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = orig; };
  }, []);

  const generateSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const sanitizeNested = (arr: any[]) => {
    if (!Array.isArray(arr)) return [];
    return arr
      .map((item) => ({
        ...item,
        title: String(item?.title ?? '').trim(),
        description: Array.isArray(item?.description)
          ? item.description.map((p: any) => String(p ?? '').trim()).filter((p: string) => p.length > 0)
          : [],
      }))
      .filter((item) => item.title.length > 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      courseHighlights: sanitizeNested(formData.courseHighlights),
      courseFeatures:   sanitizeNested(formData.courseFeatures),
      courseStructure:  sanitizeNested(formData.courseStructure),
    });
  };

  const toggleSection = (section: 'highlights' | 'features' | 'structure') =>
    setOpenSection((prev) => (prev === section ? null : section));

  /** Close current accordion and open the next one automatically */
  const saveAndAdvance = (current: 'highlights' | 'features' | 'structure') => {
    const idx = SECTION_ORDER.indexOf(current);
    const next = SECTION_ORDER[idx + 1] ?? null;
    setOpenSection(next);
  };

  const renderAccordion = (
    id: 'highlights' | 'features' | 'structure',
    label: string,
    count: number,
    children: React.ReactNode
  ) => {
    const isOpen = openSection === id;
    return (
      <div key={id} className={`border rounded-lg overflow-hidden transition-all ${isOpen ? 'border-[#00B8C6]/40 shadow-sm' : 'border-slate-200'}`}>
        <button
          type="button"
          onClick={() => toggleSection(id)}
          className={`w-full flex items-center justify-between px-3 py-2 text-left transition-colors ${isOpen ? 'bg-[#00B8C6]/5 border-b border-[#00B8C6]/20' : 'bg-slate-50 hover:bg-slate-100/70'}`}
        >
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? 'bg-[#00B8C6]' : 'bg-slate-300'}`} />
            <span className="text-[10.5px] font-bold text-slate-700 uppercase tracking-wider">{label}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${count > 0 ? 'bg-[#00B8C6]/10 text-[#00B8C6]' : 'bg-slate-100 text-slate-400'}`}>
              {count}
            </span>
            <span className={`text-slate-400 text-[10px] transition-transform duration-200 inline-block ${isOpen ? 'rotate-180' : ''}`}>▾</span>
          </div>
        </button>
        {isOpen && (
          <div className="bg-white">
            <div className="p-2.5">{children}</div>
            <div className="flex items-center justify-end px-2.5 pb-2.5">
              <button
                type="button"
                onClick={() => saveAndAdvance(id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#00B8C6] text-white text-[10.5px] font-semibold hover:bg-[#00a3b0] transition-colors shadow-sm"
              >
                <Save className="w-3 h-3" />
                {/* Label: show "Save & Close" on last section, else "Save & Next" */}
                {SECTION_ORDER.indexOf(id) < SECTION_ORDER.length - 1 ? 'Save & Next' : 'Save & Close'}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (!mounted) return null;

  const modal = (
    <>
      {/* Backdrop — desktop only */}
      <div
        className="fixed z-[59] bg-black/18 backdrop-blur-[1px] hidden lg:block"
        style={{ left: SIDEBAR_WIDTH, top: TOP_OFFSET, right: RIGHT_OFFSET, bottom: BOTTOM_OFFSET, borderRadius: 10 }}
        onClick={onCancel}
      />
      {/* Backdrop — tablet only (md but not lg) */}
      <div
        className="fixed inset-0 z-[59] bg-black/30 backdrop-blur-sm hidden md:block lg:hidden"
        onClick={onCancel}
      />

      <div
        className="
          fixed z-[60] flex flex-col bg-white overflow-hidden

          /* Mobile: true fullscreen */
          inset-0

          /* Tablet: centered dialog */
          md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2
          md:w-[680px] md:max-h-[90dvh] md:rounded-2xl md:border md:border-slate-200 md:shadow-2xl

          /* Desktop: sidebar-offset panel */
          lg:translate-x-0 lg:translate-y-0 lg:rounded-[10px] lg:border lg:border-slate-200 lg:shadow-2xl
        "
        ref={(el) => {
          if (!el) return;
          if (window.innerWidth >= 1024) {
            el.style.left      = `${SIDEBAR_WIDTH}px`;
            el.style.top       = `${TOP_OFFSET}px`;
            el.style.right     = `${RIGHT_OFFSET}px`;
            el.style.bottom    = `${BOTTOM_OFFSET}px`;
            el.style.width     = 'auto';
            el.style.maxHeight = 'none';
            el.style.transform = 'none';
          }
        }}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-4 h-12 border-b border-slate-100 bg-white flex-shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-[3px] h-3.5 rounded-full bg-[#00B8C6] flex-shrink-0" />
            <BookOpen className="w-3.5 h-3.5 text-[#00B8C6] flex-shrink-0" />
            <h2 className="text-[13px] font-bold text-slate-800 flex-shrink-0">
              {initialData ? 'Edit Course' : 'New Course'}
            </h2>
            <span className="text-[10.5px] text-slate-400 font-normal truncate hidden sm:block">
              Fill in the details below
            </span>
          </div>
          <button
            onClick={onCancel}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <form
          onSubmit={handleSubmit}
          id="course-form"
          className="flex-1 overflow-y-auto"
        >
          {/* ── Core fields ── */}
          <div className="px-4 py-4 border-b border-slate-100 bg-slate-50/40 space-y-3">

            {/* Title + Slug */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={lbl}>Title <span className="text-rose-400">*</span></label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, title: e.target.value, slug: generateSlug(e.target.value) }))
                  }
                  placeholder="e.g. Full Stack Development"
                  className={inp}
                />
              </div>
              <div>
                <label className={lbl}>URL Slug <span className="text-rose-400">*</span></label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData((p) => ({ ...p, slug: e.target.value }))}
                    className={`${inp} pr-7 font-mono text-[11px]`}
                    placeholder="full-stack-development"
                  />
                  <Info className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-300" />
                </div>
              </div>
            </div>

            {/* Description + Hero Image */}
            <div className="flex gap-3 items-start">
              <div className="flex-1 min-w-0">
                <label className={lbl}>Description</label>
                <textarea
                  value={formData.description ?? ''}
                  onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Brief course overview…"
                  rows={3}
                  className="w-full px-2.5 py-1.5 rounded-md border border-slate-200 bg-slate-50 text-[12px] text-slate-900 placeholder:text-slate-400 resize-none focus:outline-none focus:border-[#00B8C6] focus:bg-white transition-colors leading-relaxed"
                />
              </div>
              <div className="flex-shrink-0 w-[100px] sm:w-[130px]">
                <label className={lbl}>Hero Image</label>
                <div className="h-[82px] sm:h-[90px] rounded-md overflow-hidden border border-slate-200 bg-slate-50">
                  <ImageUpload
                    value={formData.heroImage}
                    onChange={(url) => setFormData((p) => ({ ...p, heroImage: url }))}
                    compact
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── Accordions ── */}
          <div className="px-4 py-3 space-y-2 bg-white">
            {renderAccordion('highlights', 'Highlights', formData.courseHighlights.length,
              <CourseHighlightsManager
                items={formData.courseHighlights}
                onChange={(items) => setFormData((p) => ({ ...p, courseHighlights: items as any }))}
              />
            )}
            {renderAccordion('features', 'Key Features', formData.courseFeatures.length,
              <NestedEntityManager
                title="Key Features"
                items={formData.courseFeatures}
                onChange={(items) => setFormData((p) => ({ ...p, courseFeatures: items as any }))}
              />
            )}
            {renderAccordion('structure', 'Course Structure', formData.courseStructure.length,
              <NestedEntityManager
                title="Course Structure (Phases)"
                items={formData.courseStructure}
                onChange={(items) => setFormData((p) => ({ ...p, courseStructure: items as any }))}
                showIcon
                numberField={{ key: 'phaseNumber', label: 'Phase #' }}
              />
            )}
          </div>

          <div className="h-2" />
        </form>

        {/* ── Footer ── */}
        <div className="flex-shrink-0 px-4 h-14 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50/60">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-[12px] font-medium text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            form="course-form"
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#00B8C6] text-white text-[12px] font-semibold hover:bg-[#00a3b0] transition-colors disabled:opacity-50 shadow-sm"
          >
            {loading
              ? <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <Save className="w-3 h-3" />
            }
            {initialData ? 'Update Course' : 'Create Course'}
          </button>
        </div>
      </div>
    </>
  );

  return createPortal(modal, document.body);
}