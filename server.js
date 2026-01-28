// server.js - Sirf chalne ke liye
const http = require('http');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('BOSS-MD Bot is running\n');
});

server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
    console.log('WhatsApp bot can now run...');
});

// Server ko crash hone se bachaye
process.on('uncaughtException', (err) => {
    console.log('Uncaught Exception:', err);
});

process.on('unhandledRejection', (err) => {
    console.log('Unhandled Rejection:', err);
});
