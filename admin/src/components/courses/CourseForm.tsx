'use client';

import { useState, useEffect } from 'react';
import { X, Save, AlertCircle, Info } from 'lucide-react';
import NestedEntityManager from '../common/NestedEntityManager';
import ImageUpload from '../common/ImageUpload';

interface CourseFormProps {
  initialData?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
  loading?: boolean;
}

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
    courseHighlights: [],
    courseStructure: [],
    courseFeatures: [],
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }));
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 text-gray-900">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onCancel}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#fdfdfe] rounded-3xl shadow-2xl border border-blue-100 flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-blue-200 flex items-center justify-between bg-white/50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {initialData ? 'Edit Course' : 'Create New Course'}
            </h2>
            <p className="text-sm text-gray-500">Enter details for the educational program</p>
          </div>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} id="course-form" className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
          
          {/* Basic Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Course Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Full Stack Development"
                  className="w-full px-4 py-3 rounded-xl border border-blue-200 text-gray-900 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-[#0066FF] transition-all text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">URL Slug</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-blue-200 text-gray-900 bg-white placeholder:text-gray-400 shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-[#0066FF] transition-all text-sm font-mono"
                  />
                  <Info className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0066FF]"></div>
                  <span className="ml-3 text-sm font-bold text-gray-700 uppercase tracking-widest">Active Status</span>
                </label>
              </div>
            </div>

            <div className="space-y-6">
              <ImageUpload
                label="Hero Image"
                value={formData.heroImage}
                onChange={(url) => setFormData({ ...formData, heroImage: url })}
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Course Introduction</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Briefly describe the course content..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-blue-200 text-gray-900 bg-white placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-[#0066FF] transition-all text-sm resize-none"
              />
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          {/* Nested Entities Section */}
          <div className="space-y-12">
            <NestedEntityManager
              title="Course Highlights"
              items={formData.courseHighlights}
              onChange={(items) => setFormData({ ...formData, courseHighlights: items as any })}
              showIcon={true}
            />

            <div className="h-px bg-gray-100" />

            <NestedEntityManager
              title="Key Features"
              items={formData.courseFeatures}
              onChange={(items) => setFormData({ ...formData, courseFeatures: items as any })}
            />

            <div className="h-px bg-gray-100" />

            <NestedEntityManager
              title="Course Structure (Phases)"
              items={formData.courseStructure}
              onChange={(items) => setFormData({ ...formData, courseStructure: items as any })}
              showIcon={true}
            />
          </div>
        </form>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-blue-200 flex items-center justify-end gap-3 bg-white">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
          <button
            form="course-form"
            type="submit"
            disabled={loading}
            className="px-8 py-2.5 rounded-xl bg-[#0066FF] text-white text-sm font-bold hover:bg-[#0052cc] transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {initialData ? 'Update Course' : 'Publish Course'}
          </button>
        </div>
      </div>
    </div>
  );
}
