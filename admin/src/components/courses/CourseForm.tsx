'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Save, Info } from 'lucide-react';
import NestedEntityManager from '../common/NestedEntityManager';
import ImageUpload from '../common/ImageUpload';

interface CourseFormProps {
  initialData?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
  loading?: boolean;
}

type Tab = 'highlights' | 'features' | 'structure';

export default function CourseForm({
  initialData,
  onSave,
  onCancel,
  loading,
}: CourseFormProps) {
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

  const [activeTab, setActiveTab] = useState<Tab>('highlights');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

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
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const sanitizeNested = (arr: any[]) => {
    if (!Array.isArray(arr)) return [];

    return arr
      .map((item) => {
        const title = String(item?.title ?? '').trim();

        const description = Array.isArray(item?.description)
          ? item.description
              .map((p: any) => String(p ?? '').trim())
              .filter((p: string) => p.length > 0)
          : [];

        return {
          ...item,
          title,
          description,
        };
      })
      .filter((item) => item.title.length > 0);
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
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

  const tabs: { key: Tab; label: string; count: number }[] = [
    {
      key: 'highlights',
      label: 'Highlights',
      count: formData.courseHighlights.length,
    },
    {
      key: 'features',
      label: 'Features',
      count: formData.courseFeatures.length,
    },
    {
      key: 'structure',
      label: 'Structure',
      count: formData.courseStructure.length,
    },
  ];

  const SIDEBAR_WIDTH = 252;

  const inputClass =
    'w-full h-9 px-3 rounded-md border border-slate-300 bg-white text-[13px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#00B8C6]';

  const modal = (
    <>
{/* Backdrop with blur */}
{/* Backdrop with blur */}
<div
  className="fixed z-[59] bg-[#00B8C644] rounded-xl"
  style={{ 
    left: `${SIDEBAR_WIDTH + 12}px`, 
    top: '12px',
    right: '12px',
    bottom: '12px'
  }}
  onClick={onCancel}
/>
      {/* Wrapper */}
      <div
        className="fixed inset-y-0 right-0 z-[60] flex items-center justify-center p-2"
        style={{
          left: `${SIDEBAR_WIDTH}px`,
          pointerEvents: 'none',
        }}
      >
        <div
          style={{ pointerEvents: 'auto' }}
className="w-full max-w-[720px]"        >
          {/* Modal */}
          <div className="w-full max-h-[75vh] bg-white rounded-md border border-slate-200 shadow-sm flex flex-col overflow-hidden">
            
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100 flex-shrink-0">
              <div>
                <h2 className="text-[18px] font-semibold text-slate-900 leading-none">
                  {initialData ? 'Edit Course' : 'New Course'}
                </h2>

                <p className="text-[11px] text-slate-500 mt-1">
                  Fill in the course details below
                </p>
              </div>

              <button
                onClick={onCancel}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              id="course-form"
              className="flex-1 overflow-y-auto"
            >
              {/* TOP SECTION */}
              <div className="px-4 py-3 border-b border-slate-100">

                <div className="grid grid-cols-[1fr_300px] gap-3 items-start">

                  {/* LEFT */}
                  <div className="space-y-2">

                    {/* TITLE */}
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-700 mb-1">
                        Course Title *
                      </label>

                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            title: e.target.value,
                            slug: generateSlug(e.target.value),
                          }))
                        }
                        placeholder="e.g. Full Stack Development"
                        className={inputClass}
                      />
                    </div>

                    {/* SLUG */}
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-700 mb-1">
                        URL Slug *
                      </label>

                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={formData.slug}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              slug: e.target.value,
                            }))
                          }
                          className={`${inputClass} pr-8 font-mono`}
                        />

                        <Info className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300" />
                      </div>
                    </div>

                    {/* ACTIVE */}
                    <label className="inline-flex items-center gap-2 cursor-pointer pt-1">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={formData.isActive}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              isActive: e.target.checked,
                            }))
                          }
                          className="sr-only peer"
                        />

                        <div className="w-8 h-4 bg-slate-200 rounded-full peer-checked:bg-[#00B8C6] transition-all after:content-[''] after:absolute after:left-[2px] after:top-[2px] after:w-3 after:h-3 after:bg-white after:rounded-full after:transition-all peer-checked:after:translate-x-4" />
                      </div>

                      <span className="text-xs text-slate-700">
                        Active
                      </span>
                    </label>
                  </div>

                  {/* HERO IMAGE */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-700 mb-1">
                      Hero Image
                    </label>

                    <div className="h-[130px] overflow-hidden rounded-md">
                      <ImageUpload
                        value={formData.heroImage}
                        onChange={(url) =>
                          setFormData((prev) => ({
                            ...prev,
                            heroImage: url,
                          }))
                        }
                        compact
                      />
                    </div>
                  </div>
                </div>

                {/* DESCRIPTION */}
                <div className="mt-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-700 mb-1">
                    Description
                  </label>

                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Brief course description..."
                    rows={2}
                    className="w-full px-3 py-2 rounded-md border border-slate-300 bg-white text-[13px] text-slate-900 placeholder:text-slate-400 resize-none focus:outline-none focus:border-[#00B8C6]"
                  />
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-slate-100 px-3 flex items-center gap-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-3 py-2 text-[12px] font-medium border-b transition-all ${
                      activeTab === tab.key
                        ? 'border-[#00B8C6] text-[#00B8C6]'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {tab.label}
                    {tab.count > 0 && ` (${tab.count})`}
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="p-3">
                {activeTab === 'highlights' && (
                  <NestedEntityManager
                    title="Course Highlights"
                    items={formData.courseHighlights}
                    onChange={(items) =>
                      setFormData((prev) => ({
                        ...prev,
                        courseHighlights: items as any,
                      }))
                    }
                    showIcon
                  />
                )}

                {activeTab === 'features' && (
                  <NestedEntityManager
                    title="Key Features"
                    items={formData.courseFeatures}
                    onChange={(items) =>
                      setFormData((prev) => ({
                        ...prev,
                        courseFeatures: items as any,
                      }))
                    }
                  />
                )}

                {activeTab === 'structure' && (
                  <NestedEntityManager
                    title="Course Structure (Phases)"
                    items={formData.courseStructure}
                    onChange={(items) =>
                      setFormData((prev) => ({
                        ...prev,
                        courseStructure: items as any,
                      }))
                    }
                    showIcon
                    numberField={{
                      key: 'phaseNumber',
                      label: 'Phase #',
                    }}
                  />
                )}
              </div>
            </form>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-slate-100 flex items-center justify-end gap-2 bg-white flex-shrink-0">
              <button
                type="button"
                onClick={onCancel}
                className="px-3 py-1.5 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-100 transition"
              >
                Cancel
              </button>

              <button
                form="course-form"
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 transition disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save className="w-3 h-3" />
                )}

                {initialData ? 'Update Course' : 'Create Course'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  if (!mounted) return null;

  return createPortal(modal, document.body);
}