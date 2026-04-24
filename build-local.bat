@echo off
setlocal

cd /d "%~dp0"

set "PS5=C:\Windows\System32\WindowsPowerShell\v1.0"
set "PATH=%PS5%;%PATH%"
set "GYP_MSVS_VERSION=2022"
set "npm_config_msvs_version=2022"

echo.
echo MarkText local build helper
echo Repository: %CD%
echo.

set "RUN_DEV="
set /p RUN_DEV="Run Dev? [y/N]: "
if /i "%RUN_DEV%"=="Y" goto run_dev
if /i "%RUN_DEV%"=="YES" goto run_dev

set "BUILD_INSTALL="
set /p BUILD_INSTALL="Compile and install? [Y/n]: "
if /i "%BUILD_INSTALL%"=="N" goto done
if /i "%BUILD_INSTALL%"=="NO" goto done

goto build_install

:setup
echo.
echo Using Node 16.20.2...
call nvm use 16.20.2
if errorlevel 1 goto fail

where yarn >nul 2>nul
if errorlevel 1 (
  echo Enabling Yarn 1.22.22 via Corepack...
  call corepack enable
  if errorlevel 1 goto fail
  call corepack prepare yarn@1.22.22 --activate
  if errorlevel 1 goto fail
)

if exist "node_modules\node-gyp\lib\find-visualstudio.js" (
  powershell -NoProfile -ExecutionPolicy Bypass -Command "$p='node_modules\node-gyp\lib\find-visualstudio.js'; $s=Get-Content $p -Raw; if ($s -notmatch 'Windows11SDK') { $s=$s -replace \"const win10SDKPrefix = 'Microsoft.VisualStudio.Component.Windows10SDK.'\", \"const win10SDKPrefix = 'Microsoft.VisualStudio.Component.Windows10SDK.'`r`n    const win11SDKPrefix = 'Microsoft.VisualStudio.Component.Windows11SDK.'\"; $s=$s -replace 'if \(!pkg\.startsWith\(win10SDKPrefix\)\) \{', 'if (!pkg.startsWith(win10SDKPrefix) && !pkg.startsWith(win11SDKPrefix)) {'; Set-Content $p $s -NoNewline }"
  if errorlevel 1 goto fail
)

exit /b 0

:run_dev
call :setup
if errorlevel 1 goto fail
echo.
echo Starting MarkText in development mode...
call yarn run dev
if errorlevel 1 goto fail
goto done

:build_install
call :setup
if errorlevel 1 goto fail
echo.
echo Building installer...
call yarn run build
if errorlevel 1 goto fail

if not exist "build\marktext-setup.exe" (
  echo Expected installer was not found: build\marktext-setup.exe
  goto fail
)

echo.
echo Installing build\marktext-setup.exe...
powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Process -FilePath '.\build\marktext-setup.exe' -ArgumentList '/S' -Wait -WindowStyle Hidden"
if errorlevel 1 goto fail

echo.
echo Installed:
echo %LOCALAPPDATA%\Programs\marktext\MarkText.exe

set "SET_DEFAULT_MD="
set /p SET_DEFAULT_MD="Make this install the default Markdown app for this user? [y/N]: "
if /i "%SET_DEFAULT_MD%"=="Y" goto register_markdown
if /i "%SET_DEFAULT_MD%"=="YES" goto register_markdown
goto done

:register_markdown
echo.
echo Registering Markdown file association...
powershell -NoProfile -ExecutionPolicy Bypass -File "tools\registerMarkTextMarkdownAssociation.ps1"
if errorlevel 1 goto fail
goto done

:fail
echo.
echo Failed. Review the output above for details.
exit /b 1

:done
echo.
echo Done.
endlocal
