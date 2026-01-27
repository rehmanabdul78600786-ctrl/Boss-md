const { cmd } = require('../command');
const axios = require('axios');
const fs = require('fs');
const config = require('../config');

cmd({
    pattern: "menu",
    desc: "Ultra Pro Max Menu From boss tech",
    category: "menu",
    react: "🎭",
    filename: __filename
}, async (conn, mek, m, { from, reply, pushName, isGroup }) => {
    try {
        const userId = m.sender;
        const userName = pushName || "User";
        
        // ==================== ULTRA MENU DESIGN ====================
        const menuDesign = `
╔═══════ ✦✧✦ ═══════╗
       𝗕𝗢𝗦𝗦-𝗠𝗗 𝗣𝗥𝗢
╚═══════ ✦✧✦ ═══════╝

👑 𝗢𝘄𝗻𝗲𝗿 : *${config.OWNER_NAME || "BOSS-MD"}*
👤 𝗨𝘀𝗲𝗿 : *${userName}*
📅 𝗗𝗮𝘁𝗲 : ${new Date().toLocaleDateString('en-IN')}
⏰ 𝗧𝗶𝗺𝗲 : ${new Date().toLocaleTimeString('en-IN')}

╔════ ✦ 𝗠𝗘𝗡𝗨 𝗦𝗘𝗖𝗧𝗜𝗢𝗡𝗦 ✦ ════╗
│ 
│ ๑๑๑๑๑๑๑๑๑๑๑๑๑๑๑๑๑๑๑๑
│ 📥 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗 𝗧𝗢𝗢𝗟𝗦
│ • .song [name] - Download song
│ • .video [name] - Download video  
│ • .drama [name] - Download drama
│ • .fb [url] - Facebook download
│ • .tiktok [url] - TikTok download
│ 
│ ๑๑๑๑๑๑๑๑๑๑๑๑๑๑๑๑๑๑๑๑
│ 👥 𝗚𝗥𝗢𝗨𝗣 𝗧𝗢𝗢𝗟𝗦
│ • .add @user - Add member
│ • .kick @user - Remove member
│ • .tagall - Mention everyone
│ • .promote @user - Make admin
│ • .demote @user - Remove admin
│ 
│ ๑๑๑๑๑๑๑๑๑๑๑๑๑๑๑๑๑๑๑๑
│ 😄 𝗙𝗨𝗡 & 𝗚𝗔𝗠𝗘𝗦
│ • .joke - Random jokes
│ • .meme - Send memes
│ • .quote - Motivational quotes
│ • .ship @user - Ship two users
│ • .hack @user - Fake hack
│ 
│ ๑๑๑๑๑๑๑๑๑๑๑๑๑๑๑๑๑๑๑๑
│ 🤖 𝗔𝗜 𝗧𝗢𝗢𝗟𝗦
│ • .ai [query] - AI Chat
│ • .gpt [query] - ChatGPT
│ • .bard [query] - Google Bard
│ • .image [text] - AI Image
│ • .blackbox [query] - Blackbox AI
│ 
│ ๑๑๑๑๑๑๑๑๑๑๑๑๑๑๑๑๑๑๑๑
│ 🎭 𝗥𝗘𝗔𝗖𝗧𝗜𝗢𝗡𝗦
│ • .love @user - Send love
│ • .hug @user - Virtual hug
│ • .kiss @user - Send kiss
│ • .slap @user - Virtual slap
│ • .pat @user - Head pat
│ 
╚══════════════════════╝

╔════ ✦ 𝗤𝗨𝗜𝗖𝗞 𝗖𝗠𝗗𝗦 ✦ ════╗
│ • .menu2 - Category Menu
│ • .owner - Contact Owner  
│ • .ping - Check speed
│ • .runtime - Bot uptime
│ • .listcmd - All commands
╚══════════════════════╝

┌─❖───────────❖─┐
│ 𝗣𝗼𝘄𝗲𝗿𝗲𝗱 𝗕𝘆 : 𝗕𝗢𝗦𝗦-𝗠𝗗
│ 𝗩𝗲𝗿𝘀𝗶𝗼𝗻 : 𝗣𝗿𝗼 𝗠𝗮𝘅
│ 𝗦𝘁𝗮𝘁𝘂𝘀 : ✅ 𝗔𝗰𝘁𝗶𝘃𝗲
└─❖───────────❖─┘

📌 *Use: .menu [category]*
🎯 *Example: .menu download*`;

        // Send menu with your personal image
        await conn.sendMessage(from, {
            image: { 
                url: "https://your-personal-image-url.jpg" // YAHAN APNI PIC KA URL DAALO
            },
            caption: menuDesign,
            contextInfo: {
                externalAdReply: {
                    title: "🎭 BOSS-MD PRO MAX",
                    body: `Welcome ${userName}!`,
                    thumbnailUrl: "https://files.catbox.moe/28y8ok.jpg", // Same pic
                    sourceUrl: "https://github.com/boss-md",
                    mediaType: 1,
                    renderLargerThumbnail: true,
                    showAdAttribution: true
                }
            }
        }, { quoted: mek });

        // Send interactive buttons
        await conn.sendMessage(from, {
            text: "🎛️ *Quick Access Menu*",
            footer: "BOSS-MD Pro Max",
            title: "Select Category",
            buttonText: "📱 Open Menu",
            sections: [
                {
                    title: "🚀 MAIN CATEGORIES",
                    rows: [
                        { title: "📥 Download", rowId: "download", description: "Media download tools" },
                        { title: "👥 Group", rowId: "group", description: "Group management" },
                        { title: "😄 Fun", rowId: "fun", description: "Games & entertainment" },
                        { title: "🤖 AI Tools", rowId: "ai", description: "AI chatbots" },
                        { title: "🎭 Reactions", rowId: "react", description: "Emoji reactions" }
                    ]
                },
                {
                    title: "🔧 UTILITIES",
                    rows: [
                        { title: "🛠️ Tools", rowId: "tools", description: "Utility tools" },
                        { title: "🔍 Search", rowId: "search", description: "Search online" },
                        { title: "📊 Stats", rowId: "stats", description: "Bot statistics" },
                        { title: "👑 Owner", rowId: "owner", description: "Owner commands" },
                        { title: "ℹ️ Help", rowId: "help", description: "Get help" }
                    ]
                }
            ]
        });

        // Send additional info
        await conn.sendMessage(from, {
            text: `✨ *Welcome to BOSS-MD Pro Max!* ✨\n\n` +
                  `👋 Hello *${userName}*!\n` +
                  `📱 You're using the *ULTIMATE* version of BOSS-MD\n` +
                  `⚡ Commands: 150+\n` +
                  `🎨 Theme: Custom Personal\n` +
                  `📅 Updated: Today\n\n` +
                  `💡 *Tip:* Use .menu2 for category-wise menu\n` +
                  `🎯 *Quick:* .ping to check bot speed\n\n` +
                  `_Powered by @${config.OWNER_NUMBER || "BOSS-MD"}_`
        });

    } catch (error) {
        console.error("Menu Error:", error);
        await reply("❌ Menu failed! Using simple menu...");
        
        // Fallback simple menu
        await conn.sendMessage(from, {
            text: `🤖 *BOSS-MD Menu*\n\n` +
                  `👋 Hello ${pushName || "User"}!\n` +
                  `📅 Date: ${new Date().toLocaleDateString()}\n\n` +
                  `📥 *Download:* .song .video .drama\n` +
                  `👥 *Group:* .add .kick .promote\n` +
                  `😄 *Fun:* .joke .meme .quote\n` +
                  `🤖 *AI:* .ai .gpt .image\n` +
                  `🎭 *Reactions:* .love .hug .kiss\n\n` +
                  `⚡ *Quick:* .menu2 .owner .ping`
        }, { quoted: mek });
    }
});

