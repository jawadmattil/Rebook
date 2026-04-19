@echo off
set GIT_PATH="C:\Users\JAWAD\Documents\flutter_windows_3.27.4-stable\flutter\bin\mingit\cmd\git.exe"

echo.
echo [ReBook] FAST PUSH METHOD (Logging enabled)
echo.

:: --- EDIT THE LINE BELOW ---
set TOKEN=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
:: ---------------------------

if "%TOKEN%"==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 (
    echo [!] You need to EDIT this file and put your token in it first.
    pause
    exit
)

echo Attempting push using token...
:: Redirect both stdout and stderr to error_log.txt
(
  %GIT_PATH% remote set-url origin https://jawadmattil:%TOKEN%@github.com/jawadmattil/Rebook.git
  %GIT_PATH% push -u origin main
) > error_log.txt 2>&1

echo.
echo Operation finished. Please check error_log.txt
pause
