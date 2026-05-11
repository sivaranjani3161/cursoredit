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

export default function CourseHighlightsManager({ items, onChange }: Props) {
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);

  const itemCount = items.length;

  const addHighlight = () => {
    const n = items.length;
    onChange([...items, { title: '', description: [], icon: '', sortOrder: n }]);
  };

  const removeHighlight = (idx: number) => onChange(items.filter((_, i) => i !== idx));

  const updateHighlight = (idx: number, patch: Partial<HighlightItem>) => {
    const next = [...items];
    next[idx] = { ...next[idx], ...patch };
    onChange(next);
  };

  const addPoint = (idx: number) => {
    const next = [...items];
    const pts = [...(next[idx]?.description || [])];
    pts.push('');
    next[idx] = { ...next[idx], description: pts };
    onChange(next);
  };

  const updatePoint = (itemIdx: number, pointIdx: number, value: string) => {
    const next = [...items];
    const pts = [...(next[itemIdx]?.description || [])];
    pts[pointIdx] = value;
    next[itemIdx] = { ...next[itemIdx], description: pts };
    onChange(next);
  };

  const removePoint = (itemIdx: number, pointIdx: number) => {
    const next = [...items];
    const pts = [...(next[itemIdx]?.description || [])];
    pts.splice(pointIdx, 1);
    next[itemIdx] = { ...next[itemIdx], description: pts };
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

  const emptyState = useMemo(() => {
    if (itemCount > 0) return null;
    return (
      <div className="py-6 border-2 border-dashed border-slate-200 rounded-lg text-center">
        <div className="text-[11px] font-semibold text-slate-500">No highlights yet</div>
        <div className="text-[10px] text-slate-400 mt-0.5">Click "Add Highlight" to create one.</div>
      </div>
    );
  }, [itemCount]);

  return (
    <div className="space-y-1.5">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
          Course Highlights
        </div>
        <button
          type="button"
          onClick={addHighlight}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#00B8C6]/10 text-[#00B8C6] text-[10px] font-bold hover:bg-[#00B8C6]/20 transition-all"
        >
          <Plus className="w-3 h-3" />
          Add Highlight
        </button>
      </div>

      {emptyState}

      <div className="space-y-1.5">
        {items.map((item, idx) => {
          const points = item.description || [];
          return (
            <div
              key={idx}
              className="bg-slate-50/60 border border-slate-200 rounded-lg p-2.5 hover:border-[#00B8C6]/35 transition-all"
            >
              {/* Grid: icon (48px) | title (1fr) | points (1.4fr) | delete (auto) */}
              <div className="grid grid-cols-[44px_1fr_1.4fr_28px] gap-2 items-start">

                {/* Icon */}
                <div>
                  <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Icon
                  </div>
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
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.onchange = (e: any) => {
                          const f = e.target.files?.[0];
                          if (f) handleIconUpload(idx, f);
                        };
                        input.click();
                      }}
                      className="w-11 h-11 rounded-md border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#00B8C6] hover:border-[#00B8C6]/60 transition-all"
                      title="Upload icon"
                    >
                      {uploadingIdx === idx ? (
                        <span className="w-3.5 h-3.5 border-2 border-slate-300 border-t-[#00B8C6] rounded-full animate-spin" />
                      ) : (
                        <Upload className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>

                {/* Title */}
                <div>
                  <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Title
                  </div>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => updateHighlight(idx, { title: e.target.value })}
                    placeholder="Highlight title"
                    className="w-full h-8 px-2.5 rounded-md border border-slate-200 bg-white text-[12px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#00B8C6] focus:bg-white transition-colors"
                  />
                </div>

                {/* Points */}
                <div>
                  <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Points
                  </div>
                  <div className="space-y-1">
                    {points.length === 0 ? (
                      <input
                        value=""
                        onFocus={() => addPoint(idx)}
                        placeholder="Click to add first point…"
                        readOnly
                        className="w-full h-8 px-2.5 rounded-md border border-dashed border-slate-200 bg-white text-[11px] text-slate-400 cursor-text"
                      />
                    ) : (
                      points.map((p, pIdx) => (
                        <div key={pIdx} className="flex items-center gap-1.5">
                          <input
                            value={p}
                            onChange={(e) => updatePoint(idx, pIdx, e.target.value)}
                            placeholder="Type point…"
                            className="flex-1 h-7 px-2.5 rounded-md border border-slate-200 bg-white text-[11px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#00B8C6] transition-colors"
                          />
                          <button
                            type="button"
                            onClick={() => removePoint(idx, pIdx)}
                            className="p-0.5 text-slate-300 hover:text-rose-500 rounded transition-all flex-shrink-0"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => addPoint(idx)}
                    className="mt-1 text-[9.5px] font-bold text-[#00B8C6] hover:underline"
                  >
                    + Add point
                  </button>
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
          );
        })}
      </div>
    </div>
  );
}