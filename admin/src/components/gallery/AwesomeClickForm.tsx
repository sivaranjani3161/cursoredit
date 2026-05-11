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

const SIDEBAR_WIDTH = 262;
const TOP_OFFSET = 12;
const RIGHT_OFFSET = 12;
const BOTTOM_OFFSET = 12;
const inputClass =
  'w-full h-9 px-3 rounded-md border border-slate-300 bg-white text-[13px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#00B8C6]';

export default function AwesomeClickForm({ initialData, onSave, onCancel, loading }: Props) {
  const [mounted, setMounted] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [altText, setAltText] = useState('');

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
    setImageUrl(initialData.imageUrl ?? '');
    setAltText(initialData.altText ?? '');
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim()) return;
    onSave({
      imageUrl: imageUrl.trim(),
      altText: altText.trim() || null,
    });
  };

  if (!mounted) return null;

  return createPortal(
    <>
      <div
        className="fixed z-[59] bg-[#00B8C6]/10 backdrop-blur-[2px] rounded-[10px]"
        style={{ left: `${SIDEBAR_WIDTH}px`, top: `${TOP_OFFSET}px`, right: `${RIGHT_OFFSET}px`, bottom: `${BOTTOM_OFFSET}px` }}
        onClick={onCancel}
      />
      <div className="fixed inset-y-0 right-0 z-[60] flex items-center justify-center p-2" style={{ left: `${SIDEBAR_WIDTH}px`, top: `${TOP_OFFSET}px`, right: `${RIGHT_OFFSET}px`, bottom: `${BOTTOM_OFFSET}px`, pointerEvents: 'none' }}>
        <div style={{ pointerEvents: 'auto' }} className="w-full max-w-[560px]">
          <div className="w-full max-h-full bg-white rounded-[10px] border border-slate-200 shadow-sm flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100 flex-shrink-0">
              <h2 className="text-[18px] font-semibold text-slate-900">{initialData ? 'Edit Awesome Click' : 'New Awesome Click'}</h2>
              <button type="button" onClick={onCancel} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form id="awesome-click-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-3">
              <ImageUpload label="Image" compact value={imageUrl} onChange={setImageUrl} />
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-700 mb-1">Alt text</label>
                <input value={altText} onChange={(e) => setAltText(e.target.value)} className={inputClass} placeholder="Optional" />
              </div>
            </form>

            <div className="px-4 py-2 border-t border-slate-100 flex items-center justify-end gap-2 bg-white flex-shrink-0">
              <button type="button" onClick={onCancel} className="px-3 py-1.5 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-100 transition">
                Cancel
              </button>
              <button
                form="awesome-click-form"
                type="submit"
                disabled={loading || !imageUrl.trim()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 transition disabled:opacity-50"
              >
                <Save className="w-3 h-3" />
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
