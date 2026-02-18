# 上傳至 GitHub 步驟

## 1. 建立新儲存庫

1. 登入 [GitHub](https://github.com)
2. 點擊 **New repository**
3. 儲存庫名稱建議：`lumilearn` 或 `lumilearn-course-platform`
4. 選擇 **Public**，不需勾選 README（專案已有）

## 2. 本機初始化 Git（若尚未初始化）

```bash
git init
git add .
git commit -m "v1.0.0 - 首次發布"
```

## 3. 連接並推送到 GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

## 4. 建立 V1.0 標籤（可選）

```bash
git tag -a v1.0.0 -m "LumiLearn V1.0.0 正式版"
git push origin v1.0.0
```

## 5. 更新 package.json 的 repository URL

將 `package.json` 中的 `your-username` 改為你的 GitHub 帳號名稱。
