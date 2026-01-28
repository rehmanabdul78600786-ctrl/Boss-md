cmd({
    pattern: "alive",
    alias: ["status", "bot", "online", "check"],
    desc: "🤖 Advanced Bot Status with Media",
    category: "main",
    react: "⚡",
    filename: __filename
},
async (conn, mek, m, { from, sender, pushname, reply, isGroup, participants }) => {
    try {
        const startTime = Date.now();
        
        // Dynamic loading message
        const loadingStates = [
            "🚀 *Initializing Systems...*",
            "📡 *Connecting to WhatsApp API...*",
            "🔧 *Loading Bot Modules...*",
            "⚡ *Finalizing Status...*"
        ];
        
        const loadingMsg = await reply(loadingStates[0]);
        
        // System Information (Developer Details)
        const os = require('os');
        const fs = require('fs');
        
        // Performance metrics
        const totalRAM = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
        const freeRAM = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);
        const usedRAM = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        const uptime = require('../lib/functions').runtime(process.uptime());
        
        // Platform detection
        const platform = os.platform();
        const arch = os.arch();
        const cpuCount = os.cpus().length;
        const cpuModel = os.cpus()[0].model.split('@')[0];
        
        // Heroku specific info
        const isHeroku = process.env.HEROKU_APP_NAME ? "✅ Heroku Cloud" : "❌ Local Server";
        const dynoType = process.env.DYNO || "Free Dyno";
        
        // Bot specific info
        const config = require('../config');
        const totalCommands = 200; // Adjust based on your bot
        
        // Response time calculation
        const responseTime = Date.now() - startTime;
        const speedStatus = responseTime < 500 ? "⚡ Ultra Fast" : 
                          responseTime < 1000 ? "🚀 Fast" : 
                          responseTime < 2000 ? "📊 Normal" : "🐢 Slow";
        
        // Dynamic time-based greeting
        const hour = new Date().getHours();
        let timeEmoji = "🌙";
        let greeting = "Good Night";
        if (hour >= 5 && hour < 12) {
            timeEmoji = "🌅";
            greeting = "Good Morning";
        } else if (hour >= 12 && hour < 17) {
            timeEmoji = "☀️";
            greeting = "Good Afternoon";
        } else if (hour >= 17 && hour < 21) {
            timeEmoji = "🌆";
            greeting = "Good Evening";
        }
        
        // Group information (if in group)
        let groupInfo = "";
        if (isGroup && participants) {
            const adminCount = participants.filter(p => p.admin).length;
            const botAdmin = participants.find(p => p.id.includes(conn.user.id.split(':')[0]))?.admin ? "✅" : "❌";
            groupInfo = `\n┣ 📊 *Group Stats:*
┃ ├ 👥 Members: ${participants.length}
┃ ├ 👑 Admins: ${adminCount}
┃ └ 🤖 Bot Admin: ${botAdmin}`;
        }
        
        // Create detailed status message
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
┃ 📦 Commands: ${totalCommands}+
┃ 🔗 Support: ${config.SUPPORT_GROUP || "Not Set"}
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ 👤 USER INFORMATION
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ 🏷️ Name: ${pushname || "Unknown"}
┃ 📞 Number: ${sender.split('@')[0]}
┃ 🆔 User ID: ${sender.replace('@s.whatsapp.net', '')}
┃ 📍 Chat Type: ${isGroup ? "Group" : "Private"}
${groupInfo}
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

${timeEmoji} *${greeting}, ${pushname || "User"}!*
*🤖 Bot is fully operational and ready to serve!*

📌 *Quick Commands:*
• .menu - Show all features
• .help - Command list
• .speed - Detailed speed test
• .owner - Contact developer

🔐 *Security Status: Active*
🔄 *Last Updated: ${new Date().toLocaleTimeString()}*
`;
        
        // Delete loading message
        if (loadingMsg) {
            await conn.sendMessage(from, { delete: loadingMsg.key });
        }
        
        // Option 1: Send with Video (Working URL)
        await conn.sendMessage(from, {
            video: { 
                url: "https://cdn.pixabay.com/video/2023/02/22/159945_tiny.mp4" // Short tech video
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
        
        // Option 2: Additional image (uncomment if needed)
        // await conn.sendMessage(from, {
        //     image: { 
        //         url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&q=80"
        //     },
        //     caption: "📊 *System Dashboard*\nBot is running optimally!"
        // });
        
        // Final confirmation
        await conn.sendMessage(from, {
            text: `✅ *Status sent successfully!*\n📊 Response: ${responseTime}ms\n${timeEmoji} Have a great day!`
        });
        
    } catch (error) {
        console.error("Alive Command Error:", error);
        
        // Fallback simple message
        await conn.sendMessage(from, {
            text: `🤖 *Bot Status: ONLINE*\n\n👤 User: ${pushname || "User"}\n⏰ Time: ${new Date().toLocaleTimeString()}\n✅ Bot is working fine!\n\nError in rich media: ${error.message}`
        }, { quoted: mek });
    }
});
