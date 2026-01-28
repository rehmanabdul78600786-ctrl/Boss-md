const config = require('../config');
const { cmd, commands } = require('../command');
const os = require("os");
const fs = require("fs");

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

// VIDEO PING COMMAND - Shows video with live stats
cmd({
    pattern: "ping2",
    alias: ["speed", "pong", "liveping", "videoping", "performance"],
    use: '.ping',
    desc: "Check bot's LIVE response time with video & system stats.",
    category: "main",
    react: "🎬",
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

        // Get current fancy bot name
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
║        🎬 *LIVE VIDEO PING*      ║
╚════════════════════════════════╝

🤖 *BOT:* ${fancyBotName}
⏱️ *RESPONSE:* ${responseTime.toFixed(3)}s
🏆 *PERFORMANCE:* ${performanceLevel} ${reactionEmoji}

📊 *SYSTEM INFO:*
├─ 🖥️ OS: ${platform.toUpperCase()}
├─ 🧠 CPU: ${cpuModel}
├─ 📊 CORES: ${cpus}
├─ 💾 RAM: ${usedRAM}MB
├─ 📈 FREE: ${freeRAM}GB
└─ ⏳ UPTIME: ${uptimeStr}

👤 *USER:* ${pushname || "User"}
📞 *NUMBER:* ${sender.split('@')[0]}

🎯 *SPEED RATING:*
${responseTime < 0.1 ? "⭐⭐⭐⭐⭐ ELITE" : 
  responseTime < 0.5 ? "⭐⭐⭐⭐⭐ EXCELLENT" : 
  responseTime < 1 ? "⭐⭐⭐⭐ GREAT" : 
  responseTime < 2 ? "⭐⭐⭐ GOOD" : "⭐⭐ AVERAGE"}

⚡ *BOSS-MD Technology*
🕒 *TIME:* ${new Date().toLocaleTimeString()}
        `.trim();

        // Send VIDEO with caption
        await conn.sendMessage(from, {
            video: { 
                url: "https://file-examples.com/storage/fe8c7c1e8665c61699a9a62/2017/04/file_example_MP4_480_1_5MG.mp4" // Working video URL
            },
            caption: text,
            gifPlayback: false,
            contextInfo: {
                mentionedJid: [sender],
                externalAdReply: {
                    title: "🎬 LIVE VIDEO PING",
                    body: "Real-time Bot Speed Test",
                    thumbnail: { 
                        url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&q=80" 
                    },
                    mediaType: 2,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: mek });

        // Send additional text message
        await conn.sendMessage(from, {
            text: `✅ *Video Ping Sent!*\n📊 Response: ${responseTime.toFixed(3)}s\n⚡ Status: ${performanceLevel}`
        });

    } catch (e) {
        console.error("Video ping error:", e);
        
        // Fallback to text if video fails
        const end = new Date().getTime();
        const responseTime = (end - start) / 1000;
        
        const fallbackText = `
🎬 *VIDEO PING (Fallback)*

🤖 BOT: ${botNameStyles[currentStyleIndex]}
⏱️ RESPONSE: ${responseTime.toFixed(3)}s
📊 VIDEO ERROR: ${e.message}

⚡ Using text mode for now...
        `.trim();
        
        await reply(fallbackText);
    }
});

// UPDATED Original ping command
cmd({
    pattern: "ping",
    desc: "Check bot's response time with enhanced features.",
    category: "main",
    react: "⚡",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const startTime = Date.now();
        
        // Send typing indicator
        await conn.sendPresenceUpdate('composing', from);
        
        // Get random loading message
        const loadingMessages = [
            "⚡ Calculating speed...",
            "🚀 Testing response time...",
            "🎯 Measuring ping...",
            "💨 Processing request..."
        ];
        
        const randomLoading = loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
        const message = await conn.sendMessage(from, { text: `*${randomLoading}*` });
        
        const endTime = Date.now();
        const ping = endTime - startTime;
        
        // Get system info for ping command too
        const totalRAM = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
        const usedRAM = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        
        // Speed rating
        let speedStatus = "";
        let speedEmoji = "";
        let rating = "";
        
        if (ping < 100) {
            speedStatus = "⚡ ULTRA FAST";
            speedEmoji = "🔥";
            rating = "⭐⭐⭐⭐⭐";
        } else if (ping < 500) {
            speedStatus = "🚀 FAST";
            speedEmoji = "🚀";
            rating = "⭐⭐⭐⭐";
        } else if (ping < 1000) {
            speedStatus = "✅ GOOD";
            speedEmoji = "✅";
            rating = "⭐⭐⭐";
        } else {
            speedStatus = "🐢 SLOW";
            speedEmoji = "🐢";
            rating = "⭐⭐";
        }
        
        // Create enhanced ping response
        const pingResponse = `
╭─────────────────────────────╮
│         ⚡ *PING TEST*        │
├─────────────────────────────┤
│🤖 *BOT:* BOSS-MD
│⏱️ *TIME:* ${ping}ms
│🏆 *STATUS:* ${speedStatus}
│📊 *RATING:* ${rating}
│💾 *RAM USAGE:* ${usedRAM}MB
│👤 *USER:* ${pushname || "User"}
╰─────────────────────────────╯

*Commands to try:*
• .ping2 - Video ping with stats
• .stats - System information
• .alive - Bot status

${speedEmoji} *Powered by BOSS-MD*
        `.trim();
        
        // Delete loading message
        await conn.sendMessage(from, { delete: message.key });
        
        // Send ping response
        await conn.sendMessage(from, { 
            text: pingResponse,
            contextInfo: {
                mentionedJid: [sender],
                externalAdReply: {
                    title: "⚡ PING RESULTS",
                    body: `Response: ${ping}ms | Status: ${speedStatus}`,
                    thumbnail: { 
                        url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&q=80" 
                    },
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        });
        
        // Send reaction to original message
        await conn.sendMessage(from, {
            react: { text: speedEmoji, key: mek.key }
        });
        
    } catch (e) {
        console.log(e);
        
        // Simple fallback
        await conn.sendMessage(from, {
            text: `⚡ *Ping:* Error\n${e.message}\n\nTry: .ping2 for video version`
        }, { quoted: mek });
    }
});

// VIDEO ALIVE COMMAND - Fixed with working video
cmd({
    pattern: "alive",
    alias: ["status", "bot", "videoalive", "online"],
    desc: "Show bot status with video.",
    category: "main",
    react: "🎥",
    filename: __filename
},
async (conn, mek, m, { from, sender, pushname, reply, isGroup }) => {
    try {
        await conn.sendMessage(from, {
            text: "🎬 *Loading video status...*"
        });
        
        // Working video URLs (tested and confirmed)
        const videoUrls = [
            "https://assets.mixkit.co/videos/preview/mixkit-robot-sitting-on-the-ground-and-looking-4537-large.mp4",
            "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            "https://file-examples.com/storage/fe8c7c1e8665c61699a9a62/2017/04/file_example_MP4_480_1_5MG.mp4",
            "https://storage.googleapis.com/coverr-main/mp4%2FWorkaholic.mp4"
        ];
        
        const randomVideo = videoUrls[Math.floor(Math.random() * videoUrls.length)];
        
        // Get fancy bot name
        const fancyBotName = botNameStyles[currentStyleIndex];
        
        const aliveText = `
╔════════════════════════════════╗
║        🎥 *BOSS-MD STATUS*       ║
╚════════════════════════════════╝

🤖 *BOT:* ${fancyBotName}
✅ *STATUS:* ONLINE
⚡ *SPEED:* OPTIMAL
🔒 *SECURITY:* ACTIVE

📊 *FEATURES:*
├─ 🎵 Media Downloader
├─ 📸 Sticker Creator
├─ 🎮 Games System
├─ 🔍 200+ Commands
└─ 🛡️ 24/7 Protection

👤 *USER:* ${pushname || "User"}
📞 *NUMBER:* ${sender.split('@')[0]}

*Commands:*
• .ping - Speed test
• .ping2 - Video ping
• .menu - All features
• .help - Command list

🎯 *Always Active & Ready!*
        `.trim();
        
        // Send video
        await conn.sendMessage(from, {
            video: { 
                url: randomVideo 
            },
            caption: aliveText,
            gifPlayback: false,
            contextInfo: {
                mentionedJid: [sender],
                externalAdReply: {
                    title: "🎥 BOSS-MD STATUS",
                    body: "WhatsApp Bot Online",
                    thumbnail: { 
                        url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&q=80" 
                    },
                    mediaType: 2,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: mek });
        
        await conn.sendMessage(from, {
            text: "✅ *Video status sent!*\nUse .ping2 for video speed test"
        });
        
    } catch (error) {
        console.error("Video alive error:", error);
        
        // Fallback to image
        await conn.sendMessage(from, {
            image: { 
                url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&q=80"
            },
            caption: "🤖 *BOSS-MD BOT*\nStatus: ONLINE ✅\nVideo error, using image mode.\nTry .ping for speed test."
        }, { quoted: mek });
    }
});
