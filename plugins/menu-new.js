const { cmd } = require('../command');
const config = require('../config');

// ✅ YOUR PERSONAL PICTURE URL (Yahaan apni pic ka URL daalo)
const YOUR_PIC_URL = "https://files.catbox.moe/w6d16s.jpg"; // imgbb.com se upload karo

cmd({
    pattern: "menu",
    desc: "BOSS-MD Exclusive Ultra Menu",
    category: "menu",
    react: "🔥",
    filename: __filename
}, async (conn, mek, m, { from, reply, pushName }) => {
    try {
        const userName = pushName || "BOSS";
        const date = new Date().toLocaleDateString('en-IN', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        const time = new Date().toLocaleTimeString('en-IN');

        // 🔥 ULTRA EXCLUSIVE MENU DESIGN
        const ultraMenu = `
◤━━━━━━━━━━━━━━━━━━◥
         𝗕𝗢𝗦𝗦-𝗠𝗗 𝗩𝗜𝗣
◣━━━━━━━━━━━━━━━━━━◢

╭───⊷ *👑 OWNER* ⊶───╮
│ • ${config.OWNER_NAME || "BOSS-MD"}
│ • Exclusive Edition
│ • Version: Ultra Pro Max
╰─────────────────╯

╭───⊷ *👤 USER* ⊶───╮
│ • Name: ${userName}
│ • Status: ✅ Verified
│ • Access: VIP Level
╰─────────────────╯

╭───⊷ *📅 SESSION* ⊶───╮
│ • Date: ${date}
│ • Time: ${time}
│ • Server: Active
╰─────────────────╯

🎪 *━━━━━ 𝗠𝗔𝗜𝗡 𝗠𝗘𝗡𝗨 ━━━━━*

┌─ *🎵 MEDIA DOWNLOAD*
│ • .song [name] - High Quality MP3
│ • .video [name] - HD Video
│ • .drama [name] - Drama Series
│ • .fb [url] - Facebook Video
│ • .tiktok [url] - TikTok Download
└─────────────────

┌─ *👥 GROUP POWER*
│ • .add @user - Add Member
│ • .kick @user - Remove Member  
│ • .promote @user - Make Admin
│ • .demote @user - Remove Admin
│ • .tagall - Mention Everyone
└─────────────────

┌─ *🤖 AI & CHATBOTS*
│ • .ai [query] - AI Assistant
│ • .gpt [query] - ChatGPT
│ • .bard [query] - Google Bard
│ • .image [text] - AI Image
│ • .blackbox [query] - Blackbox AI
└─────────────────

┌─ *😄 FUN & GAMES*
│ • .joke - Random Jokes
│ • .meme - Fresh Memes
│ • .quote - Motivational
│ • .ship @user - Ship Generator
│ • .hack @user - Fake Hack
└─────────────────

┌─ *🎭 REACTIONS*
│ • .love @user - Send Love
│ • .hug @user - Virtual Hug
│ • .kiss @user - Send Kiss
│ • .slap @user - Virtual Slap
│ • .pat @user - Head Pat
└─────────────────

┌─ *🔧 UTILITIES*
│ • .sticker [image] - Create Sticker
│ • .tts [text] - Text to Speech
│ • .fancy [text] - Fancy Text
│ • .weather [city] - Weather Info
│ • .calc [expression] - Calculator
└─────────────────

╭───⊷ *⚡ QUICK CMDS* ⊶───╮
│ • .menu2 - Category Menu
│ • .owner - Contact Owner
│ • .ping - Speed Test
│ • .runtime - Bot Uptime
│ • .listcmd - All Commands
╰─────────────────╯

╭───⊷ *🌟 FEATURES* ⊶───╮
│ ✓ 150+ Commands
│ ✓ 24/7 Active
│ ✓ Multi-Device
│ ✓ No Lag
│ ✓ VIP Support
╰─────────────────╯

◤━━━━━━━━━━━━━━━━━━◥
   💎 𝗣𝗢𝗪𝗘𝗥𝗘𝗗 𝗕𝗬 𝗕𝗢𝗦𝗦-𝗠𝗗
◣━━━━━━━━━━━━━━━━━━◢`;

        // 🔥 SEND WITH YOUR PERSONAL PICTURE
        await conn.sendMessage(from, {
            image: { url: YOUR_PIC_URL },
            caption: ultraMenu,
            contextInfo: {
                externalAdReply: {
                    title: "🔥 BOSS-MD ULTRA PRO MAX",
                    body: `Welcome ${userName}! Exclusive Access`,
                    thumbnailUrl: YOUR_PIC_URL,
                    sourceUrl: "https://wa.me/" + (config.OWNER_NUMBER || ""),
                    mediaType: 1,
                    renderLargerThumbnail: true,
                    showAdAttribution: false
                }
            }
        }, { quoted: mek });

        // 🔥 INTERACTIVE BUTTONS
        await conn.sendMessage(from, {
            text: "🎛️ *BOSS-MD CONTROL PANEL*",
            footer: "Select a category",
            title: "VIP ACCESS MENU",
            buttonText: "🚀 OPEN MENU",
            sections: [
                {
                    title: "🎪 MAIN CATEGORIES",
                    rows: [
                        { title: "🎵 Media Download", rowId: "cat_media", description: "Songs, Videos, Drama" },
                        { title: "👥 Group Tools", rowId: "cat_group", description: "Admin & Management" },
                        { title: "🤖 AI Chatbots", rowId: "cat_ai", description: "AI & GPT Tools" },
                        { title: "😄 Fun & Games", rowId: "cat_fun", description: "Entertainment" },
                        { title: "🎭 Reactions", rowId: "cat_react", description: "Emoji Reactions" }
                    ]
                },
                {
                    title: "🔧 TOOLS & UTILITIES",
                    rows: [
                        { title: "🛠️ Utilities", rowId: "cat_tools", description: "Useful Tools" },
                        { title: "🔍 Search", rowId: "cat_search", description: "Search Online" },
                        { title: "📊 Stats", rowId: "cat_stats", description: "Bot Statistics" },
                        { title: "👑 Owner", rowId: "cat_owner", description: "Owner Commands" },
                        { title: "ℹ️ Help", rowId: "cat_help", description: "Get Help" }
                    ]
                }
            ]
        });

        // 🔥 WELCOME MESSAGE
        await conn.sendMessage(from, {
            text: `✨ *WELCOME TO BOSS-MD VIP!* ✨

🎪 *Hello ${userName}!* 

You've unlocked the *ULTIMATE* version of BOSS-MD with exclusive features:

✅ *Personalized Experience*
✅ *Ultra Fast Response*  
✅ *Exclusive Commands*
✅ *VIP Support*
✅ *24/7 Active*

📱 *Quick Start:*
• Use .menu2 for categories
• .ping to check speed
• .owner for support

🎯 *Tip:* All commands start with dot (.)

💎 *Powered by BOSS-MD Exclusive*
⏰ *Session:* ${date} ${time}

_Enjoy the premium experience!_`
        });

    } catch (error) {
        console.error("Ultra Menu Error:", error);
        // Fallback simple menu
        await conn.sendMessage(from, {
            text: `🤖 *BOSS-MD ULTRA*\n\n👋 Hello ${pushName || "User"}!\n\n📥 *Download:* .song .video .drama\n👥 *Group:* .add .kick .promote\n🤖 *AI:* .ai .gpt .image\n😄 *Fun:* .joke .meme .quote\n🎭 *React:* .love .hug .kiss\n\n⚡ *Quick:* .menu2 .ping .owner`
        }, { quoted: mek });
    }
});

// 🔥 CATEGORY MENU
cmd({
    pattern: "menu2",
    desc: "Category-based menu system",
    category: "menu",
    react: "📂",
    filename: __filename
}, async (conn, mek, m, { from, reply, pushName }) => {
    const YOUR_PIC_URL = "https://i.ibb.co/your-photo-code.jpg"; // Same pic
    
    const categories = `
╔══════ ✦ 𝗖𝗔𝗧𝗘𝗚𝗢𝗥𝗜𝗘𝗦 ✦ ══════╗
║                                 ║
║  🎪 *HELLO ${pushName || "BOSS"}!*   ║
║  Select a category below:       ║
║                                 ║
╠═════════════════════════════════╣
║                                 ║
║  🎵 *MEDIA DOWNLOAD*           ║
║  • .menu media                 ║
║                                 ║
║  👥 *GROUP TOOLS*              ║
║  • .menu group                 ║  
║                                 ║
║  🤖 *AI & CHATBOTS*            ║
║  • .menu ai                    ║
║                                 ║
║  😄 *FUN & GAMES*              ║
║  • .menu fun                   ║
║                                 ║
║  🎭 *REACTIONS*                ║
║  • .menu react                 ║
║                                 ║
║  🔧 *UTILITIES*                ║
║  • .menu tools                 ║
║                                 ║
║  👑 *OWNER CMDS*               ║
║  • .menu owner                 ║
║                                 ║
╚═════════════════════════════════╝

📌 *Usage:* .menu [category]
🎯 *Example:* .menu media

💎 *BOSS-MD VIP EDITION*`;

    await conn.sendMessage(from, {
        image: { url: YOUR_PIC_URL },
        caption: categories,
        contextInfo: {
            externalAdReply: {
                title: "📱 BOSS-MD CATEGORIES",
                body: "Select your category",
                thumbnailUrl: YOUR_PIC_URL,
                sourceUrl: "https://github.com/boss-md",
                mediaType: 1
            }
        }
    }, { quoted: mek });
});

console.log("🔥 BOSS-MD ULTRA MENU LOADED!");
