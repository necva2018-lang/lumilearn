# Lumilearm Zeabur 部署檢查清單

程式碼已推送到 GitHub，請依序完成以下步驟。

---

## 🚀 方法一：Zeabur CLI（已登入可直接用）

已偵測到你已登入 Zeabur CLI，且存在 **Lumilearm** 專案。在專案資料夾開啟終端機執行：

```powershell
npx zeabur@latest deploy --create --name Lumilearm
```

出現專案選單時，用 **方向鍵** 選 **Lumilearm**，按 **Enter** 完成部署。

---

## 📋 方法二：網頁操作步驟

### 1️⃣ 建立專案
- 前往 https://zeabur.com/projects
- 點 **Create Project**
- 選擇區域後，將專案命名為 **Lumilearm**

### 2️⃣ 導入服務
- 在 Lumilearm 專案中點 **Deploy New Service**
- 選 **Deploy your source code**
- 連結 GitHub，搜尋 **necva2018-lang/lumilearn**
- 選擇該儲存庫

### 3️⃣ 設定 GEMINI_API_KEY
- 進入服務的 **Variables** 分頁
- 點 **Add Variables**
- 變數名稱：`GEMINI_API_KEY`
- 變數值：貼上你的 Gemini API Key（從 https://aistudio.google.com/apikey 取得）

### 4️⃣ 等待部署
Zeabur 會自動執行 `npm install` → `npm run build` → `npm start`，完成後即可使用 `*.zeabur.app` 網域。

---

## 🔗 快速連結

| 用途 | 連結 |
|------|------|
| Zeabur 專案 | https://zeabur.com/projects |
| GitHub 儲存庫 | https://github.com/necva2018-lang/lumilearn |
| 取得 API Key | https://aistudio.google.com/apikey |
