@echo off
cd /d "%~dp0"

echo Pushing to GitHub...
git push -u origin main

if errorlevel 1 (
    echo.
    echo Push failed. Please check:
    echo 1. Repo exists at https://github.com/necva2018/lumilearn
    echo 2. You are logged in to GitHub
    echo.
    pause
) else (
    echo.
    echo Success!
    pause
)
