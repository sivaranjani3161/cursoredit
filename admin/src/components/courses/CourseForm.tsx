'use client';

import { useState, useEffect, useRef } from 'react';
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
const TOP_OFFSET = 12;
const RIGHT_OFFSET = 12;
const BOTTOM_OFFSET = 12;

export default function CourseForm({ initialData, onSave, onCancel, loading }: CourseFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    heroImage: '',
    isActive: true,
    courseHighlights: [] as any[],
    courseStructure: [] as any[],
    courseFeatures: [] as any[],
  });

  const [mounted, setMounted] = useState(false);
  // Track which accordion is open — only one open at a time
  const [openSection, setOpenSection] = useState<'highlights' | 'features' | 'structure' | null>('highlights');

  useEffect(() => { setMounted(true); return () => setMounted(false); }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        courseHighlights: initialData.courseHighlights || [],
        courseStructure: initialData.courseStructure || [],
        courseFeatures: initialData.courseFeatures || [],
      });
    }
  }, [initialData]);

  useEffect(() => {
    const orig = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = orig; };
  }, []);

  const sanitizeNested = (arr: any[]) => {
    if (!Array.isArray(arr)) return [];
    return arr.map((item) => ({
      ...item,
      title: String(item?.title ?? '').trim(),
      description: Array.isArray(item?.description)
        ? item.description.map((p: any) => String(p ?? '').trim()).filter((p: string) => p.length > 0)
        : [],
    })).filter((item) => item.title.length > 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      courseHighlights: sanitizeNested(formData.courseHighlights),
      courseFeatures: sanitizeNested(formData.courseFeatures),
      courseStructure: sanitizeNested(formData.courseStructure),
    });
  };

  const generateSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  /* ── shared input styles ── */
  const inp = 'w-full h-8 px-2.5 rounded-md border border-slate-200 bg-slate-50 text-[12px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#00B8C6] focus:bg-white transition-colors';
  const lbl = 'block text-[9.5px] font-bold uppercase tracking-wide text-slate-500 mb-0.5';

  // Accordion toggle — clicking open section closes it, clicking a closed one opens it
  const toggleSection = (section: 'highlights' | 'features' | 'structure') => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

