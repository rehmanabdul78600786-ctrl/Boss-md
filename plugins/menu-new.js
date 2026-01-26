const fs = require('fs');
const config = require('../config');
const { cmd, commands } = require('../command');
const { runtime } = require('../lib/functions');
const axios = require('axios');

cmd({
    pattern: "menu",
    desc: "Show ultra pro max interactive menu system",
    category: "menu",
    react: "🚀",
    filename: __filename,
    use: ".menu [section/help]"
}, async (conn, mek, m, { from, reply, pushName, text }) => {
    try {
        // User info
        const userId = m.sender;
        const userName = pushName || "User";
        const isGroup = m.isGroup;
        const groupName = m.metadata?.subject || "Group";
        
        // Bot stats
        const totalCommands = Object.keys(commands).length;
        const uptime = runtime(process.uptime());
        const memoryUsage = Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + "MB";
        
        // Count commands by category
        const categories = {};
        Object.values(commands).forEach(cmd => {
            const cat = cmd.category || 'general';
            categories[cat] = (categories[cat] || 0) + 1;
        });
        
        // ======================== ULTRA MENU SYSTEM ========================
        let menuMode = 'main';
        let pageNum = 1;
        const sections = text?.toLowerCase().split(' ');
        
        if (sections) {
            if (sections.includes('help') || sections.includes('guide')) {
                return await showHelpMenu();
            }
            if (sections.includes('all')) {
                return await showAllCommands();
            }
        }
        
        // ==================== MAIN MENU DESIGN ====================
        const mainMenu = `
╔═══ ✦ •✦• •✦• •✦• ✦ ═══╗
   𝗕𝗢𝗦𝗦-𝗠𝗗 𝗨𝗟𝗧𝗥𝗔 𝗠𝗘𝗡𝗨
╚═══ ✦ •✦• •✦• •✦• ✦ ═══╝

👤 *User:* ${userName}
📊 *Commands:* ${totalCommands}+
⏱️ *Uptime:* ${uptime}
🧠 *Memory:* ${memoryUsage}
📅 *Date:* ${new Date().toLocaleDateString()}
⏰ *Time:* ${new Date().toLocaleTimeString()}

╔═══ ❖ 𝗤𝗨𝗜𝗖𝗞 𝗦𝗘𝗖𝗧𝗜𝗢𝗡𝗦 ❖ ═══╗
│ 
│ 1️⃣  📥 *Download Center*
│ 2️⃣  👥 *Group Manager*
│ 3️⃣  😄 *Fun & Games*
│ 4️⃣  🤖 *AI & Chatbots*
│ 5️⃣  🎬 *Media Tools*
│ 6️⃣  🛠️ *Utilities*
│ 7️⃣  🔧 *Owner Panel*
│ 8️⃣  🌐 *Web Tools*
│ 9️⃣  🎮 *Interactive*
│ 🔟  📊 *Bot Stats*
│
│ ➕ *More Options Below*
│
╚═══════════════════════╝

📌 *Quick Commands:*
• .menu2 - Category Menu
• .menu all - All Commands
• .menu stats - Bot Statistics
• .menu help - Help Guide
• .menu speed - Speed Test

🎯 *New Features:*
✓ Auto-Pagination ✓ Speed Test
✓ Category Filter ✓ Search Commands
✓ User Stats ✓ Random Commands
✓ Command Info ✓ Quick Tutorial

┌─❖ *𝑩𝑶𝑺𝑺-𝑴𝑫 𝑷𝑹𝑶 𝑴𝑨𝑿* ❖─┐
│ • Version: 3.0.0 Ultra
│ • Platform: Multi-Device
│ • Creator: BOSS-MD
│ • Status: 🟢 Active
└────────────────────┘

*Reply with number (1-10) for details*
*Or use: .menu [option]*`;

        // Send initial menu
        await conn.sendMessage(from, {
            text: mainMenu,
            contextInfo: {
                externalAdReply: {
                    title: "🚀 BOSS-MD ULTRA MENU",
                    body: `Hi ${userName}! Tap to explore`,
                    thumbnailUrl: "https://files.catbox.moe/xla7at.jpg",
                    sourceUrl: "https://github.com/boss-md",
                    mediaType: 1,
                    showAdAttribution: true
                }
            }
        }, { quoted: mek });

        // ==================== BUTTON MENU (Optional) ====================
        try {
            await conn.sendMessage(from, {
                text: "🎛️ *Quick Access Menu*",
                footer: "Select a category",
                title: "BOSS-MD Controls",
                buttonText: "📋 View Categories",
                sections: [
                    {
                        title: "🚀 MAIN CATEGORIES",
                        rows: [
                            { title: "📥 Download", rowId: "cat_download", description: "Media download tools" },
                            { title: "👥 Group", rowId: "cat_group", description: "Group management" },
                            { title: "😄 Fun", rowId: "cat_fun", description: "Games & entertainment" },
                            { title: "🤖 AI Tools", rowId: "cat_ai", description: "AI chatbots & tools" },
                            { title: "➡️ More", rowId: "next_page", description: "Next page of categories" }
                        ]
                    }
                ]
            });
        } catch (e) {
            console.log("Button menu failed, continuing...");
        }

        // ==================== MENU HANDLER ====================
        const menuId = (await conn.sendMessage(from, { 
            text: "🔘 *Interactive Menu Activated*\n\nReply with:\n• Number 1-10 for section\n• 'help' for guide\n• 'all' for commands\n• 'stats' for bot info\n\n⏰ _Active for 5 minutes_"
        })).key.id;

        const handler = async (msgData) => {
            try {
                const msg = msgData.messages[0];
                if (!msg || msg.key.remoteJid !== from) return;

                const replyId = msg.message?.extendedTextMessage?.contextInfo?.stanzaId;
                if (replyId !== menuId && replyId !== mek.key.id) return;

                const userInput = (msg.message.conversation || msg.message.extendedTextMessage?.text || "").toLowerCase().trim();

                // Handle menu options
                if (userInput === 'help' || userInput === 'guide') {
                    await showHelpMenu();
                } 
                else if (userInput === 'all' || userInput === 'commands') {
                    await showAllCommands();
                }
                else if (userInput === 'stats' || userInput === 'info') {
                    await showBotStats();
                }
                else if (userInput === 'speed' || userInput === 'ping') {
                    await showSpeedTest();
                }
                else if (userInput === '2' || userInput === 'menu2') {
                    await showCategoryMenu();
                }
                else if (userInput >= '1' && userInput <= '10') {
                    await showSection(parseInt(userInput));
                }
                else {
                    await conn.sendMessage(from, {
                        text: `❌ *Invalid Input!*\n\nPlease reply with:\n• Number 1-10 for menu sections\n• 'help' for guide\n• 'all' for commands\n• 'stats' for bot info\n\nOr use: .menu [option]`
                    }, { quoted: msg });
                }

                // React with ✅
                await conn.sendMessage(from, {
                    react: { text: '✅', key: msg.key }
                });

            } catch (err) {
                console.log("Menu handler error:", err);
            }
        };

        // Register handler
        conn.ev.on("messages.upsert", handler);

        // Auto remove after 5 minutes
        setTimeout(() => {
            conn.ev.off("messages.upsert", handler);
            conn.sendMessage(from, { 
                text: "⏰ *Menu session expired*\nUse .menu again for new session" 
            });
        }, 300000);

        // ==================== HELPER FUNCTIONS ====================
        async function showHelpMenu() {
            const helpText = `
╔═══ ✦ 𝗠𝗘𝗡𝗨 𝗛𝗘𝗟𝗣 𝗚𝗨𝗜𝗗𝗘 ✦ ═══╗
│
│ 📖 *How to use BOSS-MD Menu:*
│
│ 1️⃣ *Main Menu* (.menu)
│    Shows all sections & quick access
│
│ 2️⃣ *Category Menu* (.menu2)
│    Organized by command categories
│
│ 3️⃣ *All Commands* (.menu all)
│    List all ${totalCommands} commands
│
│ 4️⃣ *Search Commands* (.cmd search [query])
│    Find specific commands
│
│ 5️⃣ *Interactive Mode*
│    Reply to menu with numbers
│
│ 6️⃣ *Quick Commands:*
│    • .ping - Bot response time
│    • .owner - Contact owner
│    • .runtime - Bot uptime
│    • .listcmd - All commands list
│
│ ⚡ *Tips:*
│ • Use .menu [option] for quick access
│ • Reply to menu messages
│ • Check .menu2 for categories
│
╚═══════════════════════╝

*Need more help? Contact @${config.OWNER_NUMBER}*`;

            await conn.sendMessage(from, { text: helpText }, { quoted: mek });
        }

        async function showAllCommands() {
            let commandsList = `╔═══ ✦ 𝗔𝗟𝗟 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦 (${totalCommands}) ✦ ═══╗\n│\n`;
            
            // Group by category
            const categorized = {};
            Object.entries(commands).forEach(([name, cmd]) => {
                const cat = cmd.category || 'general';
                if (!categorized[cat]) categorized[cat] = [];
                categorized[cat].push(`• ${name} - ${cmd.desc || 'No description'}`);
            });
            
            // Build list
            Object.entries(categorized).forEach(([category, cmds]) => {
                commandsList += `│ 📁 *${category.toUpperCase()}* (${cmds.length})\n`;
                cmds.slice(0, 10).forEach(cmd => {
                    commandsList += `│ ${cmd}\n`;
                });
                if (cmds.length > 10) {
                    commandsList += `│ ... and ${cmds.length - 10} more\n`;
                }
                commandsList += `│\n`;
            });
            
            commandsList += `╚══════════════════════════════╝\n\n📌 *Use: .cmd [command] for details*`;
            
            // Send in chunks if too long
            if (commandsList.length > 4000) {
                const chunks = commandsList.match(/.{1,3000}/g);
                for (let i = 0; i < chunks.length; i++) {
                    await conn.sendMessage(from, { 
                        text: `📜 *Commands List Part ${i+1}/${chunks.length}*\n\n${chunks[i]}` 
                    }, { quoted: i === 0 ? mek : undefined });
                    if (i < chunks.length - 1) await new Promise(r => setTimeout(r, 1000));
                }
            } else {
                await conn.sendMessage(from, { text: commandsList }, { quoted: mek });
            }
        }

        async function showBotStats() {
            const stats = `
╔═══ ✦ 𝗕𝗢𝗧 𝗦𝗧𝗔𝗧𝗜𝗦𝗧𝗜𝗖𝗦 ✦ ═══╗
│
│ 🤖 *Bot Information*
│ • Name: ${config.BOT_NAME}
│ • Prefix: ${config.PREFIX}
│ • Owner: ${config.OWNER_NAME}
│ • Mode: ${config.WORK_TYPE}
│ • Platform: Heroku
│ • Version: 3.0.0 Ultra
│
│ 📊 *Performance*
│ • Commands: ${totalCommands}
│ • Uptime: ${uptime}
│ • Memory: ${memoryUsage}
│ • Response: Active
│ • Status: 🟢 Online
│
│ 👥 *User Stats*
│ • User: ${userName}
│ • ID: ${userId.split('@')[0]}
│ • Session: Active
│ • Group: ${isGroup ? groupName : 'Private Chat'}
│
│ 📈 *Categories*
${Object.entries(categories).map(([cat, count]) => `│ • ${cat}: ${count} commands`).join('\n')}
│
╚═══════════════════════╝

*Last Updated:* ${new Date().toLocaleString()}`;

            await conn.sendMessage(from, { text: stats }, { quoted: mek });
        }

        async function showSpeedTest() {
            const startTime = Date.now();
            const testMsg = await conn.sendMessage(from, { text: "🏃 *Testing Speed...*" });
            const endTime = Date.now();
            const latency = endTime - startTime;
            
            // Calculate speed
            let speedStatus = "⚡ Ultra Fast";
            if (latency > 1000) speedStatus = "🐢 Slow";
            else if (latency > 500) speedStatus = "🚶 Normal";
            else if (latency > 200) speedStatus = "🚗 Fast";
            
            await conn.sendMessage(from, {
                text: `╔═══ ✦ 𝗦𝗣𝗘𝗘𝗗 𝗧𝗘𝗦𝗧 ✦ ═══╗\n│\n│ ⚡ *Response Time:* ${latency}ms\n│ 📊 *Speed:* ${speedStatus}\n│ 🧠 *Memory:* ${memoryUsage}\n│ ⏱️ *Uptime:* ${uptime}\n│ 📅 *Server:* Heroku\n│ 🟢 *Status:* Optimal\n╚═══════════════════════╝`
            }, { quoted: mek });
        }

        async function showCategoryMenu() {
            const categoryMenu = `
╔═══ ✦ 𝗖𝗔𝗧𝗘𝗚𝗢𝗥𝗬 𝗠𝗘𝗡𝗨 ✦ ═══╗
│
│ 📂 *Browse by Category:*
│
│ 1. 📥 Download (${categories.download || 0})
│ 2. 👥 Group (${categories.group || 0})
│ 3. 😄 Fun (${categories.fun || 0})
│ 4. 🤖 AI (${categories.ai || 0})
│ 5. 🎬 Media (${categories.media || 0})
│ 6. 🛠️ Tools (${categories.tools || 0})
│ 7. 👑 Owner (${categories.owner || 0})
│ 8. 🌐 Web (${categories.web || 0})
│ 9. 🎮 Games (${categories.games || 0})
│ 10. 📊 Stats (${categories.stats || 0})
│
│ 📌 *Usage:*
│ • .menu download - Show download cmds
│ • .menu fun - Show fun commands
│ • .menu all - All categories
│
╚═══════════════════════╝

*Reply with category number or use .menu [category]*`;

            await conn.sendMessage(from, { text: categoryMenu }, { quoted: mek });
        }

        async function showSection(sectionNum) {
            const sections = [
                {
                    title: "📥 DOWNLOAD CENTER",
                    content: `• facebook [url]\n• tiktok [url]\n• insta [url]\n• play [song]\n• video [url]\n• ytmp3 [url]\n• ytmp4 [url]\n• drama [name]\n• spotify [query]\n• mediafire [url]\n\n📌 *Use: .download [option]*`
                },
                {
                    title: "👥 GROUP MANAGER",
                    content: `• add @user\n• kick @user\n• promote @user\n• demote @user\n• mute [time]\n• unmute\n• lockgc\n• unlockgc\n• tagall\n• hidetag [msg]\n• grouplink\n\n📌 *Use: .group [option]*`
                },
                // Add other sections similarly...
            ];

            if (sectionNum <= sections.length) {
                const section = sections[sectionNum - 1];
                await conn.sendMessage(from, {
                    text: `╔═══ ✦ ${section.title} ✦ ═══╗\n│\n│ ${section.content}\n│\n╚═══════════════════════╝`
                }, { quoted: mek });
            }
        }

    } catch (e) {
        console.error('Ultra Menu Error:', e);
        await reply("❌ *Menu system error!* Please try .menu2 or contact owner.");
    }
});

