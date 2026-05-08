'use client';

import { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
  /** Renders a short fixed-height box instead of a 16:9 aspect-ratio block */
  compact?: boolean;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

export default function ImageUpload({
  value,
  onChange,
  label,
  className = '',
  compact = false,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`${BACKEND_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        onChange(data.url);
        toast.success('Image uploaded');
      } else {
        toast.error('Failed to upload image');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload error');
    } finally {
      setUploading(false);
    }
  };

  const containerCls = compact
    ? 'h-[130px] rounded-xl'
    : 'aspect-video rounded-xl';

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          {label}
        </label>
      )}

      <div className="relative group">
        {value ? (
          <div className={`relative w-full ${containerCls} border border-gray-200 overflow-hidden bg-gray-50`}>
            <img src={value} alt="Uploaded" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-1.5 bg-white/20 backdrop-blur-md rounded-lg text-white hover:bg-white/30 transition-all"
                title="Change"
              >
                <Upload className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onChange('')}
                className="p-1.5 bg-white/20 backdrop-blur-md rounded-lg text-white hover:bg-rose-500 transition-all"
                title="Remove"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className={`w-full ${containerCls} border-2 border-dashed border-gray-200 hover:border-[#00B8C6]/50 hover:bg-[#00B8C6]/5 transition-all flex flex-col items-center justify-center gap-1.5 group`}
          >
            {uploading ? (
              <Loader2 className="w-6 h-6 text-[#00B8C6] animate-spin" />
            ) : (
              <>
                <div className={`${compact ? 'p-2' : 'p-3'} rounded-full bg-gray-100 group-hover:bg-[#00B8C6]/10 transition-all`}>
                  <Upload className={`${compact ? 'w-4 h-4' : 'w-5 h-5'} text-gray-400 group-hover:text-[#00B8C6]`} />
                </div>
                <p className={`${compact ? 'text-[10px]' : 'text-xs'} font-semibold text-gray-400 group-hover:text-[#00B8C6] uppercase tracking-wide`}>
                  {compact ? 'Upload Image' : `Upload ${label || 'Image'}`}
                </p>
              </>
            )}
          </button>
        )}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleUpload}
          className="hidden"
          accept="image/*"
        />
      </div>
    </div>
  );
}