const panelStyle: React.CSSProperties = {
    position: 'fixed',
    zIndex: 60,
    left: `${SIDEBAR_WIDTH}px`,
    top: `${TOP_OFFSET}px`,
    right: `${RIGHT_OFFSET}px`,
    bottom: `${BOTTOM_OFFSET}px`,
    display: 'flex',
    flexDirection: 'column',
    background: 'white',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 8px 40px 0 rgba(0,0,0,0.13)',
    overflow: 'hidden',
  };

  const backdropStyle: React.CSSProperties = {
    position: 'fixed',
    zIndex: 59,
    left: `${SIDEBAR_WIDTH}px`,
    top: `${TOP_OFFSET}px`,
    right: `${RIGHT_OFFSET}px`,
    bottom: `${BOTTOM_OFFSET}px`,
    background: 'rgba(0,0,0,0.18)',
    backdropFilter: 'blur(1px)',
    borderRadius: '10px',
  };

  /* ── Accordion section component ── */
  const AccordionSection = ({
    id,
    label,
    count,
    children,
  }: {
    id: 'highlights' | 'features' | 'structure';
    label: string;
    count: number;
    children: React.ReactNode;
  }) => {
    const isOpen = openSection === id;
    return (
      <div className={`border rounded-lg overflow-hidden transition-all ${isOpen ? 'border-[#00B8C6]/40 shadow-sm' : 'border-slate-200'}`}>
        {/* Summary row */}
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

        {/* Content — animate open/close */}
        {isOpen && (
          <div className="bg-white">
            <div className="p-2.5">
              {children}
            </div>
            {/* Save & Close footer */}
            <div className="flex items-center justify-end px-2.5 pb-2.5">
              <button
                type="button"
                onClick={() => setOpenSection(null)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#00B8C6] text-white text-[10.5px] font-semibold hover:bg-[#00a3b0] transition-colors shadow-sm"
              >
                <Save className="w-3 h-3" />
                Save & Close
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const modal = (
    <>
      <div style={backdropStyle} onClick={onCancel} />

      <div style={panelStyle}>

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-4 h-10 border-b border-slate-100 bg-white flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-[3px] h-3.5 rounded-full bg-[#00B8C6]" />
            <BookOpen className="w-3.5 h-3.5 text-[#00B8C6]" />
            <h2 className="text-[12.5px] font-bold text-slate-800">
              {initialData ? 'Edit Course' : 'New Course'}
            </h2>
            <span className="text-[10.5px] text-slate-400 font-normal">Fill in the details below</span>
          </div>
          <button
            onClick={onCancel}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* ── Form body ── */}
        <form onSubmit={handleSubmit} id="course-form" className="flex-1 flex flex-col min-h-0 overflow-hidden">

          {/* ── Section 1: Core fields ── */}
          <div className="flex-shrink-0 px-4 py-2.5 border-b border-slate-100 bg-slate-50/40">
            <div className="flex gap-3 items-start">

              {/* Left — Title, Slug, Description, Active */}
              <div className="flex-1 grid grid-cols-2 gap-x-2.5 gap-y-2">

                {/* Title */}
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

                {/* Slug */}
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

                {/* Description */}
                <div className="col-span-2">
                  <label className={lbl}>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                    placeholder="Brief course overview…"
                    rows={2}
                    className="w-full px-2.5 py-1.5 rounded-md border border-slate-200 bg-slate-50 text-[12px] text-slate-900 placeholder:text-slate-400 resize-none focus:outline-none focus:border-[#00B8C6] focus:bg-white transition-colors leading-relaxed"
                  />
                </div>

                {/* Active toggle */}
                <div className="col-span-2 flex items-center gap-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData((p) => ({ ...p, isActive: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-7 h-3.5 bg-slate-200 rounded-full peer-checked:bg-[#00B8C6] transition-all after:content-[''] after:absolute after:left-[2px] after:top-[1px] after:w-2.5 after:h-2.5 after:bg-white after:rounded-full after:transition-all peer-checked:after:translate-x-3.5" />
                  </label>
                  <span className="text-[11px] text-slate-600 font-medium">Active / Published</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${formData.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                    {formData.isActive ? 'Live' : 'Draft'}
                  </span>
                </div>

              </div>

              {/* Right — Hero Image */}
              <div className="flex-shrink-0 w-[148px]">
                <label className={lbl}>Hero Image</label>
                <div className="h-[114px] rounded-md overflow-hidden border border-slate-200 bg-slate-50">
                  <ImageUpload
                    value={formData.heroImage}
                    onChange={(url) => setFormData((p) => ({ ...p, heroImage: url }))}
                    compact
                  />
                </div>
              </div>

            </div>
          </div>

          {/* ── Section 2: Accordions — scrollable ── */}
          <div className="flex-1 min-h-0 overflow-y-auto px-4 py-2.5 space-y-1.5 bg-white">

            <AccordionSection
              id="highlights"
              label="Highlights"
              count={formData.courseHighlights.length}

            >
              <CourseHighlightsManager
                items={formData.courseHighlights}
                onChange={(items) => setFormData((p) => ({ ...p, courseHighlights: items as any }))}
              />
            </AccordionSection>

            <AccordionSection
              id="features"
              label="Key Features"
              count={formData.courseFeatures.length}

            >
              <NestedEntityManager
                title="Key Features"
                items={formData.courseFeatures}
                onChange={(items) => setFormData((p) => ({ ...p, courseFeatures: items as any }))}
              />
            </AccordionSection>

            <AccordionSection
              id="structure"
              label="Course Structure"
              count={formData.courseStructure.length}

            >
              <NestedEntityManager
                title="Course Structure (Phases)"
                items={formData.courseStructure}
                onChange={(items) => setFormData((p) => ({ ...p, courseStructure: items as any }))}
                showIcon
                numberField={{ key: 'phaseNumber', label: 'Phase #' }}
              />
            </AccordionSection>

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
            form="course-form"
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#00B8C6] text-white text-[11px] font-semibold hover:bg-[#00a3b0] transition-colors disabled:opacity-50 shadow-sm"
          >
            {loading ? (
              <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-3 h-3" />
            )}
            {initialData ? 'Update Course' : 'Create Course'}
          </button>
        </div>

      </div>
    </>
  );

  if (!mounted) return null;
  return createPortal(modal, document.body);
}