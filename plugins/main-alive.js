const { cmd } = require('../command');
const config = require('../config');
const os = require('os');

cmd({
    pattern: "alive",
    alias: ["status", "bot", "online", "check"],
    desc: "🤖 Advanced Bot Status with Video & Details",
    category: "main",
    react: "⚡",
    filename: __filename
},
async (conn, mek, m, { from, sender, pushname, reply, isGroup }) => {
    try {
        const startTime = Date.now();

        // SYSTEM METRICS
        const totalRAM = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
        const freeRAM = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);
        const usedRAM = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);

        const uptimeSec = process.uptime();
        const uptime = `${Math.floor(uptimeSec / 3600)}h ${Math.floor((uptimeSec % 3600) / 60)}m ${Math.floor(uptimeSec % 60)}s`;

        const platform = os.platform();
        const arch = os.arch();
        const cpuCount = os.cpus().length;
        const cpuModel = os.cpus()[0].model.split('@')[0];

        const isHeroku = process.env.HEROKU_APP_NAME ? "✅ Heroku Cloud" : "❌ Local Server";
        const dynoType = process.env.DYNO || "Free Dyno";

        const responseTime = Date.now() - startTime;
        const speedStatus = responseTime < 500 ? "⚡ Ultra Fast" :
                            responseTime < 1000 ? "🚀 Fast" :
                            responseTime < 2000 ? "📊 Normal" : "🐢 Slow";

        // GREETING
        const hour = new Date().getHours();
        let timeEmoji = "🌙";
        let greeting = "Good Night";
        if (hour >= 5 && hour < 12) { timeEmoji = "🌅"; greeting = "Good Morning"; }
        else if (hour >= 12 && hour < 17) { timeEmoji = "☀️"; greeting = "Good Afternoon"; }
        else if (hour >= 17 && hour < 21) { timeEmoji = "🌆"; greeting = "Good Evening"; }

        // GROUP INFO
        let groupInfo = "";
        if (isGroup) {
            const metadata = await conn.groupMetadata(from);
            const participants = metadata.participants || [];
            const adminCount = participants.filter(p => p.admin).length;
            const botAdmin = participants.find(p => p.id.includes(conn.user.id.split(':')[0]))?.admin ? "✅" : "❌";
            groupInfo = `\n┣ 📊 *Group Stats:*\n┃ ├ 👥 Members: ${participants.length}\n┃ ├ 👑 Admins: ${adminCount}\n┃ └ 🤖 Bot Admin: ${botAdmin}`;
        }

        // BUILD STATUS MESSAGE
        const statusMessage = `
╔════════════════════════════════╗
║      🚀 WORLD'S BEST DEVELOPER  ║
╚════════════════════════════════╝

🤖 *Bot Name:* ${config.BOT_NAME || "BOSS-MD"}
👑 *Owner:* ${config.OWNER_NAME || "Legendary Developer"}
⚡ *Speed:* ${speedStatus} (${responseTime}ms)
⏳ *Uptime:* ${uptime}
💾 *RAM Usage:* ${usedRAM}MB / ${totalRAM}GB
🖥️ *Platform:* ${platform.toUpperCase()} | Arch: ${arch}
🔢 *CPU:* ${cpuModel} (${cpuCount} Cores)
☁️ *Hosting:* ${isHeroku} | Dyno: ${dynoType}
📍 *Chat Type:* ${isGroup ? "Group" : "Private"}${groupInfo}

${timeEmoji} *${greeting}, ${pushname || "User"}!*
🎯 *Bot is fully operational and alive!* 💎
`;

        // DELETE loading message if exists
        if (m.quoted && m.quoted.key) await conn.sendMessage(from, { delete: m.quoted.key });

        // SEND VIDEO WITH STATUS
        await conn.sendMessage(from, {
            video: { url: "https://files.catbox.moe/uraa69.mp4" }, // ✅ Working video
            caption: statusMessage,
            gifPlayback: false,
            contextInfo: {
                mentionedJid: [sender],
                externalAdReply: {
                    title: "⚡ BOSS-MD STATUS: ONLINE",
                    body: "World's Best Developer is Alive!",
                    thumbnail: { 
                        url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&q=80" 
                    },
                    mediaType: 2,
                    renderLargerThumbnail: true
                }
            }
        });

    } catch (error) {
        console.error("Alive Command Error:", error);
        await conn.sendMessage(from, {
            text: `🤖 *Bot Status: ONLINE*\n👤 User: ${pushname || "User"}\n⏰ Time: ${new Date().toLocaleTimeString()}\n✅ Bot is alive!\n\nError in video: ${error.message}`
        }, { quoted: m });
    }
});
