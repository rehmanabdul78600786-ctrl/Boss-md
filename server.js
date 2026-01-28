// server.js updated section
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Rest of your server.js code...
const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Basic Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Health Check Route (Zaroori hai Heroku ke liye)
app.get('/', (req, res) => {
    res.json({
        status: '✅ Bot is running',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        endpoints: [
            '/ - Health check',
            '/ping - Simple ping',
            '/health - Detailed health info',
            '/admin - Admin panel'
        ]
    });
});

// ✅ Simple Ping Route
app.get('/ping', (req, res) => {
    res.json({ 
        message: '🏓 Pong!', 
        timestamp: new Date().toISOString() 
    });
});

// ✅ Detailed Health Check (Heroku monitor ke liye)
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: {
            rss: `${Math.round(process.memoryUsage().rss / 1024 / 1024)} MB`,
            heapTotal: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)} MB`,
            heapUsed: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`
        },
        node: process.version,
        platform: process.platform
    });
});

// ✅ Admin Panel (Basic HTML)
app.get('/admin', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Bot Admin</title>
            <style>
                body { font-family: Arial; padding: 20px; }
                .card { background: #f5f5f5; padding: 20px; border-radius: 10px; margin: 10px 0; }
                .status { color: green; font-weight: bold; }
            </style>
        </head>
        <body>
            <h1>🤖 Bot Admin Panel</h1>
            <div class="card">
                <h3>Status: <span class="status">✅ Running</span></h3>
                <p><strong>Uptime:</strong> ${Math.round(process.uptime())} seconds</p>
                <p><strong>Started:</strong> ${new Date().toLocaleString()}</p>
            </div>
            <div class="card">
                <h3>Quick Actions</h3>
                <button onclick="restartBot()">🔄 Restart Bot</button>
                <button onclick="checkLogs()">📋 View Logs</button>
            </div>
            <script>
                function restartBot() {
                    fetch('/restart', { method: 'POST' })
                        .then(res => alert('Restart command sent!'))
                        .catch(err => alert('Error: ' + err));
                }
                function checkLogs() {
                    window.open('/logs', '_blank');
                }
            </script>
        </body>
        </html>
    `);
});

// ✅ Logs Route (Simple)
app.get('/logs', (req, res) => {
    res.send(`
        <h2>📊 Application Logs</h2>
        <p>Logs will appear here...</p>
        <pre>Check Heroku logs for detailed information</pre>
    `);
});

// ✅ Restart Endpoint (Optional)
app.post('/restart', (req, res) => {
    console.log('Restart command received');
    res.json({ message: 'Restart initiated', timestamp: new Date().toISOString() });
    // Agar aap restart karna chahte hain to yahan code add karein
    // process.exit(0); // Caution: This will restart the bot
});

// ✅ 404 Handler
app.use((req, res) => {
    res.status(404).json({ 
        error: 'Route not found',
        availableRoutes: ['/', '/ping', '/health', '/admin', '/logs']
    });
});

// ✅ Server Start
app.listen(PORT, () => {
    console.log(`
    🚀 Server started at: ${new Date().toLocaleString()}
    🔗 Port: ${PORT}
    🌐 URL: http://localhost:${PORT}
    
    📍 Available Routes:
        • /      - Health Check
        • /ping  - Simple Ping
        • /health - Detailed Health
        • /admin  - Admin Panel
        • /logs   - Application Logs
    
    ✅ Bot is ready to connect...
    `);
});

module.exports = app;
