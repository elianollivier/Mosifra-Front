@echo off
REM Commit changes in Mosifra-Front safely from batch file
cd /d "%~dp0"
git status --porcelain




git --no-pager log -1 --statgit commit -m "chore(frontend): apply Developpeur D cleanup - remove unused imports/vars, group utils imports, optional chaining, globalThis, remove fragments"git add -Angit checkout -b cleanup/developpeur-D 2>nul || git checkout cleanup/developpeur-D