// ==================== MENU2 COMMAND ====================
cmd({
    pattern: "menu2",
    desc: "Category-wise menu system",
    category: "menu",
    react: "📱",
    filename: __filename
}, async (conn, mek, m, { from, reply, pushName }) => {
    try {
        const categories = {
            'download': { emoji: '📥', count: 25 },
            'group': { emoji: '👥', count: 20 },
            'fun': { emoji: '😄', count: 30 },
            'ai': { emoji: '🤖', count: 15 },
            'tools': { emoji: '🛠️', count: 18 },
            'owner': { emoji: '👑', count: 12 },
            'media': { emoji: '🎬', count: 22 },
            'search': { emoji: '🔍', count: 10 },
            'reactions': { emoji: '🎭', count: 25 }
        };

        let categoryList = `╔═══ ✦ 𝗖𝗔𝗧𝗘𝗚𝗢𝗥𝗬 𝗠𝗘𝗡𝗨 ✦ ═══╗\n│\n│ 👋 *Hello ${pushName || "User"}!*\n│ 📊 *Select a category:*\n│\n`;
        
        Object.entries(categories).forEach(([key, data]) => {
            categoryList += `│ ${data.emoji} *${key.toUpperCase()}*\n`;
            categoryList += `│   Commands: ${data.count}+\n`;
            categoryList += `│   Use: .menu ${key}\n│\n`;
        });
        
        categoryList += `╚═══════════════════════╝\n\n` +
                       `📌 *Example:* .menu download\n` +
                       `🎯 *All commands:* .listcmd\n` +
                       `⚡ *Bot speed:* .ping\n` +
                       `👑 *Owner:* .owner`;
        
        await conn.sendMessage(from, {
            image: { url: "https://your-personal-image-url.jpg" }, // Your pic
            caption: categoryList,
            contextInfo: {
                externalAdReply: {
                    title: "📱 BOSS-MD Categories",
                    body: `Select a category to explore`,
                    thumbnailUrl: "https://files.catbox.moe/w6d16s.jpg",
                    sourceUrl: "https://github.com/boss-md",
                    mediaType: 1
                }
            }
        }, { quoted: mek });
        
    } catch (error) {
        console.error("Menu2 Error:", error);
        await reply("❌ Category menu failed!");
    }
});

console.log("✅ Ultra Pro Max Menu System Loaded!");
