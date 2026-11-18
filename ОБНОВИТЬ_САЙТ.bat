@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo Обновление сайта в интернете...
git add .
git commit -m "Update invitation site"
git push origin main
git push tushoo main 2>nul
echo.
echo ========================================================
echo Готово! Через 30-60 секунд изменения появятся по ссылкам:
echo Короткая ссылка: https://is.gd/azaliya_tushoo_toi
echo Полная ссылка:   https://begimaimadylbekova73-gif.github.io/azaliya-tushoo-toi/
echo ========================================================
pause
