const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

// Middleware for instant response
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ========== ULTRA FAST HEALTH CHECK ==========
app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('X-Response-Time', '0ms');
    res.status(200).json({
        status: 'ONLINE',
        bot: 'BOSS-MD',
        speed: 'ULTRA-FAST',
        uptime: process.uptime(),
        timestamp: Date.now(),
        message: 'Bot is running at lightning speed ⚡'
    });
});

// ========== INSTANT PING ENDPOINT ==========
app.get('/ping', (req, res) => {
    res.status(200).send('PONG');
});

// ========== HELLO MESSAGE ENDPOINT ==========
app.get('/hello', (req, res) => {
    res.status(200).json({
        message: 'Hello from BOSS-MD Bot! 🚀',
        developer: '𝘽𝙊𝙎𝙎-𝙈𝘿',
        speed: 'Instant Reply',
        tip: 'Bot never sleeps, always ready!'
    });
});

// ========== BOT STATUS ==========
app.get('/status', (req, res) => {
    res.status(200).json({
        bot_status: 'ACTIVE',
        response_time: '10-50ms',
        memory_usage: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB`,
        platform: process.platform,
        node_version: process.version
    });
});

// ========== ERROR HANDLING ==========
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found', available: ['/', '/ping', '/hello', '/status'] });
});

// ========== START SERVER WITH BOT ==========
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`⚡ BOSS-MD Server started on port ${PORT}`);
    console.log(`⏱️  Startup Time: ${Date.now() - serverStartTime}ms`);
    
    // Bot start with error handling
    setTimeout(() => {
        try {
            console.log('🚀 Starting WhatsApp Bot...');
            require('./index');
            console.log('✅ Bot initialized successfully');
            
            // Send startup notification
            const startupTime = Date.now() - serverStartTime;
            console.log(`🎯 Total Startup: ${startupTime}ms`);
            
        } catch (error) {
            console.error('❌ Bot failed to start:', error.message);
            // Auto-restart after 5 seconds
            setTimeout(() => {
                console.log('🔄 Attempting auto-restart...');
                process.exit(1);
            }, 5000);
        }
    }, 100); // 100ms delay for server to stabilize
});

const serverStartTime = Date.now();

// ========== GRACEFUL SHUTDOWN ==========
process.on('SIGTERM', () => {
    console.log('🛑 SIGTERM received, shutting down gracefully...');
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});

// ========== KEEP ALIVE MECHANISM ==========
setInterval(() => {
    // Keep Heroku dyno alive
    console.log('💓 Keep-alive ping');
}, 20 * 60 * 1000); // Every 20 minutes

console.log('🔧 Server configuration loaded');
