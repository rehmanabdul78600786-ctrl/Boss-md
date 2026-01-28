const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Simple middleware
app.use(express.json());

// Health check - simple and fast
app.get('/', (req, res) => {
    res.json({
        status: 'online',
        bot: 'BOSS-MD',
        uptime: process.uptime()
    });
});

// Ping endpoint
app.get('/ping', (req, res) => {
    res.send('pong');
});

// Status endpoint
app.get('/status', (req, res) => {
    res.json({
        status: 'running',
        memory: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2) + 'MB'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    
    // Start bot after server
    setTimeout(() => {
        try {
            require('./index');
            console.log('Bot started successfully');
        } catch (error) {
            console.log('Bot error:', error.message);
        }
    }, 1000);
});

// Keep alive every 25 minutes
setInterval(() => {
    console.log('Keep-alive');
}, 25 * 60 * 1000);
