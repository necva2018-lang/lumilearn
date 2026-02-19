import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { publish, fetchSharedData, toggleShare, PublishPayload, SharedData } from '../services/shareService';

const STORAGE_KEY = 'lumilearn_share_token';

function getShareTokenFromUrl(): string | null {
  return new URLSearchParams(window.location.search).get('share');
}

function isPreviewModeFromUrl(): boolean {
  return new URLSearchParams(window.location.search).get('preview') === '1';
}

interface ShareContextType {
  /** 是否為分享檢視模式（訪客透過分享連結進入） */
  isSharedView: boolean;
  /** 是否為預覽模式（站長預覽他人所見畫面，使用目前本地資料） */
  isPreviewMode: boolean;
  /** 僅檢視模式：分享或預覽，均隱藏編輯功能 */
  isViewOnly: boolean;
  /** 分享檢視時的資料（courses, heroCover） */
  sharedData: SharedData | null;
  /** 載入中 */
  loading: boolean;
  /** 分享錯誤訊息 */
  error: string | null;
  /** 發布／更新：將目前內容發布為分享 */
  doPublish: (payload: PublishPayload) => Promise<string>;
  /** 開關分享（啟用/關閉） */
  doToggleShare: (enabled: boolean) => Promise<void>;
  /** 本地儲存的 token（用於顯示分享連結、開關） */
  shareToken: string | null;
  /** 分享是否啟用（由 API 回傳，或本地推斷） */
  shareEnabled: boolean;
  /** 結束預覽模式 */
  exitPreview: () => void;
}

const ShareContext = createContext<ShareContextType | undefined>(undefined);

export function ShareProvider({ children }: { children: React.ReactNode }) {
  const [shareTokenFromUrl, setShareTokenFromUrl] = useState<string | null>(() => getShareTokenFromUrl());
  const [sharedData, setSharedData] = useState<SharedData | null>(null);
  const [loading, setLoading] = useState(!!getShareTokenFromUrl());
  const [error, setError] = useState<string | null>(null);
  const [localToken, setLocalToken] = useState<string | null>(() => localStorage.getItem(STORAGE_KEY));
  const [shareEnabled, setShareEnabled] = useState(true);
  const [previewMode, setPreviewMode] = useState(() => isPreviewModeFromUrl());

  const isSharedView = !!shareTokenFromUrl;
  const isPreviewMode = !!previewMode;
  const isViewOnly = isSharedView || isPreviewMode;

  // 監聽 URL 變化（如前進/後退）
  useEffect(() => {
    const check = () => {
      setShareTokenFromUrl(getShareTokenFromUrl());
      setPreviewMode(isPreviewModeFromUrl());
    };
    check();
    window.addEventListener('popstate', check);
    return () => window.removeEventListener('popstate', check);
  }, []);

  // 從 localStorage 同步 token（其他分頁可能變更）
  useEffect(() => {
    const synced = localStorage.getItem(STORAGE_KEY);
    setLocalToken(synced);
  }, []);

  // 當有分享 token 時，從 API 取得資料
  useEffect(() => {
    if (!shareTokenFromUrl) {
      setSharedData(null);
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    fetchSharedData(shareTokenFromUrl)
      .then(setSharedData)
      .catch((e) => setError(e.message || '載入失敗'))
      .finally(() => setLoading(false));
  }, [shareTokenFromUrl]);

  const doPublish = useCallback(async (payload: PublishPayload): Promise<string> => {
    const result = await publish(payload);
    setLocalToken(result.token);
    localStorage.setItem(STORAGE_KEY, result.token);
    setShareEnabled(result.enabled);
    return result.token;
  }, []);

  const doToggleShare = useCallback(async (enabled: boolean) => {
    const token = localToken;
    if (!token) throw new Error('請先發布');
    await toggleShare(token, enabled);
    setShareEnabled(enabled);
  }, [localToken]);

  const exitPreview = useCallback(() => {
    const url = new URL(window.location.href);
    url.searchParams.delete('preview');
    window.location.href = url.pathname + url.search + (url.hash || '#/');
  }, []);

  return (
    <ShareContext.Provider
      value={{
        isSharedView,
        isPreviewMode,
        isViewOnly,
        sharedData,
        loading,
        error,
        doPublish,
        doToggleShare,
        shareToken: localToken,
        shareEnabled,
        exitPreview,
      }}
    >
      {children}
    </ShareContext.Provider>
  );
}

export function useShare() {
  const ctx = useContext(ShareContext);
  if (!ctx) throw new Error('useShare must be used within ShareProvider');
  return ctx;
}

export function buildShareUrl(token: string): string {
  const base = window.location.origin + window.location.pathname;
  return `${base}?share=${encodeURIComponent(token)}#/`;
}

export function buildPreviewUrl(): string {
  const base = window.location.origin + window.location.pathname;
  return `${base}?preview=1#/`;
}

