@echo off

start "" /D ".\react\frontend" cmd /c "npm run start"
start "" /D ".\react\backend" cmd /c "npm run dev"
start "" /D ".\endpoint" cmd /c "node index.js"