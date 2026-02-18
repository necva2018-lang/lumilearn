# LumiLearn 部署指南（Zeabur）

本文件說明如何將 LumiLearn 線上課程平台部署至 [Zeabur](https://zeabur.com)。

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

### 1. 導入專案

1. 登入 [Zeabur](https://zeabur.com)
2. 點擊 **Deploy New Service** 或 **Add new service**
3. 選擇 **Deploy your source code**
4. 連接 GitHub，搜尋並導入本專案儲存庫

### 2. 設定環境變數

在 Zeabur 專案中，進入服務的 **Variables** 分頁，新增：

| 變數名稱 | 說明 | 必填 |
|---------|------|------|
| `GEMINI_API_KEY` | Google Gemini API Key | ✅ |

取得 API Key：https://aistudio.google.com/apikey

### 3. 部署與建置

Zeabur 會自動：

1. 偵測為 Node.js 專案
2. 執行 `npm install`
3. 執行 `npm run build`（Vite 建置前端）
4. 執行 `npm start`（啟動 Express 伺服器）

若偵測有誤，可於 **Build** 設定中手動指定：

- **Install Command**：`npm install`
- **Build Command**：`npm run build`
- **Start Command**：`npm start`

### 4. 網域

部署完成後，Zeabur 會提供 `*.zeabur.app` 網域，亦可於設定中綁定自訂網域。

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
