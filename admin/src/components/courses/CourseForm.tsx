'use client';

import { useState, useEffect } from 'react';
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

  const sanitizeNested = (arr: any[]) => {
    if (!Array.isArray(arr)) return [];
    return arr
      .map((item) => {
        const title = String(item?.title ?? '').trim();
        const description = Array.isArray(item?.description)
          ? item.description.map((p: any) => String(p ?? '').trim()).filter((p: string) => p.length > 0)
          : [];
        return { ...item, title, description };
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
    title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'highlights', label: 'Highlights', count: formData.courseHighlights.length },
    { key: 'features', label: 'Features', count: formData.courseFeatures.length },
    { key: 'structure', label: 'Structure', count: formData.courseStructure.length },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 flex-shrink-0">
          <div>
            <h2 className="text-base font-bold text-gray-900">
              {initialData ? 'Edit Course' : 'New Course'}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">Fill in the course details below</p>
          </div>
          <button
            onClick={onCancel}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Scrollable Body ── */}
        <form onSubmit={handleSubmit} id="course-form" className="flex-1 overflow-y-auto">

          {/* Basic Info — compact 2-col grid */}
          <div className="px-5 py-4 grid grid-cols-2 gap-x-5 gap-y-3 border-b border-gray-100">

            {/* Left column: Title + Slug + Toggle */}
            <div className="space-y-3">
              {/* Title */}
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                  Course Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    title: e.target.value,
                    slug: generateSlug(e.target.value),
                  }))}
                  placeholder="e.g. Full Stack Development"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00B8C6]/20 focus:border-[#00B8C6] transition-all"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                  URL Slug <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    className="w-full px-3 py-2 pr-8 rounded-lg border border-gray-200 text-sm text-gray-900 font-mono focus:outline-none focus:ring-2 focus:ring-[#00B8C6]/20 focus:border-[#00B8C6] transition-all"
                  />
                  <Info className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-300" />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief course description..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00B8C6]/20 focus:border-[#00B8C6] transition-all resize-none"
                />
              </div>

              {/* Active toggle */}
              <label className="inline-flex items-center gap-3 cursor-pointer select-none">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-[#00B8C6] transition-all after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
                </div>
                <span className="text-xs font-semibold text-gray-600">Active</span>
              </label>
            </div>

            {/* Right column: Hero image — compact */}
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                Hero Image
              </label>
              <ImageUpload
                value={formData.heroImage}
                onChange={(url) => setFormData(prev => ({ ...prev, heroImage: url }))}
                compact
              />
            </div>
          </div>

          {/* ── Nested Entities — Tab strip ── */}
          <div className="flex-1">
            {/* Tab bar */}
            <div className="flex items-center gap-0 border-b border-gray-100 px-5 bg-gray-50/50">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold transition-all border-b-2 -mb-px ${
                    activeTab === tab.key
                      ? 'border-[#00B8C6] text-[#00B8C6]'
                      : 'border-transparent text-gray-400 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-black ${
                      activeTab === tab.key ? 'bg-[#00B8C6] text-white' : 'bg-gray-200 text-gray-500'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="p-4">
              {activeTab === 'highlights' && (
                <NestedEntityManager
                  title="Course Highlights"
                  items={formData.courseHighlights}
                  onChange={(items) => setFormData(prev => ({ ...prev, courseHighlights: items as any }))}
                  showIcon={true}
                />
              )}
              {activeTab === 'features' && (
                <NestedEntityManager
                  title="Key Features"
                  items={formData.courseFeatures}
                  onChange={(items) => setFormData(prev => ({ ...prev, courseFeatures: items as any }))}
                />
              )}
              {activeTab === 'structure' && (
                <NestedEntityManager
                  title="Course Structure (Phases)"
                  items={formData.courseStructure}
                  onChange={(items) => setFormData(prev => ({ ...prev, courseStructure: items as any }))}
                  showIcon={true}
                  numberField={{ key: 'phaseNumber', label: 'Phase #' }}
                />
              )}
            </div>
          </div>
        </form>

        {/* ── Footer ── */}
        <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-end gap-2 flex-shrink-0 bg-white">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-xs font-bold text-gray-500 hover:bg-gray-100 transition-all"
          >
            Cancel
          </button>
          <button
            form="course-form"
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-[#00B8C6] text-white text-xs font-bold hover:brightness-95 transition-all disabled:opacity-50"
          >
            {loading ? (
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            {initialData ? 'Update Course' : 'Create Course'}
          </button>
        </div>
      </div>
    </div>
  );
}
