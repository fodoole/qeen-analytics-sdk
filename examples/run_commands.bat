@echo off

start "frontend" /D ".\react\frontend" cmd /c "npm run start"
start "backend" /D ".\react\backend" cmd /c "npm run dev"
start "config" /D ".\config_server" cmd /c "node index.js"