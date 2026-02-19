const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export interface PublishPayload {
  token?: string;
  courses: unknown[];
  heroCover: Record<string, unknown>;
  categories: string[];
  enabled?: boolean;
}

export interface PublishResult {
  token: string;
  enabled: boolean;
}

export interface SharedData {
  courses: unknown[];
  heroCover: Record<string, unknown>;
  categories: string[];
  updatedAt: string;
}

export async function publish(payload: PublishPayload): Promise<PublishResult> {
  const res = await fetch(`${API_BASE}/api/publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `發布失敗: ${res.status}`);
  }
  return res.json();
}

export async function fetchSharedData(token: string): Promise<SharedData> {
  const res = await fetch(`${API_BASE}/api/publish/${encodeURIComponent(token)}`);
  if (!res.ok) {
    if (res.status === 404) throw new Error('找不到分享');
    if (res.status === 403) throw new Error('此分享已關閉');
    throw new Error(`載入失敗: ${res.status}`);
  }
  return res.json();
}

export async function toggleShare(token: string, enabled: boolean): Promise<{ token: string; enabled: boolean }> {
  const res = await fetch(`${API_BASE}/api/publish/${encodeURIComponent(token)}/toggle`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ enabled }),
  });
  if (!res.ok) throw new Error(`操作失敗: ${res.status}`);
  return res.json();
}
