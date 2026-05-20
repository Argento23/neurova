@echo off
echo ====================================
echo Instalando dependencias de Cilo B2B
echo ====================================
cd /d "%~dp0"
call npm install
if %errorlevel% neq 0 (
    echo.
    echo ERROR: No se pudieron instalar las dependencias
    echo.
    pause
    exit /b 1
)

echo.
echo ====================================
echo Iniciando servidor de desarrollo...
echo ====================================
echo.
echo El sitio estara disponible en: http://localhost:3000
echo Presiona Ctrl+C para detener el servidor
echo.
call npm run dev
