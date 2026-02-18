# 上傳至 GitHub 腳本
# 使用前請：1. 在 GitHub 建立新儲存庫 lumilearn  2. 將 YOUR_GITHUB_USERNAME 改為你的帳號

param(
    [Parameter(Mandatory=$true)]
    [string]$Username
)

$repo = "lumilearn"
$remote = "https://github.com/$Username/$repo.git"

Write-Host "正在連接 $remote ..." -ForegroundColor Cyan

git remote add origin $remote 2>$null
if ($LASTEXITCODE -ne 0) {
    git remote set-url origin $remote
    Write-Host "已更新現有 remote" -ForegroundColor Yellow
}

git branch -M main
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n上傳成功！" -ForegroundColor Green
    Write-Host "建立 v1.0.0 標籤？(y/n): " -NoNewline
    $tag = Read-Host
    if ($tag -eq "y") {
        git tag -a v1.0.0 -m "LumiLearn V1.0.0 正式版"
        git push origin v1.0.0
    }
} else {
    Write-Host "`n上傳失敗。請確認：" -ForegroundColor Red
    Write-Host "1. 已在 GitHub 建立儲存庫 $repo"
    Write-Host "2. 帳號 $Username 正確"
    Write-Host "3. 已登入 GitHub (可執行 gh auth login)"
}
