/**
 * 🚀 BOSS-TECH WhatsApp Bot Server
 * Ultra Pro Max Version
 * Created with ❤️ for BOSS-TECH
 */

const express = require('express');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { spawn } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

// ========================
// 🎨 MIDDLEWARE
// ========================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// ========================
// 🏆 BOT INFORMATION
// ========================
const BOT_INFO = {
    name: "BOSS-TECH",
    version: "3.0.0",
    owner: process.env.OWNER_NAME || "BOSS-TECH Developer",
    prefix: process.env.PREFIX || ".",
    mode: process.env.MODE || "public",
    status: "online",
    uptime: Date.now(),
    commands: 0,
    features: [
        "300+ Commands",
        "24/7 Online", 
        "Anti-Delete",
        "AI Chat",
        "Media Downloader",
        "Sticker Creator",
        "Game System",
        "YouTube Downloader",
        "Auto-Reaction",
        "Multi-Language"
    ]
};

// ========================
// 📊 AUTO-STATS UPDATER
// ========================
function updateBotStats() {
    try {
        const commandsDir = path.join(__dirname, 'commands');
        if (fs.existsSync(commandsDir)) {
            const files = fs.readdirSync(commandsDir).filter(f => f.endsWith('.js'));
            BOT_INFO.commands = files.length;
        }
        
        // Update uptime
        const uptime = Date.now() - BOT_INFO.uptime;
        const days = Math.floor(uptime / (1000 * 60 * 60 * 24));
        const hours = Math.floor((uptime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));
        BOT_INFO.formattedUptime = `${days}d ${hours}h ${minutes}m`;
        
    } catch (e) {
        console.log("Stats update error:", e.message);
    }
}

// Update stats every 5 minutes
setInterval(updateBotStats, 5 * 60 * 1000);
updateBotStats(); // Initial update

// ========================
// 🌐 ROUTES
// ========================

