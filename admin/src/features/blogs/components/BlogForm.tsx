'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Save, X, Info, FileText, Bold, Italic, Underline as UnderlineIcon, List, ListOrdered, Quote, Heading2, Heading3, Link as LinkIcon, Undo, Redo, Code, Minus } from 'lucide-react';
import ImageUpload from '@/shared/components/ImageUpload';
import type { ApiBlog, BlogFormData } from '@/shared/types';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import UnderlineExt from '@tiptap/extension-underline';
import LinkExt from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { z } from 'zod';
import { useError } from '@/shared/context/ErrorContext';

const blogSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  excerpt: z.string().optional(),
  content: z.string().min(1, 'Content is required').refine((val) => val !== '<p></p>', 'Content cannot be empty'),
  coverImage: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']),
  publishedAt: z.string().optional(),
  tags: z.array(z.string()),
  relatedBlogIds: z.array(z.number()),
});

interface BlogFormProps {
  initialData?: ApiBlog;
  existingBlogs: ApiBlog[];
  onSave: (value: BlogFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

const inp = 'w-full h-7 px-2 rounded border border-slate-200 bg-slate-50 text-[11px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#00B8C6] focus:bg-white transition-colors';
const lbl = 'block text-[9px] font-bold uppercase tracking-wide text-slate-400 mb-0.5';

const SIDEBAR_WIDTH = 262;
const TOP_OFFSET    = 12;
const RIGHT_OFFSET  = 12;
const BOTTOM_OFFSET = 12;

/* ── Toolbar button ── */
function ToolBtn({
  onClick, active, title, children,
}: { onClick: () => void; active?: boolean; title: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      title={title}
      className={`p-1.5 rounded transition-all ${
        active
          ? 'bg-[#00B8C6] text-white shadow-sm'
          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
      }`}
    >
      {children}
    </button>
  );
}

/* ── Toolbar divider ── */
const Div = () => <span className="w-px h-4 bg-slate-200 mx-0.5 self-center flex-shrink-0" />;

import type { Editor } from '@tiptap/react';

function EditorToolbar({ editor }: { editor: Editor | null }) {
  if (!editor) return null;

  const setLink = () => {
    const prev = editor.getAttributes('link').href;
    const url  = window.prompt('URL', prev ?? 'https://');
    if (url === null) return;
    if (url === '') { editor.chain().focus().extendMarkRange('link').unsetLink().run(); return; }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-slate-200 bg-slate-50/80">
      {/* History */}
      <ToolBtn onClick={() => editor.chain().focus().undo().run()} title="Undo"><Undo className="w-3.5 h-3.5" /></ToolBtn>
      <ToolBtn onClick={() => editor.chain().focus().redo().run()} title="Redo"><Redo className="w-3.5 h-3.5" /></ToolBtn>
      <Div />
      {/* Headings */}
      <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Heading 2"><Heading2 className="w-3.5 h-3.5" /></ToolBtn>
      <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Heading 3"><Heading3 className="w-3.5 h-3.5" /></ToolBtn>
      <Div />
      {/* Inline */}
      <ToolBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold"><Bold className="w-3.5 h-3.5" /></ToolBtn>
      <ToolBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic"><Italic className="w-3.5 h-3.5" /></ToolBtn>
      <ToolBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline"><UnderlineIcon className="w-3.5 h-3.5" /></ToolBtn>
      <ToolBtn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} title="Inline code"><Code className="w-3.5 h-3.5" /></ToolBtn>
      <ToolBtn onClick={setLink} active={editor.isActive('link')} title="Link"><LinkIcon className="w-3.5 h-3.5" /></ToolBtn>
      <Div />
      {/* Blocks */}
      <ToolBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet list"><List className="w-3.5 h-3.5" /></ToolBtn>
      <ToolBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Ordered list"><ListOrdered className="w-3.5 h-3.5" /></ToolBtn>
      <ToolBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Blockquote"><Quote className="w-3.5 h-3.5" /></ToolBtn>
      <ToolBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Divider"><Minus className="w-3.5 h-3.5" /></ToolBtn>
    </div>
  );
}

export default function BlogForm({ initialData, existingBlogs, onSave, onCancel, loading }: BlogFormProps) {
  const { setError } = useError();
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    title:          '',
    slug:           '',
    excerpt:        '',
    coverImage:     '',
    status:         'DRAFT',
    publishedAt:    '',
    tagsInput:      '',
    relatedBlogIds: [] as number[],
  });

  /* ── Tiptap editor ── */
  const editor = useEditor({
      immediatelyRender: false,
    extensions: [
      StarterKit,
      UnderlineExt,
      LinkExt.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: 'Write blog content here…' }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none px-4 py-3 min-h-[180px] text-slate-800',
      },
    },
  });

  useEffect(() => {
    setMounted(true);
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = original; };
  }, []);

  useEffect(() => {
    if (!initialData) return;
    setFormData({
      title:          initialData.title         ?? '',
      slug:           initialData.slug          ?? '',
      excerpt:        initialData.excerpt        ?? '',
      coverImage:     initialData.coverImage     ?? '',
      status:         initialData.status         ?? 'DRAFT',
      publishedAt:    initialData.publishedAt    ? String(initialData.publishedAt).slice(0, 10) : '',
      tagsInput:      Array.isArray(initialData.tags) ? initialData.tags.join(', ') : '',
      relatedBlogIds: Array.isArray(initialData.relatedBlogIds) ? initialData.relatedBlogIds : [],
    });
    // Set editor content once editor is ready
    if (editor && initialData.content) {
      editor.commands.setContent(initialData.content);
    }
  }, [initialData, editor]);

  const relatedCandidates = existingBlogs.filter((b) => b.id !== initialData?.id);

  const generateSlug = (title: string) =>
    title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tags = formData.tagsInput.split(',').map((t) => t.trim()).filter(Boolean);
    const payload = {
      title:          formData.title,
      slug:           formData.slug,
      excerpt:        formData.excerpt      || '',
      content:        editor?.getHTML()     ?? '',
      coverImage:     formData.coverImage   || '',
      status:         formData.status.toLowerCase() as any,
      publishedAt:    formData.publishedAt  || '',
      tags,
      relatedBlogIds: formData.relatedBlogIds,
    };

    const parsed = blogSchema.safeParse(payload);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || 'Validation failed');
      return;
    }

    onSave(parsed.data as any);
  };

  if (!mounted) return null;

  const FooterButtons = () => (
    <>
      <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg text-[12px] font-medium text-slate-600 hover:bg-slate-100 transition-colors">
        Cancel
      </button>
      <button
        form="blog-form"
        type="submit"
        disabled={loading}
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#00B8C6] text-white text-[12px] font-semibold hover:bg-[#00a3b0] transition-colors disabled:opacity-50 shadow-sm"
      >
        {loading
          ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          : <Save className="w-3.5 h-3.5" />
        }
        {initialData ? 'Update Blog' : 'Create Blog'}
      </button>
    </>
  );

  return createPortal(
    <>
      {/* Tablet backdrop */}
      <div
        className="fixed inset-0 z-[59] bg-black/30 backdrop-blur-sm hidden md:block lg:hidden"
        onClick={onCancel}
      />
      {/* Desktop backdrop */}
      <div
        className="fixed z-[59] bg-black/20 backdrop-blur-[1px] hidden lg:block"
        style={{ left: SIDEBAR_WIDTH, top: TOP_OFFSET, right: RIGHT_OFFSET, bottom: BOTTOM_OFFSET, borderRadius: 10 }}
        onClick={onCancel}
      />

      <div
        className="
          fixed z-[60] bg-white border border-slate-200 shadow-2xl overflow-hidden
          flex flex-col
          inset-0 rounded-none
          md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2
          md:w-[700px] md:max-h-[90dvh] md:rounded-2xl
          lg:translate-x-0 lg:translate-y-0 lg:rounded-[10px]
        "
        ref={(el) => {
          if (!el) return;
          if (window.innerWidth >= 1024) {
            el.style.left      = `${SIDEBAR_WIDTH}px`;
            el.style.top       = `${TOP_OFFSET}px`;
            el.style.right     = `${RIGHT_OFFSET}px`;
            el.style.bottom    = `${BOTTOM_OFFSET}px`;
            el.style.width     = 'auto';
            el.style.maxHeight = 'none';
            el.style.transform = 'none';
          }
        }}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-4 h-11 border-b border-slate-100 bg-white flex-shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-[3px] h-3.5 rounded-full bg-[#00B8C6] flex-shrink-0" />
            <FileText className="w-3.5 h-3.5 text-[#00B8C6] flex-shrink-0" />
            <h2 className="text-[13px] font-bold text-slate-800 flex-shrink-0">
              {initialData ? 'Edit Blog' : 'New Blog'}
            </h2>
            <span className="text-[10.5px] text-slate-400 font-normal truncate hidden sm:block">
              Metadata · Content · Tags
            </span>
          </div>
          <button onClick={onCancel} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors flex-shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <form
          id="blog-form"
          onSubmit={handleSubmit}
          className="flex-1 min-h-0 flex flex-col overflow-y-auto sm:overflow-hidden"
        >
          {/* ── Meta section ── */}
          <div className="flex-shrink-0 border-b border-slate-100 bg-slate-50/40 px-3 sm:px-4 py-3">

            {/* Mobile layout */}
            <div className="flex flex-col sm:hidden gap-3">
              <div>
                <label className={lbl}>Title <span className="text-rose-400">*</span></label>
                <input required value={formData.title} onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value, slug: generateSlug(e.target.value) }))} placeholder="Blog title…" className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-[13px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#00B8C6] focus:bg-white transition-colors" />
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className={lbl}>Status</label>
                  <select value={formData.status} onChange={(e) => setFormData((p) => ({ ...p, status: e.target.value }))} className="w-full h-10 px-2 rounded-lg border border-slate-200 bg-slate-50 text-[12px] text-slate-900 focus:outline-none focus:border-[#00B8C6] transition-colors">
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>
                <div>
                  <label className={lbl}>Published Date</label>
                  <input type="date" value={formData.publishedAt} onChange={(e) => setFormData((p) => ({ ...p, publishedAt: e.target.value }))} className="w-full h-10 px-2 rounded-lg border border-slate-200 bg-slate-50 text-[12px] text-slate-900 focus:outline-none focus:border-[#00B8C6] transition-colors" />
                </div>
              </div>
              <div>
                <label className={lbl}>Slug <span className="text-rose-400">*</span></label>
                <div className="relative">
                  <input required value={formData.slug} onChange={(e) => setFormData((p) => ({ ...p, slug: e.target.value }))} className="w-full h-10 px-3 pr-9 rounded-lg border border-slate-200 bg-slate-50 text-[12px] font-mono text-slate-900 focus:outline-none focus:border-[#00B8C6] transition-colors" placeholder="auto-generated" />
                  <Info className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300" />
                </div>
              </div>
              <div>
                <label className={lbl}>Tags <span className="text-slate-300 font-normal normal-case">(comma separated)</span></label>
                <input value={formData.tagsInput} onChange={(e) => setFormData((p) => ({ ...p, tagsInput: e.target.value }))} placeholder="design, web, development…" className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-[12px] text-slate-900 focus:outline-none focus:border-[#00B8C6] transition-colors" />
              </div>
              <div>
                <label className={lbl}>Excerpt</label>
                <textarea value={formData.excerpt} rows={3} onChange={(e) => setFormData((p) => ({ ...p, excerpt: e.target.value }))} placeholder="Short summary for listings and SEO…" className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-[12px] text-slate-900 placeholder:text-slate-400 resize-none focus:outline-none focus:border-[#00B8C6] focus:bg-white transition-colors leading-relaxed" />
              </div>
              <div>
                <label className={lbl}>Cover Image</label>
                <div className="h-[110px] rounded-lg border border-slate-200 overflow-hidden bg-slate-50">
                  <ImageUpload compact value={formData.coverImage} onChange={(url) => setFormData((p) => ({ ...p, coverImage: url }))} />
                </div>
              </div>
            </div>

            {/* sm+ layout */}
            <div className="hidden sm:flex gap-3 items-start">
              <div className="flex-1 grid grid-cols-3 gap-x-2.5 gap-y-2 min-w-0">
                <div className="col-span-2">
                  <label className={lbl}>Title <span className="text-rose-400">*</span></label>
                  <input required value={formData.title} onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value, slug: generateSlug(e.target.value) }))} placeholder="Enter blog title…" className={inp} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className={lbl}>Status</label>
                    <select value={formData.status} onChange={(e) => setFormData((p) => ({ ...p, status: e.target.value }))} className={inp}>
                      <option value="DRAFT">Draft</option>
                      <option value="PUBLISHED">Published</option>
                      <option value="ARCHIVED">Archived</option>
                    </select>
                  </div>
                  <div>
                    <label className={lbl}>Published Date</label>
                    <input type="date" value={formData.publishedAt} onChange={(e) => setFormData((p) => ({ ...p, publishedAt: e.target.value }))} className={inp} />
                  </div>
                </div>
                <div className="col-span-2">
                  <label className={lbl}>Slug <span className="text-rose-400">*</span></label>
                  <div className="relative">
                    <input required value={formData.slug} onChange={(e) => setFormData((p) => ({ ...p, slug: e.target.value }))} className={`${inp} pr-6 font-mono`} placeholder="auto-generated-from-title" />
                    <Info className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-300" />
                  </div>
                </div>
                <div>
                  <label className={lbl}>Tags <span className="text-slate-300 font-normal normal-case">(comma)</span></label>
                  <input value={formData.tagsInput} onChange={(e) => setFormData((p) => ({ ...p, tagsInput: e.target.value }))} placeholder="design, web…" className={inp} />
                </div>
                <div className="col-span-2">
                  <label className={lbl}>Excerpt</label>
                  <textarea value={formData.excerpt} rows={2} onChange={(e) => setFormData((p) => ({ ...p, excerpt: e.target.value }))} placeholder="Short summary for listings and SEO…" className="w-full px-2 py-1.5 rounded border border-slate-200 bg-slate-50 text-[11px] text-slate-900 placeholder:text-slate-400 resize-none focus:outline-none focus:border-[#00B8C6] focus:bg-white transition-colors leading-relaxed" />
                </div>
                <div>
                  <label className={lbl}>Related Blogs</label>
                  {relatedCandidates.length === 0 ? (
                    <div className="h-[46px] flex items-center px-2 rounded border border-dashed border-slate-200 text-[10px] text-slate-400 italic">No other blogs</div>
                  ) : (
                    <div className="h-[46px] overflow-y-auto rounded border border-slate-200 bg-slate-50 px-2 py-1 space-y-0.5">
                      {relatedCandidates.map((item) => (
                        <label key={item.id} className="flex items-center gap-1.5 text-[10px] text-slate-700 cursor-pointer hover:text-slate-900">
                          <input
                            type="checkbox"
                            checked={formData.relatedBlogIds.includes(item.id)}
                            onChange={(e) => setFormData((p) => ({
                              ...p,
                              relatedBlogIds: e.target.checked ? [...p.relatedBlogIds, item.id] : p.relatedBlogIds.filter((id) => id !== item.id),
                            }))}
                            className="accent-[#00B8C6] flex-shrink-0"
                          />
                          <span className="truncate">{item.title}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-shrink-0 w-[130px]">
                <label className={lbl}>Cover Image</label>
                <div className="h-[112px] rounded border border-slate-200 overflow-hidden bg-slate-50">
                  <ImageUpload compact value={formData.coverImage} onChange={(url) => setFormData((p) => ({ ...p, coverImage: url }))} />
                </div>
              </div>
            </div>
          </div>

          {/* ── WYSIWYG Editor ── */}
          <div className="flex flex-col px-3 sm:px-4 py-2.5 flex-1 min-h-0">
            <label className={`${lbl} mb-1`}>Content <span className="text-rose-400">*</span></label>

            <div className="flex-1 min-h-0 flex flex-col rounded-lg border border-slate-200 overflow-hidden focus-within:border-[#00B8C6] transition-colors">
              {/* Toolbar */}
              <EditorToolbar editor={editor} />

              {/* Editor content area */}
              <div className="flex-1 min-h-0 overflow-y-auto bg-white">
                <EditorContent editor={editor} className="h-full" />
              </div>
            </div>
          </div>

          {/* Mobile footer (inside form) */}
          <div className="flex-shrink-0 px-4 h-12 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50/60 sm:hidden">
            <FooterButtons />
          </div>
        </form>

        {/* sm+ footer (outside form) */}
        <div className="hidden sm:flex flex-shrink-0 px-4 h-12 border-t border-slate-100 items-center justify-end gap-2 bg-slate-50/60">
          <FooterButtons />
        </div>
      </div>

      {/* ── Tiptap prose styles injected globally ── */}
      <style>{`
        .tiptap p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #94a3b8;
          pointer-events: none;
          height: 0;
          font-size: 13px;
        }
        .tiptap { font-size: 13px; line-height: 1.7; color: #1e293b; }
        .tiptap h2 { font-size: 17px; font-weight: 700; margin: 1em 0 0.4em; color: #0f172a; }
        .tiptap h3 { font-size: 14px; font-weight: 700; margin: 0.9em 0 0.3em; color: #0f172a; }
        .tiptap p  { margin: 0 0 0.6em; }
        .tiptap ul { list-style: disc; padding-left: 1.4em; margin: 0.5em 0; }
        .tiptap ol { list-style: decimal; padding-left: 1.4em; margin: 0.5em 0; }
        .tiptap li { margin: 0.15em 0; }
        .tiptap blockquote { border-left: 3px solid #00B8C6; margin: 0.8em 0; padding: 0.4em 1em; background: #f0fffe; border-radius: 0 6px 6px 0; color: #475569; font-style: italic; }
        .tiptap code { background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 4px; padding: 0.1em 0.35em; font-size: 11.5px; font-family: 'JetBrains Mono', 'Fira Code', monospace; color: #0ea5e9; }
        .tiptap hr  { border: none; border-top: 1px solid #e2e8f0; margin: 1em 0; }
        .tiptap a   { color: #00B8C6; text-decoration: underline; }
        .tiptap a:hover { color: #00a3b0; }
      `}</style>
    </>,
    document.body
  );
}