const config = require('../config');
const { cmd, commands } = require('../command');
const os = require("os");

// Array of different fancy text styles for BOSS-MD
const botNameStyles = [
    "𝓑𝓞𝓢𝓢-𝓜𝓓",
    "ᴮᴼˢˢmd ᭄",
    "𝓑𝖔𝙨𝙨-ℳ𝒟",
    "boss-𝔐𝔡",
    "✿𝓑𝓸𝓼𝓼-𝓶𝓭✿",
    "꧁𝑩𝒐𝒔𝒔-𝒎𝒅꧂",
    "𝘽𝙊𝙎𝙎-𝙈𝘿",
    "ⒷⓄⓈⓈ-ⓂⒹ",
    "🅑🅞🅢🅢-🅝🅢",
    "B̶O̶S̶S̶-̶M̶D̶"
];

// Track current style index
let currentStyleIndex = 0;

// LIVE PING COMMAND - Shows real-time system stats
cmd({
    pattern: "ping2",
    alias: ["speed", "pong", "liveping", "performance"],
    use: '.ping',
    desc: "Check bot's LIVE response time with system stats.",
    category: "main",
    react: "🌡️",
    filename: __filename
},
async (conn, mek, m, { from, quoted, sender, reply, pushname }) => {
    try {
        const start = new Date().getTime();

        const reactionEmojis = ['🔥', '⚡', '🚀', '💨', '🎯', '🎉', '🌟', '💥', '🕐', '🔹'];
        const textEmojis = ['💎', '🏆', '⚡️', '🚀', '🎶', '🌠', '🌀', '🔱', '🛡️', '✨'];

        const reactionEmoji = reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)];
        let textEmoji = textEmojis[Math.floor(Math.random() * textEmojis.length)];

        // Ensure reaction and text emojis are different
        while (textEmoji === reactionEmoji) {
            textEmoji = textEmojis[Math.floor(Math.random() * textEmojis.length)];
        }

        // Send reaction
        await conn.sendMessage(from, {
            react: { text: textEmoji, key: mek.key }
        });

        // Get system info
        const totalRAM = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
        const usedRAM = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        const freeRAM = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);
        const platform = os.platform();
        const arch = os.arch();
        const cpus = os.cpus().length;
        const cpuModel = os.cpus()[0].model.split('@')[0];
        const uptime = process.uptime();
        
        // Format uptime
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);
        const uptimeStr = `${hours}h ${minutes}m ${seconds}s`;

        const end = new Date().getTime();
        const responseTime = (end - start) / 1000;

        // Get current fancy bot name and rotate for next time
        const fancyBotName = botNameStyles[currentStyleIndex];
        currentStyleIndex = (currentStyleIndex + 1) % botNameStyles.length;

        // Performance rating
        let performanceLevel = "";
        if (responseTime < 0.1) performanceLevel = "⚡ ULTRA FAST";
        else if (responseTime < 0.5) performanceLevel = "🚀 EXTREME";
        else if (responseTime < 1) performanceLevel = "🔥 FAST";
        else if (responseTime < 2) performanceLevel = "✅ GOOD";
        else performanceLevel = "🐢 SLOW";

        // Create detailed ping message
        const text = `
╔════════════════════════════════╗
║        🚀 *LIVE PING STATS*      ║
╚════════════════════════════════╝

🤖 *BOT NAME:* ${fancyBotName}
⏱️ *RESPONSE TIME:* ${responseTime.toFixed(3)}s
🏆 *PERFORMANCE:* ${performanceLevel} ${reactionEmoji}

📊 *SYSTEM INFORMATION:*
├─ 🖥️ *OS:* ${platform.toUpperCase()} | ${arch}
├─ 🧠 *CPU:* ${cpuModel}
├─ 📊 *CORES:* ${cpus} Core
├─ 💾 *RAM:* ${usedRAM}MB / ${totalRAM}GB
├─ 📈 *FREE RAM:* ${freeRAM}GB
└─ ⏳ *UPTIME:* ${uptimeStr}

👤 *USER INFO:*
├─ 🏷️ *Name:* ${pushname || "User"}
├─ 📞 *Number:* ${sender.split('@')[0]}
└─ 🆔 *ID:* ${sender.replace('@s.whatsapp.net', '')}

🎯 *SPEED RATING:*
${responseTime < 0.1 ? "⭐⭐⭐⭐⭐ ELITE" : 
  responseTime < 0.5 ? "⭐⭐⭐⭐⭐ EXCELLENT" : 
  responseTime < 1 ? "⭐⭐⭐⭐ GREAT" : 
  responseTime < 2 ? "⭐⭐⭐ GOOD" : "⭐⭐ AVERAGE"}

⚡ *Powered by BOSS-MD Technology*
🕒 *Time:* ${new Date().toLocaleTimeString()}
`;

        // Send detailed message
        await conn.sendMessage(from, {
            text: text.trim(),
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                externalAdReply: {
                    title: "⚡ LIVE PING STATS",
                    body: "Real-time Bot Performance",
                    thumbnail: { 
                        url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&q=80" 
                    },
                    mediaType: 1,
                    renderLargerThumbnail: true
                },
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363422481806597@newsletter',
                    newsletterName: "𝗕𝗼𝘀𝘀-𝗺𝗱",
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

        // Additional: Send a sticker for fast response
        if (responseTime < 0.5) {
            await conn.sendMessage(from, {
                sticker: { 
                    url: "https://media.tenor.com/pIMyL4A-sfoAAAAi/anime-hello.gif" 
                }
            });
        }

    } catch (e) {
        console.error("Error in ping command:", e);
        reply(`An error occurred: ${e.message}`);
    }
});

