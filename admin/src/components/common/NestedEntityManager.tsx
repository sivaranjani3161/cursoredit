'use client';

import { Plus, Trash2, GripVertical, Upload, X } from 'lucide-react';
import { useState, useRef } from 'react';
import { toast } from 'react-hot-toast';

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
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

export default function NestedEntityManager({
  title,
  items,
  onChange,
  showIcon = false,
}: Props) {
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addItem = () => {
    onChange([...items, { title: '', description: [], sortOrder: items.length }]);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    onChange(newItems);
  };

  const handleIconUpload = async (index: number, file: File) => {
    try {
      setUploadingIdx(index);
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`${BACKEND_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        updateItem(index, 'icon', data.url);
        toast.success('Icon uploaded');
      } else {
        toast.error('Upload failed');
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred');
    } finally {
      setUploadingIdx(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">{title}</h3>
        <button
          type="button"
          onClick={addItem}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-[#0066FF] hover:bg-blue-100 rounded-lg text-xs font-bold transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Item
        </button>
      </div>

      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="p-8 border-2 border-dashed border-gray-100 rounded-xl text-center text-gray-400 text-sm">
            No {title.toLowerCase()} added yet.
          </div>
        ) : (
          items.map((item, index) => (
            <div
              key={index}
              className="group flex gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-blue-200 transition-all"
            >
              <div className="flex-shrink-0 flex items-center justify-center text-gray-300">
                <GripVertical className="w-5 h-5" />
              </div>
              
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Title</label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => updateItem(index, 'title', e.target.value)}
                      placeholder="Enter title"
                      className="w-full px-3 py-2 rounded-lg border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 text-sm transition-all"
                    />
                  </div>

                  {showIcon && (
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Icon</label>
                      <div className="flex items-center gap-3">
                        {item.icon ? (
                          <div className="relative w-10 h-10 rounded-lg border border-gray-100 overflow-hidden bg-gray-50 flex-shrink-0">
                            <img src={item.icon} alt="Icon" className="w-full h-full object-contain p-1" />
                            <button
                              type="button"
                              onClick={() => updateItem(index, 'icon', '')}
                              className="absolute inset-0 bg-rose-500/80 text-white opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              const input = document.createElement('input');
                              input.type = 'file';
                              input.accept = 'image/*';
                              input.onchange = (e: any) => {
                                const file = e.target.files?.[0];
                                if (file) handleIconUpload(index, file);
                              };
                              input.click();
                            }}
                            disabled={uploadingIdx === index}
                            className="w-10 h-10 rounded-lg border-2 border-dashed border-gray-100 flex items-center justify-center text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-all flex-shrink-0"
                          >
                            {uploadingIdx === index ? <Plus className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                          </button>
                        )}
                        <span className="text-[10px] text-gray-400">Click to upload icon</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center justify-between">
                    <span>Bullet Points (Description)</span>
                    <button
                      type="button"
                      onClick={() => {
                        const newPoints = [...(item.description || [])];
                        newPoints.push('');
                        updateItem(index, 'description', newPoints);
                      }}
                      className="text-[10px] text-[#0066FF] hover:underline"
                    >
                      + Add Point
                    </button>
                  </label>
                  
                  <div className="space-y-2">
                    {(item.description || []).map((point, pIdx) => (
                      <div key={pIdx} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                        <input
                          type="text"
                          value={point}
                          onChange={(e) => {
                            const newPoints = [...(item.description || [])];
                            newPoints[pIdx] = e.target.value;
                            updateItem(index, 'description', newPoints);
                          }}
                          placeholder="Enter a bullet point..."
                          className="flex-1 bg-gray-50/50 border-none focus:ring-0 text-xs py-1 px-2 rounded hover:bg-gray-100 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newPoints = (item.description || []).filter((_, i) => i !== pIdx);
                            updateItem(index, 'description', newPoints);
                          }}
                          className="text-gray-300 hover:text-rose-500 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    {(item.description || []).length === 0 && (
                      <p className="text-[10px] text-gray-400 italic">No points added yet</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0 flex items-start">
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="p-2 text-gray-200 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
