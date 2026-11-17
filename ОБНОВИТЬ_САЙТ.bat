@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo Обновление сайта в интернете...
git add .
git commit -m "Update invitation site"
git push origin main
echo.
echo ========================================================
echo Готово! Через 30-60 секунд изменения появятся по ссылке:
echo https://begimaimadylbekova73-gif.github.io/azaliya-jeentek-toi/
echo ========================================================
pause
