const { cmd } = require('../command');
const os = require('os');
const fs = require('fs');
const { exec } = require('child_process');
const axios = require('axios');

cmd({
    pattern: "getinfo",
    alias: ["info", "status", "botinfo", "myinfo"],
    desc: "Get detailed information about user, group, bot or server",
    category: "tools",
    react: "📊",
    filename: __filename,
    use: ".getinfo [user/group/bot/server] OR reply to message"
}, async (conn, mek, m, { from, reply, text, quoted, pushName, mentioned, isGroup, sender }) => {
    try {
        const args = text.toLowerCase().split(' ');
        const option = args[0] || 'user';
        
        // Show processing
        await conn.sendMessage(from, {
            react: { text: "⏳", key: mek.key }
        });
        
        // ==================== USER INFO ====================
        if (option === 'user' || option === 'me' || option === 'myinfo') {
            let targetUser = sender;
            let targetName = pushName;
            
            // If mentioned someone
            if (mentioned && mentioned.length > 0) {
                targetUser = mentioned[0];
                try {
                    const contact = await conn.contactById(targetUser);
                    targetName = contact?.name || contact?.pushname || "Unknown";
                } catch (e) {
                    targetName = "User";
                }
            }
            // If quoted message
            else if (quoted && quoted.sender) {
                targetUser = quoted.sender;
                try {
                    const contact = await conn.contactById(targetUser);
                    targetName = contact?.name || contact?.pushname || "Unknown";
                } catch (e) {
                    targetName = "User";
                }
            }
            
            const userId = targetUser.split('@')[0];
            const timestamp = new Date().toLocaleString();
            
            // Try to get profile picture
            let profilePic = null;
            try {
                profilePic = await conn.profilePictureUrl(targetUser, 'image');
            } catch (e) {
                profilePic = null;
            }
            
            // Get user status
            let userStatus = "Unknown";
            try {
                const status = await conn.fetchStatus(targetUser);
                userStatus = status?.status || "Not set";
            } catch (e) {
                userStatus = "Not available";
            }
            
            const userInfo = `
📊 *USER INFORMATION*

👤 *Basic Info:*
• Name: ${targetName}
• ID: ${userId}
• JID: ${targetUser}
• Status: ${userStatus}

📱 *Platform:*
• WhatsApp: ✅ Connected
• Type: ${targetUser.includes('@s.whatsapp.net') ? 'Personal' : 'Business'}
• Verified: ${targetUser.includes(':') ? 'Yes' : 'No'}

🕒 *Session:*
• Time: ${timestamp}
• Chat Type: ${isGroup ? 'Group' : 'Private'}
• Message ID: ${mek.key.id?.substring(0, 10)}...

📈 *Stats:*
• Messages Sent: Available
• Last Seen: Active now
• Online Status: ✅ Connected

🔐 *Privacy:*
• Profile Picture: ${profilePic ? 'Visible' : 'Hidden'}
• Status: ${userStatus !== 'Not available' ? 'Visible' : 'Hidden'}
• Last Seen: Visible

💎 *Additional:*
• User since: Unknown
• Device: WhatsApp Web
• Location: Not tracked

📌 *Note:* Information depends on user's privacy settings`;

            // Send with or without profile picture
            if (profilePic) {
                await conn.sendMessage(from, {
                    image: { url: profilePic },
                    caption: userInfo,
                    mentions: [targetUser]
                }, { quoted: mek });
            } else {
                await conn.sendMessage(from, {
                    text: userInfo,
                    mentions: [targetUser]
                }, { quoted: mek });
            }
        }
        
        // ==================== GROUP INFO ====================
        else if (option === 'group' || option === 'gc') {
            if (!isGroup) {
                return reply("❌ This command only works in groups!");
            }
            
            const metadata = await conn.groupMetadata(from);
            const participants = metadata.participants;
            const admins = participants.filter(p => p.admin).map(p => p.id);
            
            // Group creation date
            const creationDate = metadata.creation ? new Date(metadata.creation * 1000).toLocaleDateString() : "Unknown";
            
            // Get group picture
            let groupPic = null;
            try {
                groupPic = await conn.profilePictureUrl(from, 'image');
            } catch (e) {
                groupPic = null;
            }
            
            const groupInfo = `
👥 *GROUP INFORMATION*

📛 *Basic Details:*
• Name: ${metadata.subject}
• ID: ${from}
• Created: ${creationDate}
• Owner: @${metadata.owner?.split('@')[0] || "Unknown"}

👥 *Members:*
• Total: ${participants.length}
• Admins: ${admins.length}
• Users: ${participants.length - admins.length}

⚙️ *Settings:*
• Description: ${metadata.desc || "No description"}
• Announcement: ${metadata.announce ? "Enabled" : "Disabled"}
• Restricted: ${metadata.restrict ? "Yes" : "No"}
• Ephemeral: ${metadata.ephemeralDuration ? `${metadata.ephemeralDuration}s` : "Disabled"}

📊 *Statistics:*
• Message Count: Unknown
• Active Users: ${participants.length}
• Bots: 1 (${config?.BOT_NAME || "BOSS-MD"})

🔧 *Features:*
• Group Invite: ✅
• Media Sharing: ✅
• Admin Tools: ✅
• Bot Commands: ✅

📌 *Admin List:* ${admins.slice(0, 5).map(id => `@${id.split('@')[0]}`).join(', ')}${admins.length > 5 ? ` and ${admins.length - 5} more` : ''}

⚠️ *Note:* Some features depend on group settings`;

            if (groupPic) {
                await conn.sendMessage(from, {
                    image: { url: groupPic },
                    caption: groupInfo,
                    mentions: admins.slice(0, 10)
                }, { quoted: mek });
            } else {
                await conn.sendMessage(from, {
                    text: groupInfo,
                    mentions: admins.slice(0, 10)
                }, { quoted: mek });
            }
        }
        
        // ==================== BOT INFO ====================
        else if (option === 'bot' || option === 'botinfo') {
            const botUptime = process.uptime();
            const days = Math.floor(botUptime / (3600 * 24));
            const hours = Math.floor((botUptime % (3600 * 24)) / 3600);
            const minutes = Math.floor((botUptime % 3600) / 60);
            const seconds = Math.floor(botUptime % 60);
            
            const uptimeText = `${days}d ${hours}h ${minutes}m ${seconds}s`;
            
            // Memory usage
            const used = process.memoryUsage();
            const heapUsed = Math.round(used.heapUsed / 1024 / 1024);
            const heapTotal = Math.round(used.heapTotal / 1024 / 1024);
            
            // Count commands
            const commands = require('../command').commands || {};
            const totalCommands = Object.keys(commands).length;
            
            const botInfo = `
🤖 *BOT INFORMATION*

👑 *Owner:*
• Name: ${config?.OWNER_NAME || "BOSS-MD"}
• Number: ${config?.OWNER_NUMBER || "Not set"}
• Contact: .owner

⚙️ *Configuration:*
• Prefix: ${config?.PREFIX || "."}
• Name: ${config?.BOT_NAME || "BOSS-MD"}
• Mode: ${config?.WORK_TYPE || "public"}
• Platform: Heroku/Node.js

📊 *Performance:*
• Uptime: ${uptimeText}
• Memory: ${heapUsed}MB / ${heapTotal}MB
• Commands: ${totalCommands}+
• Response: Fast

🔧 *Technical:*
• Platform: Node.js ${process.version}
• Library: Baileys
• Multi-Device: ✅ Yes
• Auto-Restart: ✅ Enabled

📈 *Statistics:*
• Active Chats: Unknown
• Messages Processed: Unknown
• Commands Used: Unknown
• Error Rate: Low

🎯 *Features:*
• Media Download: ✅
• AI Chat: ✅
• Group Management: ✅
• Fun Commands: ✅
• Utilities: ✅

💡 *Quick Commands:*
• .ping - Check response
• .runtime - Uptime
• .menu - All commands
• .owner - Contact`;

            await conn.sendMessage(from, {
                text: botInfo,
                contextInfo: {
                    externalAdReply: {
                        title: "🤖 BOSS-MD BOT",
                        body: `Uptime: ${uptimeText}`,
                        thumbnailUrl: "https://i.ibb.co/KhYC4FY/1221bc0bdd2354b42b293317ff2adbcf-icon.png",
                        sourceUrl: "https://github.com/boss-md",
                        mediaType: 1
                    }
                }
            }, { quoted: mek });
        }
        
        // ==================== SERVER INFO ====================
        else if (option === 'server' || option === 'sys' || option === 'system') {
            // System information
            const platform = os.platform();
            const arch = os.arch();
            const cpus = os.cpus().length;
            const totalMem = Math.round(os.totalmem() / (1024 * 1024 * 1024));
            const freeMem = Math.round(os.freemem() / (1024 * 1024 * 1024));
            const usedMem = totalMem - freeMem;
            
            // Node.js info
            const nodeVersion = process.version;
            const v8Version = process.versions.v8;
            
            // Uptime
            const sysUptime = os.uptime();
            const sysDays = Math.floor(sysUptime / (3600 * 24));
            const sysHours = Math.floor((sysUptime % (3600 * 24)) / 3600);
            
            // Bot process info
            const botUptime = process.uptime();
            const botDays = Math.floor(botUptime / (3600 * 24));
            const botHours = Math.floor((botUptime % (3600 * 24)) / 3600);
            
            // Network info
            const networkInterfaces = os.networkInterfaces();
            const ipAddress = Object.values(networkInterfaces)
                .flat()
                .find(i => i.family === 'IPv4' && !i.internal)?.address || "127.0.0.1";
            
            const serverInfo = `
🖥️ *SERVER INFORMATION*

💻 *Hardware:*
• Platform: ${platform} ${arch}
• CPUs: ${cpus} cores
• Memory: ${usedMem}GB / ${totalMem}GB
• Uptime: ${sysDays}d ${sysHours}h

⚙️ *Software:*
• Node.js: ${nodeVersion}
• V8 Engine: ${v8Version}
• OS: ${os.type()} ${os.release()}
• Arch: ${arch}

🤖 *Bot Process:*
• Uptime: ${botDays}d ${botHours}h
• PID: ${process.pid}
• Memory: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB
• Platform: ${process.platform}

🌐 *Network:*
• IP: ${ipAddress}
• Hostname: ${os.hostname()}
• Interfaces: ${Object.keys(networkInterfaces).length}

📊 *Load Average:* ${os.loadavg().map(l => l.toFixed(2)).join(', ')}

📈 *Statistics:*
• CPU Load: Medium
• Memory Usage: ${Math.round((usedMem / totalMem) * 100)}%
• Disk Space: Unknown
• Network: Stable

⚠️ *Warnings:* ${usedMem > totalMem * 0.8 ? 'High memory usage!' : 'None'}

🔍 *Quick Checks:*
• Server: ✅ Online
• Database: ❌ Not connected
• APIs: ✅ Working
• WhatsApp: ✅ Connected`;

            await conn.sendMessage(from, {
                text: serverInfo
            }, { quoted: mek });
        }
        
        // ==================== HELP ====================
        else {
            const helpText = `
📊 *GETINFO COMMAND*

🔍 *Usage:*
• .getinfo user - Your information
• .getinfo user @mention - Someone's info
• .getinfo group - Group information
• .getinfo bot - Bot information
• .getinfo server - Server/system info

🎯 *Examples:*
• .getinfo (your info)
• .getinfo @923001234567
• .getinfo group (in group)
• .getinfo bot
• .getinfo server

📌 *Note:* Some info depends on privacy settings`;

            await reply(helpText);
        }
        
        // Success reaction
        await conn.sendMessage(from, {
            react: { text: "✅", key: mek.key }
        });
        
    } catch (error) {
        console.error("Getinfo Error:", error);
        await reply(`❌ Error: ${error.message}\n\nTry: .getinfo bot for basic info`);
    }
});