// ==================== MENU2 COMMAND ====================
cmd({
    pattern: "menu2",
    desc: "Category-based menu system",
    category: "menu",
    react: "📂",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        const categories = {
            'download': '📥 Media Download',
            'group': '👥 Group Management',
            'fun': '😄 Fun & Games',
            'ai': '🤖 AI Tools',
            'tools': '🛠️ Utilities',
            'owner': '👑 Owner Commands',
            'media': '🎬 Media Tools',
            'search': '🔍 Search Tools',
            'reactions': '💞 Reactions'
        };

        let categoryList = "╔═══ ✦ 𝗖𝗔𝗧𝗘𝗚𝗢𝗥𝗬 𝗠𝗘𝗡𝗨 ✦ ═══╗\n│\n";
        
        Object.entries(categories).forEach(([key, name]) => {
            const count = Object.values(commands).filter(cmd => cmd.category === key).length;
            categoryList += `│ ${name} (${count} commands)\n`;
            categoryList += `│ • Use: .menu ${key}\n│\n`;
        });
        
        categoryList += "╚═══════════════════════╝\n\n📌 *Example:* .menu download\n📌 *Or:* .menu all";
        
        await conn.sendMessage(from, { text: categoryList }, { quoted: mek });
        
    } catch (e) {
        console.error('Menu2 Error:', e);
        await reply("❌ Error loading categories");
    }
});

console.log("✅ Ultra Pro Max Menu System Loaded!");
