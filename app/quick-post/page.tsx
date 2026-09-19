'use client';

import { useState, useEffect } from 'react';
import { Upload, Loader2, Linkedin, Twitter, Facebook, MessageCircle, X } from 'lucide-react';

export default function QuickPostPage() {
  const [text, setText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [siteUrl, setSiteUrl] = useState('');

  useEffect(() => {
    setSiteUrl(window.location.origin);
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) setImageUrl(data.url);
    } catch {
      // ignore — image is optional
    } finally {
      setIsUploading(false);
    }
  };

  const viewUrl = siteUrl
    ? `${siteUrl}/quick-post/view?${new URLSearchParams({ text, ...(imageUrl ? { image: imageUrl } : {}) }).toString()}`
    : '';

  const linkedInUrl = viewUrl ? `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(viewUrl)}` : '';
  const facebookUrl = viewUrl ? `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(viewUrl)}` : '';
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;

  const hasContent = text.trim().length > 0;

  return (
    <main className="min-h-screen bg-[#f4f6f8] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-3xl border border-black/10 shadow-xl p-6 sm:p-8 space-y-5">
        <div>
          <h1 className="text-xl font-bold text-[#0f172a]">Quick Post</h1>
          <p className="text-xs text-[#64748b] mt-1">Nothing is saved — write, then share directly.</p>
        </div>

        <div>
          <textarea
            rows={5}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full px-4 py-3 rounded-xl border border-black/15 bg-[#f8fafc] text-sm text-[#1e293b] placeholder:text-[#94a3b8] focus:outline-none focus:border-black/40 transition-colors resize-none"
          />
        </div>

        <div>
          {imageUrl ? (
            <div className="relative w-full h-40 rounded-xl overflow-hidden border border-black/10 bg-black/5">
              <img src={imageUrl} alt="Preview" className="w-full h-full object-contain" />
              <button
                onClick={() => setImageUrl('')}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-black/5 hover:bg-black/10 text-[#1e293b] text-xs font-medium transition-colors">
              {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
              <span>{isUploading ? 'Uploading...' : 'Add Photo (optional)'}</span>
              <input type="file" accept="image/*" disabled={isUploading} onChange={handleFileUpload} className="hidden" />
            </label>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2.5 pt-2">
          <a
            href={hasContent ? linkedInUrl : undefined}
            target="_blank" rel="noopener noreferrer"
            aria-disabled={!hasContent}
            className={`flex items-center justify-center gap-2 py-3 rounded-xl text-white text-sm font-semibold transition-colors ${
              hasContent ? 'bg-[#0A66C2] hover:bg-[#004182]' : 'bg-[#0A66C2]/30 pointer-events-none'
            }`}
          >
            <Linkedin className="w-4 h-4" /> LinkedIn
          </a>
          <a
            href={hasContent ? facebookUrl : undefined}
            target="_blank" rel="noopener noreferrer"
            aria-disabled={!hasContent}
            className={`flex items-center justify-center gap-2 py-3 rounded-xl text-white text-sm font-semibold transition-colors ${
              hasContent ? 'bg-[#1877F2] hover:bg-[#0d5cbf]' : 'bg-[#1877F2]/30 pointer-events-none'
            }`}
          >
            <Facebook className="w-4 h-4" /> Facebook
          </a>
          <a
            href={hasContent ? twitterUrl : undefined}
            target="_blank" rel="noopener noreferrer"
            aria-disabled={!hasContent}
            className={`flex items-center justify-center gap-2 py-3 rounded-xl text-white text-sm font-semibold transition-colors ${
              hasContent ? 'bg-black hover:bg-black/80' : 'bg-black/30 pointer-events-none'
            }`}
          >
            <Twitter className="w-4 h-4" /> X
          </a>
          <a
            href={hasContent ? whatsappUrl : undefined}
            target="_blank" rel="noopener noreferrer"
            aria-disabled={!hasContent}
            className={`flex items-center justify-center gap-2 py-3 rounded-xl text-white text-sm font-semibold transition-colors ${
              hasContent ? 'bg-[#25D366] hover:bg-[#1DA851]' : 'bg-[#25D366]/30 pointer-events-none'
            }`}
          >
            <MessageCircle className="w-4 h-4" /> WhatsApp
          </a>
        </div>

        {imageUrl && (
          <p className="text-[11px] text-[#94a3b8] text-center">
            LinkedIn/Facebook will show your photo as a preview card. X/WhatsApp post text only.
          </p>
        )}
      </div>
    </main>
  );
}
