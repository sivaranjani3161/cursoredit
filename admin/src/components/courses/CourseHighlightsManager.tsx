'use client';

import { Plus, Trash2, Upload, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';
import { resolveMediaUrl } from '@/lib/resolveMediaUrl';

type HighlightItem = {
  id?: number;
  title: string;
  description?: string[];
  icon?: string;
  sortOrder?: number;
  [key: string]: any;
};

interface Props {
  items: HighlightItem[];
  onChange: (items: HighlightItem[]) => void;
}

const API_BASE = '/api/proxy';
const MAX_HIGHLIGHTS = 3;

export default function CourseHighlightsManager({ items, onChange }: Props) {
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);

  /* ── Hard-capped at 3 ── */
  const addHighlight = () => {
    if (items.length >= MAX_HIGHLIGHTS) return;
    onChange([...items, { title: '', description: [], icon: '', sortOrder: items.length }]);
  };
  const removeHighlight = (idx: number) => onChange(items.filter((_, i) => i !== idx));

  const updateHighlight = (idx: number, patch: Partial<HighlightItem>) => {
    const next = [...items];
    next[idx] = { ...next[idx], ...patch };
    onChange(next);
  };

  const handleIconUpload = async (idx: number, file: File) => {
    try {
      setUploadingIdx(idx);
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch(`${API_BASE}/upload`, { method: 'POST', body: fd });
      if (!res.ok) throw new Error();
      const { url } = await res.json();
      updateHighlight(idx, { icon: url });
      toast.success('Icon uploaded');
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploadingIdx(null);
    }
  };

  const atMax = items.length >= MAX_HIGHLIGHTS;

  const emptyState = useMemo(() => {
    if (items.length > 0) return null;
    return (
      <div className="py-6 border-2 border-dashed border-slate-200 rounded-lg text-center">
        <div className="text-[11px] font-semibold text-slate-500">No highlights yet</div>
        <div className="text-[10px] text-slate-400 mt-0.5">Add up to 3 highlights.</div>
      </div>
    );
  }, [items.length]);

  return (
    <div className="space-y-1.5">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Course Highlights
          </span>
          <span className={`text-[9.5px] font-semibold px-1.5 py-0.5 rounded-full ${
            atMax ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400'
          }`}>
            {items.length}/{MAX_HIGHLIGHTS}
          </span>
        </div>

        <button
          type="button"
          onClick={addHighlight}
          disabled={atMax}
          title={atMax ? 'Maximum 3 highlights allowed' : 'Add highlight'}
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold transition-all ${
            atMax
              ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
              : 'bg-[#00B8C6]/10 text-[#00B8C6] hover:bg-[#00B8C6]/20'
          }`}
        >
          <Plus className="w-3 h-3" />
          Add Highlight
        </button>
      </div>

      {/* ── Max warning ── */}
      {atMax && (
        <p className="text-[10px] text-amber-600 bg-amber-50 border border-amber-100 rounded-md px-2.5 py-1.5">
          Maximum of 3 highlights reached. Remove one to add another.
        </p>
      )}

      {emptyState}

      {/* ── Items ── */}
      <div className="space-y-1.5">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="bg-slate-50/60 border border-slate-200 rounded-lg p-2.5 hover:border-[#00B8C6]/35 transition-all"
          >

            {/* Mobile (<sm): stacked */}
            <div className="flex items-start gap-2 sm:hidden">
              {/* Icon */}
              <div className="flex-shrink-0">
                <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Icon</div>
                {item.icon ? (
                  <div className="relative w-10 h-10 rounded-md border border-slate-200 overflow-hidden bg-white">
                    <img src={resolveMediaUrl(item.icon)} alt="icon" className="w-full h-full object-contain p-1" />
                    <button
                      type="button"
                      onClick={() => updateHighlight(idx, { icon: '' })}
                      className="absolute inset-0 bg-rose-500/80 text-white opacity-0 hover:opacity-100 transition-all flex items-center justify-center"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    disabled={uploadingIdx === idx}
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file'; input.accept = 'image/*';
                      input.onchange = (e: any) => { const f = e.target.files?.[0]; if (f) handleIconUpload(idx, f); };
                      input.click();
                    }}
                    className="w-10 h-10 rounded-md border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#00B8C6] hover:border-[#00B8C6]/60 transition-all"
                  >
                    {uploadingIdx === idx
                      ? <span className="w-3.5 h-3.5 border-2 border-slate-300 border-t-[#00B8C6] rounded-full animate-spin" />
                      : <Upload className="w-3.5 h-3.5" />
                    }
                  </button>
                )}
              </div>
              {/* Title */}
              <div className="flex-1 min-w-0">
                <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Title</div>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => updateHighlight(idx, { title: e.target.value })}
                  placeholder="Highlight title"
                  className="w-full h-8 px-2.5 rounded-md border border-slate-200 bg-white text-[12px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#00B8C6] transition-colors"
                />
              </div>
              {/* Delete */}
              <button
                type="button"
                onClick={() => removeHighlight(idx)}
                className="mt-5 p-1 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-md transition-all flex-shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Desktop (sm+): 3-col grid — Icon | Title | Delete */}
            <div className="hidden sm:grid grid-cols-[44px_1fr_28px] gap-2 items-start">
              {/* Icon */}
              <div>
                <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Icon</div>
                {item.icon ? (
                  <div className="relative w-11 h-11 rounded-md border border-slate-200 overflow-hidden bg-white">
                    <img src={resolveMediaUrl(item.icon)} alt="icon" className="w-full h-full object-contain p-1" />
                    <button
                      type="button"
                      onClick={() => updateHighlight(idx, { icon: '' })}
                      className="absolute inset-0 bg-rose-500/80 text-white opacity-0 hover:opacity-100 transition-all flex items-center justify-center"
                      title="Remove icon"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    disabled={uploadingIdx === idx}
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file'; input.accept = 'image/*';
                      input.onchange = (e: any) => { const f = e.target.files?.[0]; if (f) handleIconUpload(idx, f); };
                      input.click();
                    }}
                    className="w-11 h-11 rounded-md border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#00B8C6] hover:border-[#00B8C6]/60 transition-all"
                    title="Upload icon"
                  >
                    {uploadingIdx === idx
                      ? <span className="w-3.5 h-3.5 border-2 border-slate-300 border-t-[#00B8C6] rounded-full animate-spin" />
                      : <Upload className="w-3.5 h-3.5" />
                    }
                  </button>
                )}
              </div>
              {/* Title */}
              <div>
                <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Title</div>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => updateHighlight(idx, { title: e.target.value })}
                  placeholder="Highlight title"
                  className="w-full h-8 px-2.5 rounded-md border border-slate-200 bg-white text-[12px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#00B8C6] focus:bg-white transition-colors"
                />
              </div>
              {/* Delete */}
              <div className="flex justify-center pt-5">
                <button
                  type="button"
                  onClick={() => removeHighlight(idx)}
                  className="p-1 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-md transition-all"
                  title="Delete highlight"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}