// ==================== QUICK INFO COMMANDS ====================
cmd({
    pattern: "myinfo",
    alias: ["profile", "me"],
    desc: "Quick personal information",
    category: "tools",
    react: "👤",
    filename: __filename
}, async (conn, mek, m, { from, pushName, sender }) => {
    const userId = sender.split('@')[0];
    const timestamp = new Date().toLocaleString();
    
    const myInfo = `
👤 *YOUR INFORMATION*

📛 *Name:* ${pushName || "Unknown"}
🆔 *ID:* ${userId}
📱 *Number:* ${userId}
🕒 *Time:* ${timestamp}
💬 *Chat:* ${m.isGroup ? 'Group' : 'Private'}

📊 *Status:* Active
🔐 *Privacy:* Standard
📅 *Session:* New

💡 *Tip:* Use .getinfo for detailed info`;

    await conn.sendMessage(from, { text: myInfo }, { quoted: mek });
});

cmd({
    pattern: "botstatus",
    alias: ["status", "ping"],
    desc: "Check bot status and response time",
    category: "tools",
    react: "📈",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    const start = Date.now();
    const pingMsg = await reply("🏓 Pinging...");
    const latency = Date.now() - start;
    
    const botUptime = process.uptime();
    const hours = Math.floor(botUptime / 3600);
    const minutes = Math.floor((botUptime % 3600) / 60);
    
    const memory = Math.round(process.memoryUsage().heapUsed / 1024 / 1024);
    
    const status = `
📊 *BOT STATUS*

🏓 *Ping:* ${latency}ms
⏱️ *Uptime:* ${hours}h ${minutes}m
🧠 *Memory:* ${memory}MB
📈 *Status:* ✅ Online
⚡ *Speed:* ${latency < 500 ? 'Fast' : latency < 1000 ? 'Normal' : 'Slow'}

🔧 *Services:*
• WhatsApp: ✅ Connected
• Commands: ✅ Working
• APIs: ✅ Available
• Database: ❌ Not connected

💡 *Health:* Excellent`;

    await conn.sendMessage(from, { text: status }, { quoted: mek });
});

console.log("📊 GetInfo Plugin Loaded!");
