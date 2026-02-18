import { Course } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export const generateCourseAssistantResponse = async (
  history: { role: 'user' | 'model'; text: string }[],
  course: Course,
  userMessage: string
): Promise<string> => {
  try {
    const res = await fetch(`${API_BASE}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ history, course, userMessage }),
    });
    if (!res.ok) throw new Error(`API 錯誤: ${res.status}`);
    const data = await res.json();
    return data.text ?? '抱歉，我現在無法產生回應。';
  } catch (error) {
    console.error('AI Chat API Error:', error);
    return '抱歉，目前連線到 AI 服務時發生問題，請稍後再試。';
  }
};

export const generateCourseDescription = async (
  title: string,
  category: string,
  level: string
): Promise<string> => {
  try {
    const res = await fetch(`${API_BASE}/api/generate-description`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, category, level }),
    });
    if (!res.ok) throw new Error(`API 錯誤: ${res.status}`);
    const data = await res.json();
    return data.text ?? '';
  } catch (error) {
    console.error('AI Generate Description Error:', error);
    throw new Error('AI 產生失敗，請稍後再試。');
  }
};