cmd({
    pattern: "alive",
    alias: ["status", "online", "check"],
    desc: "🤖 Hacker-Style Bot Status",
    category: "main",
    react: "👾",
    filename: __filename
},
async (conn, mek, m, { from, sender, pushname, reply, isGroup }) => {
    try {
        // Hacker typing effect
        await reply("📡 *ACCESSING BOT SYSTEMS...*");
        
        // System info
        const os = require('os');
        const totalRAM = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
        const usedRAM = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        const uptime = require('../lib/functions').runtime(process.uptime());
        
        // Time-based greeting
        const hour = new Date().getHours();
        let greeting = "🌙 GOOD NIGHT";
        if (hour < 12) greeting = "☀️ GOOD MORNING";
        else if (hour < 18) greeting = "⛅ GOOD AFTERNOON";
        
        // Hacker-style ASCII art
        const hackerArt = `
╔═══════════════════════════════════╗
║         ░▒▓█ 𝔹𝕆𝕊𝕊-𝕋𝔼ℂℍ █▓▒░         ║
║     ░▒▓█ 𝕎𝕙𝕒𝕥𝕤𝔸𝕡𝕡 𝔹𝕠𝕥 𝕊𝕪𝕤𝕥𝕖𝕞 █▓▒░    ║
╚═══════════════════════════════════╝`;
        
        // Status message with hacker theme
        const status = `
${hackerArt}

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
📡 *SYSTEM STATUS* ▸ **ONLINE** ✅
⚡ *RESPONSE TIME* ▸ **ULTRA FAST**
🔒 *SECURITY* ▸ **ENCRYPTED**
🛡️ *PROTECTION* ▸ **ACTIVE**

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
🖥️ **SYSTEM INFO:**
├─ 📊 RAM: ${usedRAM}MB / ${totalRAM}GB
├─ ⏳ UPTIME: ${uptime}
├─ 🖥️ OS: ${os.platform().toUpperCase()}
└─ 🔧 CORES: ${os.cpus().length}

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
👤 **USER DATA:**
├─ 👨‍💻 USER: ${pushname || "Anonymous"}
├─ 📞 NUMBER: ${sender.split('@')[0]}
└─ 🆔 ID: ${sender.replace('@s.whatsapp.net', '')}

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
🎮 **AVAILABLE MODULES:**
├─ 🎵 Media Downloader
├─ 📸 Sticker Creator
├─ 🎮 Mini Games
├─ 🔍 Web Search
└─ 🛠️ 200+ Commands

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
${greeting}, ${pushname || "User"}!
BOT IS READY FOR COMMANDS...

*[📡 SYSTEM INITIALIZATION COMPLETE]*`;

        // Send with COOL HACKER VIDEO
        await conn.sendMessage(from, {
            video: { 
                url: "https://assets.mixkit.co/videos/preview/mixkit-matrix-style-digital-code-1310-large.mp4"
            },
            caption: status,
            gifPlayback: false,
            contextInfo: {
                mentionedJid: [sender],
                externalAdReply: {
                    title: "⚡ BOSS-TECH SYSTEM ONLINE",
                    body: "Hacker Edition • Always Active",
                    thumbnail: { 
                        url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60" 
                    },
                    mediaType: 2,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error(e);
        await reply("❌ Error: " + e.message);
    }
});
