const { cmd } = require('../command');
const os = require("os");
const { runtime } = require('../lib/functions');
const config = require('../config');

cmd({
    pattern: "alive",
    alias: ["status", "online", "a", "check", "bot", "on", "ہیلو", "زندہ", "जिंदा", "ജീവനുള്ള"],
    desc: "🤖 BOSS-TECH WhatsApp Bot",
    category: "main",
    react: "⚡",
    filename: __filename
},
async (conn, mek, m, { from, sender, pushname, reply, isGroup, groupName, participants }) => {
    try {
        // BOSS-TECH Loading effect
        const loadingMsg = await conn.sendMessage(from, {
            text: "🚀 *BOSS-TECH STATUS LOADING...*"
        });

        // Get all system info
        const totalRAM = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
        const usedRAM = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        const freeRAM = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);
        const uptime = runtime(process.uptime());
        const platform = os.platform();
        const arch = os.arch();
        const cpus = os.cpus().length;
        const cpuModel = os.cpus()[0].model;
        
        // Get group info if in group
        let groupInfo = "";
        if (isGroup) {
            const adminCount = participants.filter(p => p.admin).length;
            groupInfo = `│👥 *Group:* ${groupName}\n│👑 *Admins:* ${adminCount}\n│👤 *Members:* ${participants.length}\n├────────────────────◉\n`;
        }

        // Create dynamic emoji based on time
        const hour = new Date().getHours();
        let timeEmoji = "🌞";
        if (hour >= 18 || hour < 6) timeEmoji = "🌙";
        if (hour >= 6 && hour < 12) timeEmoji = "☀️";
        if (hour >= 12 && hour < 18) timeEmoji = "⛅";

        // Create BOSS-TECH banner
        const banner = `
╔═══════════════════════════════╗
║         🤖 *BOSS-TECH* 🤖         ║
╚═══════════════════════════════╝`;

        // Create the main status
        const status = `
${banner}

╭─────────────────────────────◉
│${timeEmoji} *𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗧𝗢 𝗕𝗢𝗦𝗦-𝗧𝗘𝗖𝗛*
├─────────────────────────────◉
│🤖 *BOT STATUS:* ONLINE ✅
│👑 *OWNER:* ${config.OWNER_NAME}
│⚡ *PREFIX:* [ ${config.PREFIX} ]
│📦 *VERSION:* 3.0
│🔧 *MODE:* ${config.MODE || "PUBLIC"}
├─────────────────────────────◉
│💻 *SYSTEM INFORMATION:*
│🖥️ *OS:* ${platform.toUpperCase()} | ${arch}
│🧠 *CPU:* ${cpuModel.split('@')[0]}
│📊 *CORES:* ${cpus} Core
│💾 *RAM:* ${usedRAM}MB / ${totalRAM}GB
│📈 *FREE RAM:* ${freeRAM}GB
│⏳ *UPTIME:* ${uptime}
├─────────────────────────────◉
${groupInfo}│👤 *USER:* ${pushname || "User"}
│📞 *YOUR NUMBER:* ${sender.split('@')[0]}
│🆔 *YOUR ID:* ${sender.split('@')[0]}
╰─────────────────────────────◉

🔥 *FEATURES:*
• 200+ Commands
• 24/7 Active
• Anti-Delete Messages
• Media Downloader
• Sticker Creator
• YouTube Downloader
• Game System

💬 *COMMANDS:*
• .help - All Commands
• .menu - Features Menu
• .speed - Bot Speed Test
• .owner - Contact Owner

📢 *MESSAGE FROM DEVELOPER:*
"Thank you for using BOSS-TECH!"

🔗 *SUPPORT:* ${config.SUPPORT_GROUP || "Not set"}

*⚡ POWERED BY: ${config.OWNER_NAME}*
*🎯 STATUS: ACTIVE & READY!*`;

        // Send VIDEO message instead of image
        await conn.sendMessage(from, {
            video: { 
                url: config.ALIVE_VIDEO_URL || "https://assets.mixkit.co/videos/preview/mixkit-hacker-typing-on-computer-while-looking-at-data-on-another-screen-28208-large.mp4"
            },
            caption: status,
            gifPlayback: false,
            contextInfo: {
                mentionedJid: [sender],
                externalAdReply: {
                    title: "BOSS-TECH WhatsApp Bot",
                    body: "Advanced WhatsApp Bot Solution",
                    thumbnail: { url: config.MENU_IMAGE_URL || "https://i.imgur.com/image.jpg" },
                    mediaType: 2,
                    renderLargerThumbnail: true,
                    showAdAttribution: true
                },
                forwardingScore: 9999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363405061777123@newsletter',
                    newsletterName: '𝐁𝐎𝐒𝐒-𝐓𝐄𝐂𝐇',
                    serverMessageId: 999
                }
            }
        }, { quoted: mek });

        // Delete loading message
        await conn.sendMessage(from, { delete: loadingMsg.key });

        // Send follow-up message
        await conn.sendMessage(from, {
            text: "✅ *BOSS-TECH STATUS SENT!*"
        });

    } catch (e) {
        console.error("BOSS-TECH Alive Error:", e);
        // Fallback to image if video fails
        await conn.sendMessage(from, {
            image: { url: config.MENU_IMAGE_URL || "https://i.imgur.com/image.jpg" },
            caption: "🚀 *BOSS-TECH WhatsApp Bot*\nBot is alive and running!"
        }, { quoted: mek });
    }
});

// Ping command for BOSS-TECH
cmd({
    pattern: "ping",
    alias: ["speed", "pong", "test"],
    desc: "🚀 BOSS-TECH Speed Test",
    category: "main",
    react: "⚡",
    filename: __filename
},
async (conn, mek, m, { reply }) => {
    const start = Date.now();
    const msg = await reply("🚀 *Testing BOSS-TECH Speed...*");
    const end = Date.now();
    const speed = end - start;
    
    const speedStatus = speed < 200 ? "⚡ FAST" : 
                       speed < 500 ? "🚀 GOOD" : 
                       speed < 1000 ? "📊 AVERAGE" : "🐢 SLOW";
    
    await reply(`✅ *BOSS-TECH PING RESULTS:*\n\n` +
                `📊 *Response Time:* ${speed}ms\n` +
                `🏆 *Speed Level:* ${speedStatus}\n` +
                `🔥 *BOSS-TECH: Reliable & Fast!*`);
});
