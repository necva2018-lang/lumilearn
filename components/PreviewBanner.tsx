import React from 'react';
import { Eye, X } from 'lucide-react';
import { useShare } from '../contexts/ShareContext';

const PreviewBanner: React.FC = () => {
  const { isPreviewMode, exitPreview } = useShare();
  if (!isPreviewMode) return null;

  return (
    <div className="sticky top-0 z-[100] flex items-center justify-between gap-4 px-4 py-2 bg-amber-500 text-amber-950 text-sm font-medium shadow-md">
      <div className="flex items-center gap-2">
        <Eye className="h-4 w-4" />
        <span>預覽模式 — 此為他人透過分享連結所見之畫面</span>
      </div>
      <button
        onClick={exitPreview}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600/80 hover:bg-amber-600 text-amber-950 font-semibold transition-colors"
      >
        <X className="h-4 w-4" />
        結束預覽
      </button>
    </div>
  );
};

export default PreviewBanner;
