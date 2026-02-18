# LumiLearn - 個人線上課程平台

<p align="center">
  <strong>學習對您至關重要的技能。</strong>
</p>

<p align="center">
  類 Hahow 風格的個人線上課程平台，具備 YouTube/Google Drive 影片串流、AI 課程助教、深色模式與完整編輯功能。
</p>

---

## ✨ 功能特色

### 課程管理
- **探索課程**：首頁分類篩選、探索頁搜尋與篩選
- **建立課程**：完整表單、AI 協助撰寫描述、章節與單元編輯
- **編輯課程**：課程詳情頁可進入編輯，支援分類修改並同步更新

### 影片與內容
- **YouTube** 與 **Google Drive** 影片嵌入
- 課程大綱、免費試看／付費限定標記

### AI 功能
- **課程 AI 助教**：Gemini 驅動的即時問答
- **AI 撰寫描述**：自動產生課程介紹

### 平台設定
- **封面編輯**：自訂首頁 Hero 區塊文字與按鈕
- **分類管理**：新增、修改、刪除分類（可同步更新課程）
- **深色／淺色模式**：主題切換，偏好儲存於本地

---

## 🚀 快速開始

### 環境需求
- Node.js 18+
- npm / yarn / pnpm

### 安裝與執行

```bash
# 安裝依賴
npm install

# 開發模式（僅前端）
npm run dev

# 含 AI 功能（需額外終端機）
# 終端機 1
npm run dev:api

# 終端機 2
npm run dev
```

### 環境變數

複製 `.env.example` 為 `.env.local`，設定：

```
GEMINI_API_KEY=your_gemini_api_key
```

取得 API Key：https://aistudio.google.com/apikey

---

## 📜 可用指令

| 指令 | 說明 |
|-----|------|
| `npm run dev` | 啟動 Vite 開發伺服器（port 3000） |
| `npm run dev:api` | 啟動後端 API（port 3001，供前端代理） |
| `npm run build` | 建置生產版本 |
| `npm run preview` | 預覽建置結果 |
| `npm start` | 啟動生產伺服器（需先 `npm run build`） |

---

## 🛠 技術架構

- **前端**：React 19、TypeScript、Vite 6、Tailwind CSS、React Router
- **後端**：Express 4，代理 Gemini API
- **狀態**：React State + localStorage

---

## 📂 專案結構

```
├── components/       # 共用元件
├── contexts/         # React Context（主題、封面）
├── pages/            # 頁面
├── services/         # API 服務
├── server/           # Express 後端
├── constants.ts      # 常數與預設資料
├── types.ts          # TypeScript 型別
└── vite.config.ts
```

---

## 🌐 部署

### Zeabur

詳見 [DEPLOYMENT.md](DEPLOYMENT.md)。

1. 推送到 GitHub
2. 在 Zeabur 導入儲存庫
3. 設定 `GEMINI_API_KEY` 環境變數
4. 自動建置與部署

---

## 📄 授權

MIT License

---

**LumiLearn** — 為了學習的樂趣而製作。
