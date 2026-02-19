/**
 * LumiLearn 後端 API
 * 代理 Gemini API 呼叫，保護 API Key 不暴露於前端
 */

import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'node:crypto';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// 環境驗證：啟動時檢查
if (!GEMINI_API_KEY || GEMINI_API_KEY === 'PLACEHOLDER_API_KEY') {
  console.warn(
    '⚠️  警告：GEMINI_API_KEY 未設定或為 placeholder。' +
    'AI 功能將以演示模式運作。請在 Zeabur 環境變數中設定 GEMINI_API_KEY。'
  );
}

app.use(express.json({ limit: '1mb' }));

// CORS（若前後端同源可簡化，保留以支援跨域）
app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// ============ API Routes ============

/**
 * POST /api/chat - 課程 AI 助教對話
 */
app.post('/api/chat', async (req, res) => {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'PLACEHOLDER_API_KEY') {
    return res.json({
      text: '演示模式：後端未設定 GEMINI_API_KEY，無法使用 AI 功能。',
    });
  }

  const { history, course, userMessage } = req.body;

  if (!course || !userMessage) {
    return res.status(400).json({ error: '缺少 course 或 userMessage' });
  }

  const courseContext = `
    你是一位名為 "${course.title}" 線上課程的 AI 助教。
    請使用繁體中文（台灣）回答學生的問題。
    
    課程詳細資訊：
    - 講師：${course.instructor?.name || '講師'}
    - 描述：${course.description}
    - 程度：${course.level}
    - 分類：${course.category}
    - 價格：$${course.price}
    - 評分：${course.rating}/5
    
    課程大綱總覽：
    ${(course.modules || []).map(m => `- 章節：${m.title} (${(m.lessons || []).length} 堂課)`).join('\n')}
    
    你的目標是幫助潛在或現有學生了解這門課程的價值，解釋與課程標題相關的概念，或引導他們查看課程大綱。
    回答要簡潔、鼓勵性強且友善。如果問題與課程主題無關，請禮貌地將話題引導回課程內容。
  `;

  try {
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    const contents = [
      ...(history || []).map(h => ({
        role: h.role,
        parts: [{ text: h.text }],
      })),
      { role: 'user', parts: [{ text: userMessage }] },
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents,
      config: { systemInstruction: courseContext },
    });

    res.json({ text: response.text || '抱歉，我現在無法產生回應。' });
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({
      text: '抱歉，目前連線到 AI 服務時發生問題，請稍後再試。',
    });
  }
});

/**
 * POST /api/generate-description - AI 生成課程描述
 */
app.post('/api/generate-description', async (req, res) => {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'PLACEHOLDER_API_KEY') {
    return res.json({
      text: '（演示模式：請設定 GEMINI_API_KEY 以使用 AI 撰寫功能）這是一門關於 ' +
        (req.body.title || '此課程') + ' 的精彩課程，適合 ' + (req.body.level || '學習者') + ' 的學習者。',
    });
  }

  const { title, category, level } = req.body;

  if (!title) {
    return res.status(400).json({ error: '缺少 title' });
  }

  const prompt = `請為一門線上課程撰寫一段吸引人的課程描述（Course Description）。
      
      課程資訊如下：
      - 課程標題：${title}
      - 課程分類：${category || '未分類'}
      - 適合程度：${level || '入門'}

      撰寫要求：
      1. 使用繁體中文（台灣）。
      2. 語氣專業但充滿熱情，能激發學生的學習動機。
      3. 內容約 150-200 字。
      4. 強調學生將學到什麼，以及這門課的價值。
      5. 不需要任何 Markdown 標題（如 # 或 ##），直接提供純文字段落即可。`;

  try {
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
    });

    res.json({ text: response.text || '' });
  } catch (error) {
    console.error('Gemini Generate Description Error:', error);
    res.status(500).json({ error: 'AI 產生失敗，請稍後再試。' });
  }
});

// 健康檢查
app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    geminiConfigured: !!(GEMINI_API_KEY && GEMINI_API_KEY !== 'PLACEHOLDER_API_KEY'),
  });
});

// ============ 分享 / 發布 API ============
// 儲存發布快照（記憶體，重啟後清空；生產環境可改用 Redis/DB）
const publishStore = new Map();

/**
 * POST /api/publish - 發布或更新分享
 * body: { token?, courses, heroCover, categories }
 * - 有 token：更新既有發布
 * - 無 token：建立新發布，回傳 token
 * - enabled: boolean 控制分享開關
 */
app.post('/api/publish', (req, res) => {
  const { token, courses, heroCover, categories, enabled = true } = req.body;
  if (!courses || !Array.isArray(courses)) {
    return res.status(400).json({ error: '缺少 courses' });
  }
  const id = token || crypto.randomUUID();
  publishStore.set(id, {
    courses,
    heroCover: heroCover || {},
    categories: categories || [],
    enabled: !!enabled,
    updatedAt: new Date().toISOString(),
  });
  res.json({ token: id, enabled: true });
});

/**
 * GET /api/publish/:token - 取得發布內容（分享檢視用）
 */
app.get('/api/publish/:token', (req, res) => {
  const { token } = req.params;
  const data = publishStore.get(token);
  if (!data) return res.status(404).json({ error: '找不到分享' });
  if (!data.enabled) return res.status(403).json({ error: '此分享已關閉' });
  res.json({
    courses: data.courses,
    heroCover: data.heroCover,
    categories: data.categories,
    updatedAt: data.updatedAt,
  });
});

/**
 * POST /api/publish/:token/toggle - 開關分享
 * body: { enabled: boolean }
 */
app.post('/api/publish/:token/toggle', (req, res) => {
  const { token } = req.params;
  const { enabled } = req.body;
  const data = publishStore.get(token);
  if (!data) return res.status(404).json({ error: '找不到分享' });
  data.enabled = !!enabled;
  data.updatedAt = new Date().toISOString();
  res.json({ token, enabled: data.enabled });
});

// ============ 靜態檔案（生產環境） ============
const distPath = path.join(__dirname, '..', 'dist');
const distExists = fs.existsSync(distPath);

if (distExists) {
  app.use(express.static(distPath, { index: false }));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  app.get(/^(?!\/api)/, (req, res) => {
    res.status(503).send(
      '開發模式：請先執行 npm run build 建置前端，或使用 npm run dev 啟動 Vite 開發伺服器。'
    );
  });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`LumiLearn 伺服器運行於 http://0.0.0.0:${PORT}`);
  console.log(`Gemini API: ${GEMINI_API_KEY && GEMINI_API_KEY !== 'PLACEHOLDER_API_KEY' ? '已設定' : '未設定 (演示模式)'}`);
});
