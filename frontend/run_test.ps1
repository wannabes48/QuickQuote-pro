npm install -D puppeteer
Start-Process -FilePath "npm" -ArgumentList "run", "dev" -NoNewWindow
Start-Sleep -Seconds 8
node check.js
