'use client';

import { useState } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import type { NestedItem } from '@/types';



interface Props {
  title: string;
  items: NestedItem[];
  onChange: (items: NestedItem[]) => void;
  showIcon?: boolean;
  numberField?: { key: string; label: string };
}

const inp = 'w-full h-7 px-2.5 rounded-md border border-slate-200 bg-white text-[11.5px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#00B8C6] focus:bg-white transition-colors';
const lbl = 'block text-[9px] font-bold uppercase tracking-wide text-slate-400 mb-0.5';

export default function NestedEntityManager({ title, items, onChange, showIcon, numberField }: Props) {


  const addItem = () => {
    const base: NestedItem = { title: '', description: [], sortOrder: items.length };
    if (numberField) (base as unknown as Record<string, unknown>)[numberField.key] = items.length + 1;
    onChange([...items, base]);
  };

  const removeItem = (idx: number) => onChange(items.filter((_, i) => i !== idx));

  const updateItem = (idx: number, patch: Partial<NestedItem>) => {
    const next = [...items];
    next[idx] = { ...next[idx], ...patch };
    onChange(next);
  };

  const addPoint = (idx: number) => {
    const desc = [...((items[idx].description as string[]) ?? []), ''];
    updateItem(idx, { description: desc });
  };

  const updatePoint = (itemIdx: number, pointIdx: number, val: string) => {
    const desc = [...((items[itemIdx].description as string[]) ?? [])];
    desc[pointIdx] = val;
    updateItem(itemIdx, { description: desc });
  };

  const removePoint = (itemIdx: number, pointIdx: number) => {
    const desc = ((items[itemIdx].description as string[]) ?? []).filter((_, i) => i !== pointIdx);
    updateItem(itemIdx, { description: desc });
  };

  return (
    <div className="space-y-1.5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
          {title}
        </span>
        <button
          type="button"
          onClick={addItem}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold bg-[#00B8C6]/10 text-[#00B8C6] hover:bg-[#00B8C6]/20 transition-all"
        >
          <Plus className="w-3 h-3" />
          Add
        </button>
      </div>

      {/* Empty state */}
      {items.length === 0 && (
        <div className="py-5 border-2 border-dashed border-slate-200 rounded-lg text-center">
          <div className="text-[11px] font-semibold text-slate-500">No items yet</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Click Add to get started.</div>
        </div>
      )}

      {/* Items */}
      <div className="space-y-1.5">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="bg-slate-50/60 border border-slate-200 rounded-lg p-2.5 hover:border-[#00B8C6]/35 transition-all"
          >
            {/* Top row: drag handle + (phase#) + title + delete */}
            <div className={`grid gap-2 items-start ${numberField ? 'grid-cols-[16px_52px_1fr_24px]' : 'grid-cols-[16px_1fr_24px]'}`}>
              {/* Drag handle */}
              <div className="flex items-center justify-center h-7 text-slate-300">
                <GripVertical className="w-3 h-3" />
              </div>

              {/* Phase number (optional) */}
              {numberField && (
                <div>
                  <div className={lbl}>{numberField.label}</div>
                  <input
                    type="number"
                    min={1}
                    value={(item as unknown as Record<string, number | undefined>)[numberField.key] ?? ''}
                    onChange={(e) => updateItem(idx, { [numberField.key]: Number(e.target.value) })}
                    className={inp}
                  />
                </div>
              )}

              {/* Title */}
              <div>
                <div className={lbl}>Title</div>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => updateItem(idx, { title: e.target.value })}
                  placeholder="Enter title"
                  className={inp}
                />
              </div>

              {/* Delete */}
              <div className="flex justify-center pt-4">
                <button
                  type="button"
                  onClick={() => removeItem(idx)}
                  className="p-1 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-md transition-all"
                  title="Delete"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Bullet points */}
            <div className="mt-2 ml-5 space-y-1.5">
              <div className={lbl}>Bullet Points</div>

              {((item.description as string[]) ?? []).map((pt, pi) => (
                <div key={pi} className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 flex-shrink-0" />
                  <input
                    type="text"
                    value={pt}
                    onChange={(e) => updatePoint(idx, pi, e.target.value)}
                    placeholder="Bullet point text"
                    className="flex-1 h-7 px-2.5 rounded-md border border-slate-200 bg-white text-[11.5px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#00B8C6] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => removePoint(idx, pi)}
                    className="p-1 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-md transition-colors flex-shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {/* Add Point — full-width dashed, impossible to miss */}
              <button
                type="button"
                onClick={() => addPoint(idx)}
                className="w-full flex items-center justify-center gap-1.5 h-8 rounded-md border border-dashed border-[#00B8C6]/50 text-[#00B8C6] text-[11px] font-semibold hover:bg-[#00B8C6]/5 hover:border-[#00B8C6] transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Point
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}