// Original ping command (unchanged - backup)
cmd({
    pattern: "ping",
    desc: "Check bot's response time.",
    category: "main",
    react: "🧠",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const startTime = Date.now()
        const message = await conn.sendMessage(from, { text: '*PINGING...*' })
        const endTime = Date.now()
        const ping = endTime - startTime
        
        // Simple response with speed rating
        let speedStatus = "";
        if (ping < 100) speedStatus = "⚡ Ultra Fast";
        else if (ping < 500) speedStatus = "🚀 Fast";
        else if (ping < 1000) speedStatus = "✅ Good";
        else speedStatus = "🐢 Slow";
        
        await conn.sendMessage(from, { 
            text: `*🔥 𝗕𝗼𝘀𝘀-𝗺𝗱 SPEED : ${ping}ms*\n🏆 *Status:* ${speedStatus}` 
        }, { quoted: message })
    } catch (e) {
        console.log(e)
        reply(`${e}`)
    }
})

// NEW: Advanced live stats command
cmd({
    pattern: "stats",
    alias: ["system", "info", "status"],
    desc: "Get detailed system statistics.",
    category: "main",
    react: "📊",
    filename: __filename
},
async (conn, mek, m, { from, sender, pushname, reply }) => {
    try {
        // Send typing indicator
        await conn.sendPresenceUpdate('composing', from);
        
        // Get system info
        const totalRAM = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
        const usedRAM = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        const freeRAM = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);
        const platform = os.platform();
        const arch = os.arch();
        const cpus = os.cpus().length;
        const cpuModel = os.cpus()[0].model;
        const uptime = process.uptime();
        
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);
        const uptimeStr = `${hours}h ${minutes}m ${seconds}s`;
        
        // Bot load percentage
        const loadAvg = os.loadavg()[0];
        const loadPercentage = ((loadAvg / cpus) * 100).toFixed(2);
        
        // Network info
        const networkInterfaces = os.networkInterfaces();
        let ipAddress = "N/A";
        for (const name of Object.keys(networkInterfaces)) {
            for (const net of networkInterfaces[name]) {
                if (net.family === 'IPv4' && !net.internal) {
                    ipAddress = net.address;
                    break;
                }
            }
        }
        
        // Create stats message
        const statsMessage = `
╔════════════════════════════════╗
║       📊 *SYSTEM STATISTICS*     ║
╚════════════════════════════════╝

🤖 *BOT:* ${botNameStyles[currentStyleIndex]}

📈 *PERFORMANCE METRICS:*
├─ 💾 RAM Usage: ${usedRAM}MB / ${totalRAM}GB
├─ 📊 Free RAM: ${freeRAM}GB
├─ 🧠 CPU Load: ${loadPercentage}%
├─ ⏳ Uptime: ${uptimeStr}
└─ 🌐 IP: ${ipAddress}

🔧 *HARDWARE INFO:*
├─ 🖥️ OS: ${platform.toUpperCase()}
├─ 🏗️ Arch: ${arch}
├─ 🔢 CPU Cores: ${cpus}
├─ 🧠 CPU Model: ${cpuModel}
└─ ⚙️ Node.js: ${process.version}

👤 *USER SESSION:*
├─ 🏷️ Name: ${pushname || "Unknown"}
├─ 📞 Number: ${sender.split('@')[0]}
└─ 🆔 User ID: ${sender.replace('@s.whatsapp.net', '')}

🎯 *SYSTEM HEALTH:* ${loadPercentage < 50 ? "✅ EXCELLENT" : loadPercentage < 80 ? "⚠️ GOOD" : "❌ HIGH LOAD"}

📌 *Commands:*
• .ping2 - Live speed test
• .ping - Quick ping
• .stats - This menu
• .alive - Bot status

🔐 *Last Updated:* ${new Date().toLocaleTimeString()}
        `.trim();
        
        await conn.sendMessage(from, {
            text: statsMessage,
            contextInfo: {
                mentionedJid: [sender],
                externalAdReply: {
                    title: "📊 SYSTEM DASHBOARD",
                    body: "Real-time Bot Performance",
                    thumbnail: { 
                        url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&q=80" 
                    },
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: mek });
        
    } catch (error) {
        console.error("Stats error:", error);
        reply(`Error: ${error.message}`);
    }
});
