'use client';

import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

export default function ImageUpload({
  value,
  onChange,
  label,
  className = '',
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
        toast.success('Image uploaded successfully');
      } else {
        toast.error('Failed to upload image');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('An error occurred during upload');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">{label}</label>}
      
      <div className="relative group">
        {value ? (
          <div className="relative w-full aspect-video rounded-xl border border-gray-100 overflow-hidden bg-gray-50">
            <img src={value} alt="Uploaded" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 bg-white/20 backdrop-blur-md rounded-lg text-white hover:bg-white/30 transition-all"
                title="Change Image"
              >
                <Upload className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onChange('')}
                className="p-2 bg-white/20 backdrop-blur-md rounded-lg text-white hover:bg-rose-500 transition-all"
                title="Remove Image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full aspect-video rounded-xl border-2 border-dashed border-gray-100 hover:border-blue-500 hover:bg-blue-50 transition-all flex flex-col items-center justify-center gap-2 group"
          >
            {uploading ? (
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            ) : (
              <>
                <div className="p-3 rounded-full bg-gray-50 group-hover:bg-blue-100 transition-all">
                  <Upload className="w-6 h-6 text-gray-400 group-hover:text-blue-500" />
                </div>
                <p className="text-xs font-bold text-gray-400 group-hover:text-blue-500 uppercase tracking-widest">
                  Upload {label || 'Image'}
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
