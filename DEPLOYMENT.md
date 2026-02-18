# Lumilearm 部署指南（Zeabur）

本文件說明如何將 **Lumilearm** 線上課程平台部署至 [Zeabur](https://zeabur.com)。

---

## 架構概覽

- **前端**：React + Vite + TypeScript，建置後由 Express 靜態服務
- **後端 API**：Express 代理 Gemini API，保護 API Key
- **單一服務**：前後端整合於同一專案，Zeabur 部署一次即可

---

## 部署前檢查

1. **Git 儲存庫**：將程式碼推送到 GitHub（Zeabur 透過 GitHub 部署）
2. **Gemini API Key**：至 [Google AI Studio](https://aistudio.google.com/apikey) 取得
3. **Node.js**：本地需 Node 18+（`npm run build` 與 `npm start` 測試）

---

## Zeabur 部署步驟

### 1. 建立專案 Lumilearm

1. 登入 [Zeabur](https://zeabur.com)
2. 前往 [專案列表](https://zeabur.com/projects)
3. 點擊 **Create Project**（或 `Ctrl+K` 開啟指令面板）
4. 選擇部署區域，建立新專案後將其命名為 **Lumilearm**

### 2. 導入服務

1. 在 Lumilearm 專案中點擊 **Deploy New Service**
2. 選擇 **Deploy your source code**
3. 連接 GitHub，搜尋並導入本專案儲存庫

### 3. 設定 Secrets / 環境變數

**重要：** Gemini API Key 僅存放於後端，切勿提交至 Git。請在 Zeabur 的 Variables（Secrets）中設定：

1. 進入服務的 **Variables** 分頁
2. 點擊 **Add Variables**
3. 新增以下變數（建議將 `GEMINI_API_KEY` 設為隱藏/Secret 類型）：

| 變數名稱 | 說明 | 必填 |
|---------|------|------|
| `GEMINI_API_KEY` | Google Gemini API Key（後端使用，不會暴露於前端） | ✅ |

取得 API Key：https://aistudio.google.com/apikey

### 4. 部署與建置

專案根目錄已包含 `zbpack.json`，Zeabur 會自動：

1. 偵測為 Node.js 專案
2. 執行 `npm install`
3. 執行 `npm run build`（Vite 建置前端至 `dist/`）
4. 執行 `npm start`（啟動 Express 伺服器，提供 API 與靜態檔）

若需調整，可於 **Build** 設定中手動指定：

- **Install Command**：`npm install`
- **Build Command**：`npm run build`
- **Start Command**：`npm start`

### 5. 網域

部署完成後，Zeabur 會提供 `*.zeabur.app` 網域，亦可於設定中綁定自訂網域。

---

## 架構與安全

- **Gemini API 僅在後端**：`server/index.js` 從 `process.env.GEMINI_API_KEY` 讀取金鑰，前端 `geminiService.ts` 僅呼叫 `/api/chat` 與 `/api/generate-description`，**絕不會暴露 API Key**。
- **Secrets 變數**：請將 `GEMINI_API_KEY` 設於 Zeabur Variables，並避免將 `.env` 或金鑰提交至 Git。

---

## 本地開發

### 含 API 的完整開發

需要同時啟動 Vite 與 API 伺服器：

**終端機 1（API 後端）：**

```bash
npm run dev:api
```

預設於 `http://localhost:3001` 提供 `/api/*` 端點。

**終端機 2（前端）：**

```bash
npm run dev
```

Vite 會將 `/api` 請求代理到 `localhost:3001`。

### 本地生產測試

```bash
npm run build
npm start
```

瀏覽 `http://localhost:3000`（或 `PORT` 環境變數指定之埠號）。

---

## 環境變數說明

| 變數 | 用途 | 部署位置 |
|-----|------|---------|
| `GEMINI_API_KEY` | Gemini API 金鑰（後端） | Zeabur Variables |
| `PORT` | 伺服器埠號（Zeabur 自動提供） | 自動 |
| `VITE_API_BASE_URL` | 前端 API 基礎網址（前後端分離時使用） | 選填，Zeabur Variables |

同源部署時，`VITE_API_BASE_URL` 留空即可，前端會使用相對路徑 `/api`。

---

## API 端點

| 方法 | 路徑 | 說明 |
|-----|------|------|
| GET | `/api/health` | 健康檢查，回傳 `{ ok, geminiConfigured }` |
| POST | `/api/chat` | 課程 AI 助教對話 |
| POST | `/api/generate-description` | AI 生成課程描述 |

---

## 疑難排解

### AI 功能顯示「演示模式」

- 確認 Zeabur Variables 已設定 `GEMINI_API_KEY`
- 檢查無多餘空格或換行
- 重新部署後再測試

### 部署失敗

- 查看 Zeabur 的 Build Logs
- 確認 `package.json` 的 `engines.node` 為 `>=18`
-  locally 執行 `npm run build` 驗證建置是否成功

### 靜態資源 404

- 確認 build 成功產生 `dist/` 資料夾
- 檢查 `npm start` 是否正確執行 `node server/index.js`

---

## 安全提醒

- ⚠️ **切勿**將 `GEMINI_API_KEY` 提交至 Git
- `.env`、`.env.local` 已列於 `.gitignore`
- 請使用 Zeabur 的 Variables 設定正式環境的 API Key
