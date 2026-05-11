'use client';

import { Plus, Trash2, GripVertical, Upload, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { resolveMediaUrl } from '@/lib/resolveMediaUrl';

interface NestedItem {
  id?: number;
  title: string;
  description?: string[];
  icon?: string;
  sortOrder?: number;
  [key: string]: any;
}

interface Props {
  title: string;
  items: NestedItem[];
  onChange: (items: NestedItem[]) => void;
  showIcon?: boolean;
  numberField?: { key: string; label: string };
}

const API_BASE = '/api/proxy';

export default function NestedEntityManager({ title, items, onChange, showIcon = false, numberField }: Props) {
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);

  const addItem = () => {
    const n = items.length;
    const newItem: NestedItem = { title: '', description: [], sortOrder: n };
    if (numberField) newItem[numberField.key] = n + 1;
    onChange([...items, newItem]);
  };

  const removeItem = (i: number) => onChange(items.filter((_, idx) => idx !== i));

  const updateItem = (i: number, field: string, value: any) => {
    const next = [...items];
    next[i] = { ...next[i], [field]: value };
    onChange(next);
  };

  const addPoint = (itemIdx: number) => {
    const pts = [...(items[itemIdx].description || []), ''];
    updateItem(itemIdx, 'description', pts);
  };

  const updatePoint = (itemIdx: number, pIdx: number, value: string) => {
    const pts = [...(items[itemIdx].description || [])];
    pts[pIdx] = value;
    updateItem(itemIdx, 'description', pts);
  };

  const removePoint = (itemIdx: number, pIdx: number) => {
    updateItem(itemIdx, 'description', (items[itemIdx].description || []).filter((_, i) => i !== pIdx));
  };

  const handleIconUpload = async (i: number, file: File) => {
    try {
      setUploadingIdx(i);
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch(`${API_BASE}/upload`, { method: 'POST', body: fd });
      if (res.ok) { updateItem(i, 'icon', (await res.json()).url); toast.success('Icon uploaded'); }
      else toast.error('Upload failed');
    } catch { toast.error('Upload error'); }
    finally { setUploadingIdx(null); }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">{title}</span>
        <button
          type="button"
          onClick={addItem}
          className="flex items-center gap-1 px-2.5 py-1 bg-[#00B8C6]/10 text-[#00B8C6] hover:bg-[#00B8C6]/20 rounded-md text-[10px] font-bold transition-all"
        >
          <Plus className="w-3 h-3" /> Add
        </button>
      </div>

      {items.length === 0 ? (
        <div className="py-6 border-2 border-dashed border-slate-200 rounded-xl text-center text-xs text-slate-400">
          No {title.toLowerCase()} yet — click <strong>Add</strong>.
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item, index) => {
            const points: string[] = item.description || [];
            return (
              <div
                key={index}
                className="group flex gap-2 bg-white border border-slate-200 rounded-xl p-3 hover:border-[#00B8C6]/30 transition-all"
              >
                <div className="flex-shrink-0 flex items-start pt-1 text-slate-300">
                  <GripVertical className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0 space-y-3">
                  {/* Title row */}
                  <div className="flex gap-2">
                    {numberField && (
                      <div className="w-16 flex-shrink-0">
                        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                          {numberField.label}
                        </label>
                        <input
                          type="number"
                          value={Number(item[numberField.key] ?? 0)}
                          onChange={(e) => updateItem(index, numberField.key, Number(e.target.value))}
                          className="w-full px-2 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#00B8C6]/30 focus:border-[#00B8C6]"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Title</label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => updateItem(index, 'title', e.target.value)}
                        placeholder="Enter title"
                        className="w-full px-2 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#00B8C6]/30 focus:border-[#00B8C6] transition-all"
                      />
                    </div>
                  </div>

                  {/* Icon */}
                  {showIcon && (
                    <div className="flex items-center gap-2">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Icon</label>
                      {item.icon ? (
                        <div className="relative w-8 h-8 rounded-lg border border-slate-200 overflow-hidden bg-slate-50 flex-shrink-0">
                          <img src={resolveMediaUrl(item.icon)} alt="icon" className="w-full h-full object-contain p-0.5" />
                          <button
                            type="button"
                            onClick={() => updateItem(index, 'icon', '')}
                            className="absolute inset-0 bg-rose-500/80 text-white opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center"
                          >
                            <X className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          disabled={uploadingIdx === index}
                          onClick={() => {
                            const inp = document.createElement('input');
                            inp.type = 'file'; inp.accept = 'image/*';
                            inp.onchange = (e: any) => {
                              const f = e.target.files?.[0];
                              if (f) handleIconUpload(index, f);
                            };
                            inp.click();
                          }}
                          className="w-8 h-8 rounded-lg border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 hover:border-[#00B8C6]/70 hover:text-[#00B8C6] transition-all"
                        >
                          <Upload className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  )}

                  {/* Bullet points — inline add-point UX */}
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                      Bullet Points
                    </label>
                    <div className="space-y-1.5">
                      {points.map((point, pIdx) => (
                        <div key={pIdx} className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#00B8C6] flex-shrink-0" />
                          <input
                            type="text"
                            value={point}
                            placeholder="Bullet point…"
                            autoFocus={pIdx === points.length - 1 && point === ''}
                            onChange={(e) => updatePoint(index, pIdx, e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') { e.preventDefault(); addPoint(index); }
                            }}
                            className="flex-1 bg-slate-50 border border-slate-200 focus:border-[#00B8C6] text-[11px] py-1 px-2 rounded-md text-slate-800 placeholder:text-slate-400 outline-none transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => removePoint(index, pIdx)}
                            className="text-slate-300 hover:text-rose-500 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}

                      {/* Add Point — appears below last input */}
                      <button
                        type="button"
                        onClick={() => addPoint(index)}
                        className="flex items-center gap-1 text-[10px] font-semibold text-[#00B8C6] hover:text-[#009da9] transition-colors mt-0.5"
                      >
                        <Plus className="w-3 h-3" />
                        Add Point
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex-shrink-0 flex items-start">
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="p-1 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
