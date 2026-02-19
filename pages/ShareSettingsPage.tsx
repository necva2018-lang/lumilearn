import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Share2, Copy, Check, ChevronLeft, RefreshCw, ToggleLeft, ToggleRight, Eye } from 'lucide-react';
import { useShare, buildShareUrl, buildPreviewUrl } from '../contexts/ShareContext';
import { useHeroCover } from '../contexts/HeroCoverContext';
import type { Course } from '../types';

interface ShareSettingsPageProps {
  courses: Course[];
}

function getCategories(): string[] {
  try {
    const saved = localStorage.getItem('lumilearn_categories');
    const parsed = saved ? JSON.parse(saved) : null;
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch {
    /* ignore */
  }
  return ['程式開發', '設計', '商業', '攝影', '語言', '生活風格'];
}

const ShareSettingsPage: React.FC<ShareSettingsPageProps> = ({ courses }) => {
  const { doPublish, doToggleShare, shareToken, shareEnabled } = useShare();
  const { config: heroCover } = useHeroCover();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handlePublish = async (isUpdate: boolean) => {
    setLoading(true);
    setError(null);
    try {
      const categories = getCategories();
      // 有 token 則更新，無則建立新發布
      const token = await doPublish({
        token: shareToken ?? undefined,
        courses,
        heroCover,
        categories,
        enabled: shareEnabled,
      });
      if (!isUpdate && token) {
        const url = buildShareUrl(token);
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : '發布失敗');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async () => {
    if (!shareToken) return;
    setLoading(true);
    setError(null);
    try {
      await doToggleShare(!shareEnabled);
    } catch (e) {
      setError(e instanceof Error ? e.message : '操作失敗');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!shareToken) return;
    const url = buildShareUrl(shareToken);
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareUrl = shareToken ? buildShareUrl(shareToken) : '';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 mb-8 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          返回首頁
        </Link>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-teal-100 dark:bg-teal-900/40">
                <Share2 className="h-6 w-6 text-teal-600 dark:text-teal-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-slate-100">分享設定</h1>
                <p className="text-sm text-gray-500 dark:text-slate-400">
                  發布網站給他人檢視，分享模式下會隱藏所有編輯功能
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* 預覽按鈕 */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-slate-700/50">
              <div>
                <p className="font-medium text-gray-900 dark:text-slate-100">預覽</p>
                <p className="text-sm text-gray-500 dark:text-slate-400">
                  預覽他人透過分享連結所見的畫面（不含編輯功能）
                </p>
              </div>
              <a
                href={buildPreviewUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 hover:bg-amber-200 dark:hover:bg-amber-900/60 transition-colors"
              >
                <Eye className="h-4 w-4" />
                開啟預覽
              </a>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* 開關分享 */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-slate-700/50">
              <div>
                <p className="font-medium text-gray-900 dark:text-slate-100">分享開關</p>
                <p className="text-sm text-gray-500 dark:text-slate-400">
                  {shareEnabled ? '他人可透過分享連結檢視' : '已關閉，連結將無法存取'}
                </p>
              </div>
              <button
                onClick={handleToggle}
                disabled={!shareToken || loading}
                className="text-3xl text-gray-400 hover:text-teal-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title={shareEnabled ? '點擊關閉' : '點擊開啟'}
              >
                {shareEnabled ? <ToggleRight className="text-teal-500" /> : <ToggleLeft />}
              </button>
            </div>

            {/* 發布與更新 */}
            <div className="flex gap-3">
              <button
                onClick={() => handlePublish(false)}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white font-medium transition-colors"
              >
                {loading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Share2 className="h-4 w-4" />
                )}
                {shareToken ? '重新發布' : '首次發布'}
              </button>
              {shareToken && (
                <button
                  onClick={() => handlePublish(true)}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-teal-600 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors disabled:opacity-60"
                  title="更新分享內容為目前的課程與封面設定"
                >
                  <RefreshCw className="h-4 w-4" />
                  更新
                </button>
              )}
            </div>

            {/* 分享連結 */}
            {shareUrl && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700 dark:text-slate-300">分享連結</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 text-sm text-gray-700 dark:text-slate-300 truncate"
                  />
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 hover:bg-teal-200 dark:hover:bg-teal-900/60 transition-colors"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? '已複製' : '複製'}
                  </button>
                </div>
              </div>
            )}

            <p className="text-xs text-gray-500 dark:text-slate-400">
              透過此連結檢視的人將無法看到「封面編輯」「我要開課」及課程的「編輯」按鈕。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareSettingsPage;
