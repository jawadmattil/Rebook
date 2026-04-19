@echo off
set GIT_PATH="C:\Users\JAWAD\Documents\flutter_windows_3.27.4-stable\flutter\bin\mingit\cmd\git.exe"
echo.
echo [ReBook] Attempting to push code to GitHub...
echo Repository: https://github.com/jawadmattil/Rebook.git
echo.
%GIT_PATH% push -u origin main
echo.
if %errorlevel% neq 0 (
    echo [ERROR] Push failed. Please check your GitHub credentials or Personal Access Token.
) else (
    echo [SUCCESS] Code pushed successfully! Refresh github.com to see your folders.
)
echo.
pause
