@echo off
chcp 65001 >nul
cd /d "%~dp0gift-workspace"

if not exist "node_modules\" (
  echo [1/2] npm install 실행 중...
  call npm install
  if errorlevel 1 (
    echo npm install 실패. Node.js 설치 여부를 확인하세요.
    pause
    exit /b 1
  )
)

echo.
echo [2/2] 개발 서버 시작
echo     http://127.0.0.1:3000
echo (이 창을 닫으면 사이트가 꺼집니다.)
echo.
call npm run dev
pause
