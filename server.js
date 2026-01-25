// Heroku Server File
const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// Root endpoint
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>BOSS-MD WhatsApp Bot</title>
      <meta http-equiv="refresh" content="300">
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-align: center;
          padding: 50px;
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .container {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          max-width: 600px;
          width: 100%;
        }
        h1 {
          font-size: 3em;
          margin-bottom: 20px;
          color: #25D366;
        }
        .status {
          background: rgba(255, 255, 255, 0.2);
          padding: 20px;
          border-radius: 15px;
          margin: 20px 0;
          border-left: 5px solid #25D366;
        }
        .info {
          display: flex;
          justify-content: space-between;
          margin: 10px 0;
          padding: 10px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🤖 BOSS-MD</h1>
        <p><em>Ultimate WhatsApp Bot</em></p>
        
        <div class="status">
          <h2>🟢 SYSTEM STATUS: ACTIVE</h2>
          <div class="info">
            <span>Uptime:</span>
            <span>${Math.floor(process.uptime() / 3600)}h ${Math.floor((process.uptime() % 3600) / 60)}m</span>
          </div>
          <div class="info">
            <span>Server Time:</span>
            <span>${new Date().toLocaleString()}</span>
          </div>
          <div class="info">
            <span>Platform:</span>
            <span>Heroku</span>
          </div>
          <div class="info">
            <span>Memory Usage:</span>
            <span>${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB</span>
          </div>
        </div>
        
        <p style="margin-top: 30px; font-size: 0.9em;">
          🔄 Auto-refresh every 5 minutes to prevent sleep
        </p>
      </div>
    </body>
    </html>
  `);
});

// Ping endpoint
app.get('/ping', (req, res) => {
  res.json({
    status: 'alive',
    app: 'BOSS-MD',
    time: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: Date.now(),
    service: 'whatsapp-bot'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 BOSS-MD Server running on port ${PORT}`);
  console.log(`🌐 Web Dashboard: http://localhost:${PORT}`);
});

// Auto ping system (Prevents Heroku sleep)
setInterval(() => {
  const appUrl = `https://${process.env.HEROKU_APP_NAME || 'your-app'}.herokuapp.com`;
  axios.get(`${appUrl}/ping`)
    .then(() => console.log(`✅ [${new Date().toLocaleTimeString()}] Ping successful`))
    .catch(err => console.log(`⚠️ Ping failed: ${err.message}`));
}, 240000); // Every 4 minutes

// Start WhatsApp bot
console.log('Starting BOSS-MD WhatsApp Bot...');
require('./index.js');
