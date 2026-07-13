@echo off
chcp 65001 >nul
REM Hermes 통합 콘솔 시작 (node 절대경로 사용 — PATH 문제 원천 차단)
set "NODE=C:\nvm4w\nodejs\node.exe"

if not exist "%NODE%" (
  echo [오류] node 를 찾을 수 없습니다: %NODE%
  echo Node.js 를 설치하거나 이 파일의 NODE 경로를 수정하세요.
  pause
  exit /b 1
)

cd /d "%~dp0"

REM 3001 포트 점유 해제
for /f "tokens=5" %%a in ('netstat -ano 2^>nul ^| findstr ":3001" ^| findstr "LISTENING"') do (
  echo [정리] 기존 3001 종료: %%a
  taskkill /PID %%a /F >nul 2>&1
)
timeout /t 1 >nul

echo [시작] server.js ...
start "Hermes-Server" cmd /k ""%NODE%" server.js"
timeout /t 2 >nul

echo [시작] bot.js ...
start "Hermes-Bot" cmd /k ""%NODE%" bot.js"

echo.
echo ============================================
echo  브라우저에서 http://localhost:3001 을 여세요.
echo  에러는 각 창에 빨간 글씨로 표시됩니다.
echo ============================================
echo.
pause
