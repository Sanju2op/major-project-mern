# run-app.ps1 (place in testimonials-app/)
Start-Process powershell -ArgumentList "cd ./client; npm start"
Start-Process powershell -ArgumentList "cd ./server; npm run dev"
