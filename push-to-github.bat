@echo off
chcp 65001 >nul
echo 請輸入你的 GitHub 帳號名稱：
set /p USERNAME=

git remote add origin https://github.com/%USERNAME%/lumilearn.git 2>nul
if errorlevel 1 git remote set-url origin https://github.com/%USERNAME%/lumilearn.git

git branch -M main
git push -u origin main

if errorlevel 0 (
    echo.
    echo 上傳成功！
    pause
) else (
    echo.
    echo 上傳失敗。請確認已在 GitHub 建立 lumilearn 儲存庫。
    pause
)
