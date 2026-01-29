const { cmd } = require('../command');
const config = require('../config');
const os = require('os');

cmd({
    pattern: "alive",
    alias: ["status", "bot", "online", "check"],
    desc: "🤖 Advanced Bot Status with Media",
    category: "main",
    react: "⚡",
    filename: __filename
},
async (conn, mek, m, { from, sender, pushname, reply, isGroup }) => {
    try {
        const startTime = Date.now();

        // Instant reply for fast feedback
        const loadingMsg = await reply("⚡ Checking bot status...");

        // System metrics
        const totalRAM = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
        const freeRAM = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);
        const usedRAM = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);

        // Safe uptime calculation
        const uptimeSec = process.uptime();
        const uptime = `${Math.floor(uptimeSec / 3600)}h ${Math.floor((uptimeSec % 3600) / 60)}m ${Math.floor(uptimeSec % 60)}s`;

        const platform = os.platform();
        const arch = os.arch();
        const cpuCount = os.cpus().length;
        const cpuModel = os.cpus()[0].model.split('@')[0];

        const isHeroku = process.env.HEROKU_APP_NAME ? "✅ Heroku Cloud" : "❌ Local Server";
        const dynoType = process.env.DYNO || "Free Dyno";

        // Quick speed calculation
        const responseTime = Date.now() - startTime;
        const speedStatus = responseTime < 500 ? "⚡ Ultra Fast" :
                            responseTime < 1000 ? "🚀 Fast" :
                            responseTime < 2000 ? "📊 Normal" : "🐢 Slow";

        // Time-based greeting
        const hour = new Date().getHours();
        let timeEmoji = "🌙";
        let greeting = "Good Night";
        if (hour >= 5 && hour < 12) { timeEmoji = "🌅"; greeting = "Good Morning"; }
        else if (hour >= 12 && hour < 17) { timeEmoji = "☀️"; greeting = "Good Afternoon"; }
        else if (hour >= 17 && hour < 21) { timeEmoji = "🌆"; greeting = "Good Evening"; }

        // Group info (safe)
        let groupInfo = "";
        let groupParticipants = [];
        if (isGroup) {
            const metadata = await conn.groupMetadata(from);
            groupParticipants = metadata.participants || [];
            const adminCount = groupParticipants.filter(p => p.admin).length;
            const botAdmin = groupParticipants.find(p => p.id.includes(conn.user.id.split(':')[0]))?.admin ? "✅" : "❌";
            groupInfo = `\n┣ 📊 *Group Stats:*\n┃ ├ 👥 Members: ${groupParticipants.length}\n┃ ├ 👑 Admins: ${adminCount}\n┃ └ 🤖 Bot Admin: ${botAdmin}`;
        }

        // Detailed status message
        const statusMessage = `
╔════════════════════════════════╗
║      🚀 ADVANCED BOT STATUS     ║
╚════════════════════════════════╝

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ 📊 PERFORMANCE METRICS
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ ⚡ Response Time: ${responseTime}ms
┃ 🏆 Speed: ${speedStatus}
┃ ⏳ Uptime: ${uptime}
┃ 💾 Memory: ${usedRAM}MB / ${totalRAM}GB
┃ 🆓 Free RAM: ${freeRAM}GB
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ 🔧 SYSTEM INFORMATION
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ 🖥️ Platform: ${platform.toUpperCase()}
┃ 🏗️ Architecture: ${arch}
┃ 🔢 CPU Cores: ${cpuCount}
┃ 🧠 CPU Model: ${cpuModel}
┃ ☁️ Hosting: ${isHeroku}
┃ ⚙️ Dyno Type: ${dynoType}
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ 🤖 BOT CONFIGURATION
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ 👑 Owner: ${config.OWNER_NAME || "Not Set"}
┃ ⚡ Prefix: ${config.PREFIX || "."}
┃ 🛡️ Mode: ${config.MODE || "Public"}
┃ 📦 Commands: 200+
┃ 🔗 Support: ${config.SUPPORT_GROUP || "Not Set"}
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ 👤 USER INFORMATION
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ 🏷️ Name: ${pushname || "Unknown"}
┃ 📞 Number: ${sender.split('@')[0]}
┃ 🆔 User ID: ${sender.replace('@s.whatsapp.net', '')}
┃ 📍 Chat Type: ${isGroup ? "Group" : "Private"}${groupInfo}
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

${timeEmoji} *${greeting}, ${pushname || "User"}!*
*🤖 Bot is fully operational and ready to serve!*

📌 *Quick Commands:*
• .menu - Show all features
• .help - Command list
• .speed - Detailed speed test
• .owner - Contact developer
`;

        // Delete fast reply
        if (loadingMsg) await conn.sendMessage(from, { delete: loadingMsg.key });

        // Send video with caption
        await conn.sendMessage(from, {
            video: { 
                url: "https://cdn.pixabay.com/videos/hacker-system-computer-dice-166650.mp4" // ✅ Your video link
            },
            caption: statusMessage,
            gifPlayback: false,
            contextInfo: {
                mentionedJid: [sender],
                externalAdReply: {
                    title: "⚡ BOT STATUS: ONLINE",
                    body: "Advanced WhatsApp Bot System",
                    thumbnail: { 
                        url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&q=80"
                    },
                    mediaType: 2,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: mek });

        // Final confirmation text
        await conn.sendMessage(from, {
            text: `✅ *Status sent successfully!*\n📊 Response: ${responseTime}ms\n${timeEmoji} Have a great day!`
        });

    } catch (error) {
        console.error("Alive Command Error:", error);
        await conn.sendMessage(from, {
            text: `🤖 *Bot Status: ONLINE*\n👤 User: ${pushname || "User"}\n⏰ Time: ${new Date().toLocaleTimeString()}\n✅ Bot is working fine!\n\nError in rich media: ${error.message}`
        }, { quoted: mek });
    }
});