// 🏠 HOME PAGE - ULTRA PRO MAX DESIGN
app.get('/', (req, res) => {
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>🤖 BOSS-TECH WhatsApp Bot</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }
            
            body {
                background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
                color: white;
                min-height: 100vh;
                padding: 20px;
            }
            
            .container {
                max-width: 1200px;
                margin: 0 auto;
                padding: 20px;
            }
            
            .header {
                text-align: center;
                padding: 40px 20px;
                background: rgba(0, 0, 0, 0.3);
                border-radius: 20px;
                margin-bottom: 40px;
                border: 2px solid #00ff88;
                box-shadow: 0 0 30px rgba(0, 255, 136, 0.3);
            }
            
            .title {
                font-size: 3.5rem;
                background: linear-gradient(90deg, #00ff88, #00ccff);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                text-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
                margin-bottom: 10px;
            }
            
            .subtitle {
                font-size: 1.2rem;
                color: #88ffcc;
                margin-bottom: 20px;
            }
            
            .status-badge {
                display: inline-block;
                background: #00ff88;
                color: #000;
                padding: 10px 20px;
                border-radius: 50px;
                font-weight: bold;
                animation: pulse 2s infinite;
            }
            
            @keyframes pulse {
                0% { box-shadow: 0 0 0 0 rgba(0, 255, 136, 0.7); }
                70% { box-shadow: 0 0 0 15px rgba(0, 255, 136, 0); }
                100% { box-shadow: 0 0 0 0 rgba(0, 255, 136, 0); }
            }
            
            .stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 20px;
                margin: 40px 0;
            }
            
            .stat-card {
                background: rgba(255, 255, 255, 0.1);
                padding: 25px;
                border-radius: 15px;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                transition: transform 0.3s;
            }
            
            .stat-card:hover {
                transform: translateY(-5px);
                border-color: #00ff88;
            }
            
            .stat-title {
                color: #88ffcc;
                font-size: 1rem;
                margin-bottom: 10px;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .stat-value {
                font-size: 2rem;
                font-weight: bold;
                color: white;
            }
            
            .features-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 15px;
                margin: 30px 0;
            }
            
            .feature {
                background: rgba(0, 255, 136, 0.1);
                padding: 15px;
                border-radius: 10px;
                border-left: 4px solid #00ff88;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .footer {
                text-align: center;
                margin-top: 50px;
                padding-top: 20px;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
                color: #88aaff;
            }
            
            .command-btn {
                background: linear-gradient(90deg, #00ff88, #00ccff);
                color: black;
                border: none;
                padding: 15px 30px;
                border-radius: 50px;
                font-size: 1.1rem;
                font-weight: bold;
                cursor: pointer;
                margin: 20px;
                transition: all 0.3s;
            }
            
            .command-btn:hover {
                transform: scale(1.05);
                box-shadow: 0 0 20px rgba(0, 255, 136, 0.5);
            }
            
            @media (max-width: 768px) {
                .title { font-size: 2.5rem; }
                .stats-grid { grid-template-columns: 1fr; }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1 class="title">🤖 BOSS-TECH</h1>
                <p class="subtitle">ULTRA PRO MAX WhatsApp Bot</p>
                <div class="status-badge">🟢 ONLINE & ACTIVE</div>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
                <button class="command-btn" onclick="showCommands()">📜 View Commands</button>
                <button class="command-btn" onclick="showStats()">📊 Live Stats</button>
                <button class="command-btn" onclick="restartBot()">🔄 Restart Bot</button>
            </div>
            
            <div class="stats-grid" id="statsGrid">
                <div class="stat-card">
                    <div class="stat-title">⚡ Bot Status</div>
                    <div class="stat-value">🟢 ONLINE</div>
                </div>
                <div class="stat-card">
                    <div class="stat-title">📦 Version</div>
                    <div class="stat-value">${BOT_INFO.version}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-title">⚙️ Commands</div>
                    <div class="stat-value">${BOT_INFO.commands}+</div>
                </div>
                <div class="stat-card">
                    <div class="stat-title">⏳ Uptime</div>
                    <div class="stat-value">${BOT_INFO.formattedUptime || 'Calculating...'}</div>
                </div>
            </div>
            
            <h2 style="color: #00ff88; margin: 40px 0 20px 0; text-align: center;">🔥 Premium Features</h2>
            <div class="features-grid">
                ${BOT_INFO.features.map(feature => `
                    <div class="feature">
                        <span style="color: #00ff88;">✔</span> ${feature}
                    </div>
                `).join('')}
            </div>
            
            <div class="footer">
                <p>© 2024 BOSS-TECH WhatsApp Bot | Made with ❤️ by ${BOT_INFO.owner}</p>
                <p>Server: ${PORT} | Mode: ${BOT_INFO.mode.toUpperCase()} | Prefix: ${BOT_INFO.prefix}</p>
                <p style="margin-top: 20px; font-size: 0.9rem; color: #88ccff;">
                    ⚡ Auto-Restart Enabled | 🔒 Secure Connection | 🚀 High Performance
                </p>
            </div>
        </div>
        
        <script>
            function showCommands() {
                fetch('/commands')
                    .then(r => r.json())
                    .then(data => {
                        alert('Total Commands: ' + data.count + '\\n' +
                              'Categories: ' + data.categories.join(', '));
                    });
            }
            
            function showStats() {
                fetch('/stats')
                    .then(r => r.json())
                    .then(data => {
                        alert('🤖 BOSS-TECH STATS\\n' +
                              'Uptime: ' + data.uptime + '\\n' +
                              'Commands: ' + data.commands + '\\n' +
                              'Status: ' + data.status + '\\n' +
                              'Memory: ' + data.memory);
                    });
            }
            
            function restartBot() {
                if(confirm('Are you sure you want to restart the bot?')) {
                    fetch('/restart', { method: 'POST' })
                        .then(() => alert('Bot restart initiated!'));
                }
            }
            
            // Auto-refresh stats every 30 seconds
            setInterval(() => {
                fetch('/stats')
                    .then(r => r.json())
                    .then(data => {
                        document.querySelector('.stat-value:nth-child(2)').textContent = data.uptime;
                    });
            }, 30000);
        </script>
    </body>
    </html>`;
    
    res.send(html);
});

// 📊 BOT STATS API
app.get('/stats', (req, res) => {
    const stats = {
        name: BOT_INFO.name,
        version: BOT_INFO.version,
        status: BOT_INFO.status,
        uptime: BOT_INFO.formattedUptime || 'Calculating...',
        commands: BOT_INFO.commands,
        owner: BOT_INFO.owner,
        prefix: BOT_INFO.prefix,
        mode: BOT_INFO.mode,
        memory: process.memoryUsage().heapUsed / 1024 / 1024 + ' MB',
        timestamp: new Date().toISOString()
    };
    res.json(stats);
});

// 📜 COMMANDS LIST
app.get('/commands', (req, res) => {
    try {
        const commands = [];
        const categories = new Set();
        
        // This would scan your commands directory
        const commandsDir = path.join(__dirname, 'commands');
        if (fs.existsSync(commandsDir)) {
            const files = fs.readdirSync(commandsDir).filter(f => f.endsWith('.js'));
            commands.push(...files.map(f => f.replace('.js', '')));
            categories.add('main');
        }
        
        res.json({
            count: commands.length,
            commands: commands.slice(0, 50), // First 50 commands
            categories: Array.from(categories)
        });
    } catch (e) {
        res.json({ count: 0, commands: [], categories: [], error: e.message });
    }
});

// 🔄 RESTART BOT (Admin only)
app.post('/restart', (req, res) => {
    const auth = req.headers.authorization;
    if (auth === process.env.ADMIN_TOKEN || req.query.token === process.env.ADMIN_TOKEN) {
        res.json({ success: true, message: 'Bot restart initiated' });
        
        // Auto-restart after 2 seconds
        setTimeout(() => {
            console.log('🔄 BOSS-TECH Restarting...');
            process.exit(0);
        }, 2000);
    } else {
        res.status(403).json({ success: false, message: 'Unauthorized' });
    }
});

// 🏓 PING ENDPOINT (for uptime monitoring)
app.get('/ping', (req, res) => {
    res.json({ 
        status: 'alive', 
        bot: BOT_INFO.name,
        timestamp: new Date().toISOString(),
        message: 'BOSS-TECH is online and ready!'
    });
});

// 🆘 HEALTH CHECK
app.get('/health', (req, res) => {
    const health = {
        status: 'healthy',
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        bot: BOT_INFO,
        timestamp: new Date().toISOString()
    };
    res.json(health);
});

// 🎮 CONTROL PANEL
app.get('/admin', (req, res) => {
    if (req.query.password === process.env.ADMIN_PASS) {
        res.sendFile(path.join(__dirname, 'admin-panel.html'));
    } else {
        res.send(`
            <h1>BOSS-TECH Admin</h1>
            <form method="get">
                <input type="password" name="password" placeholder="Admin Password">
                <button type="submit">Login</button>
            </form>
        `);
    }
});

// ========================
// 🚀 START SERVER
// ========================
app.listen(PORT, () => {
    console.log(`
    ╔═══════════════════════════════════════════╗
    ║         🤖 BOSS-TECH SERVER ONLINE        ║
    ╠═══════════════════════════════════════════╣
    ║ 🔗 URL: http://localhost:${PORT}          ║
    ║ 🚀 Port: ${PORT}                          ║
    ║ 📦 Version: ${BOT_INFO.version}           ║
    ║ 👑 Owner: ${BOT_INFO.owner}               ║
    ║ ⚡ Prefix: ${BOT_INFO.prefix}              ║
    ║ 🎯 Mode: ${BOT_INFO.mode.toUpperCase()}   ║
    ║ 📊 Commands: ${BOT_INFO.commands}+        ║
    ╚═══════════════════════════════════════════╝
    
    📡 Endpoints:
    • /          - Dashboard
    • /stats     - Bot Statistics
    • /commands  - Commands List
    • /ping      - Health Check
    • /health    - Detailed Health
    • /admin     - Admin Panel
    
    🚀 Server started at: ${new Date().toLocaleString()}
    `);
    
    // Auto ping to keep alive
    setInterval(() => {
        console.log(`[${new Date().toLocaleTimeString()}] BOSS-TECH Server Active`);
    }, 5 * 60 * 1000); // Every 5 minutes
});

// ========================
// 🔧 AUTO-RECOVERY
// ========================
process.on('uncaughtException', (err) => {
    console.error('🚨 Uncaught Exception:', err);
    // Don't exit, keep server running
});

process.on('unhandledRejection', (reason, promise) => {
    console.log('⚠️ Unhandled Rejection at:', promise, 'reason:', reason);
});

// Export for testing
module.exports = app;
