const { cmd } = require('../command');
const config = require('../config');

// 🎨 YOUR KILLER PROFILE PIC
const YOUR_PIC = "https://files.catbox.moe/28y8ok.jpg"; // 🔥 APNI PIC KA URL

cmd({
    pattern: "menu",
    desc: "BOSS-MD  DESIGN MENU",
    category: "menu",
    react: "⚡",
    filename: __filename
}, async (conn, mek, m, { from, reply, pushName }) => {
    try {
        const user = pushName || "VIP User";
        const date = new Date();
        
        // 🎨 KILLER DESIGN MENU
        const killerMenu = `
▄▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▄
█                                   █
█        ⚡ 𝗕𝗢𝗦𝗦-𝗠𝗗   ⚡       █
█                                   █
█▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀█

╔══════════ ✦ 𝗨𝗦𝗘𝗥 𝗜𝗡𝗙𝗢 ✦ ══════════╗
║                                       ║
║  👑 𝗢𝗪𝗡𝗘𝗥 : ${config.OWNER_NAME || "BOSS-MD"}   ║
║  👤 𝗨𝗦𝗘𝗥 : ${user}                  ║
║  📅 𝗗𝗔𝗧𝗘 : ${date.toLocaleDateString()} ║
║  ⏰ 𝗧𝗜𝗠𝗘 : ${date.toLocaleTimeString()}   ║
║                                       ║
╚═══════════════════════════════════════╝

┌─✦ 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗 𝗠𝗔𝗦𝗧𝗘𝗥 ✦─┐
│ • .song   [name]  🎵  │
│ • .video  [name]  🎬  │
│ • .drama  [name]  📺  │
│ • .fb     [url]   📱  │
│ • .tiktok [url]   💃  │
└─────────────────────┘

┌─✦ 𝗚𝗥𝗢𝗨𝗣 𝗕𝗢𝗦𝗦 ✦─┐
│ • .add    @user   ➕  │
│ • .kick   @user   🚫  │
│ • .promote @user  ⬆️  │
│ • .demote  @user  ⬇️  │
│ • .tagall         🏷️  │
└───────────────────┘

┌─✦ 𝗔𝗜 𝗪𝗜𝗭𝗔𝗥𝗗 ✦─┐
│ • .ai     [query] 🧠 │
│ • .gpt    [query] 🤖 │
│ • .bard   [query] 🔍 │
│ • .image  [text]  🖼️ │
│ • .blackbox [q]   📦 │
└───────────────────┘

┌─✦ 𝗙𝗨𝗡 𝗭𝗢𝗡𝗘 ✦─┐
│ • .joke         😂 │
│ • .meme         🤣 │
│ • .quote        💬 │
│ • .ship @user   💘 │
│ • .hack @user   👾 │
└───────────────────┘

┌─✦ 𝗥𝗘𝗔𝗖𝗧𝗜𝗢𝗡𝗦 ✦─┐
│ • .love  @user  ❤️ │
│ • .hug   @user  🤗 │
│ • .kiss  @user  💋 │
│ • .slap  @user  👋 │
│ • .pat   @user  👏 │
└───────────────────┘

┌─✦ 𝗧𝗢𝗢𝗟𝗦 ✦─┐
│ • .sticker  🏷️ │
│ • .tts      🔊 │
│ • .fancy    ✨ │
│ • .weather  🌤️ │
│ • .calc     🧮 │
└───────────────┘

╔════════ ✦ 𝗤𝗨𝗜𝗖𝗞 𝗔𝗖𝗖𝗘𝗦𝗦 ✦ ════════╗
║ • .menu2    - Category Menu         ║
║ • .owner    - Contact Owner         ║
║ • .ping     - Speed Test            ║
║ • .runtime  - Bot Uptime            ║
║ • .listcmd  - All Commands          ║
╚═════════════════════════════════════╝

▄▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▄
█  💎 𝗣𝗢𝗪𝗘𝗥𝗘𝗗 𝗕𝗬 : 𝗕𝗢𝗦𝗦-𝗠𝗗 𝗞𝗜𝗟𝗟𝗘𝗥  █
▀▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▀`;

        // 🔥 SEND KILLER DESIGN WITH YOUR PIC
        await conn.sendMessage(from, {
            image: { url: YOUR_PIC },
            caption: killerMenu,
            contextInfo: {
                externalAdReply: {
                    title: "⚡ BOSS-MD VIP EDITION",
                    body: `Welcome ${user} • Exclusive Access`,
                    thumbnailUrl: YOUR_PIC,
                    sourceUrl: "https://wa.me/" + (config.OWNER_NUMBER || ""),
                    mediaType: 1,
                    renderLargerThumbnail: true,
                    showAdAttribution: false,
                    mediaUrl: YOUR_PIC
                }
            }
        }, { quoted: mek });

        // 🎭 SEND INTERACTIVE LIST MESSAGE
        await conn.sendMessage(from, {
            text: "🎛️ *CONTROL PANEL*",
            footer: "BOSS-MD VIP • Select Category",
            title: "⚡ MAIN MENU",
            buttonText: "📱 OPEN CATEGORIES",
            sections: [
                {
                    title: "🔥 MAIN SECTIONS",
                    rows: [
                        { title: "🎵 MEDIA DOWNLOAD", rowId: "media", description: "Songs • Videos • Drama" },
                        { title: "👥 GROUP TOOLS", rowId: "group", description: "Admin • Management" },
                        { title: "🤖 AI CHATBOTS", rowId: "ai", description: "AI • GPT • Bard" },
                        { title: "😄 FUN ZONE", rowId: "fun", description: "Games • Jokes • Memes" },
                        { title: "🎭 REACTIONS", rowId: "react", description: "Love • Hug • Kiss" }
                    ]
                },
                {
                    title: "🔧 UTILITIES",
                    rows: [
                        { title: "🛠️ TOOLS", rowId: "tools", description: "Sticker • TTS • Weather" },
                        { title: "🔍 SEARCH", rowId: "search", description: "Web Search • Info" },
                        { title: "📊 STATS", rowId: "stats", description: "Bot Statistics" },
                        { title: "👑 OWNER", rowId: "owner", description: "Owner Commands" },
                        { title: "❓ HELP", rowId: "help", description: "Help & Support" }
                    ]
                }
            ]
        });

        // ✨ WELCOME MESSAGE WITH STYLE
        await conn.sendMessage(from, {
            text: `▄▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▄
█                                 █
█   ⚡ 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗧𝗢 𝗕𝗢𝗦𝗦-𝗠𝗗 𝗞𝗜𝗟𝗟𝗘𝗥  ⚡   █
█                                 █
█        👋 𝗛𝗘𝗟𝗟𝗢 ${user.toUpperCase()}!        █
█                                 █
█  🔥 𝗘𝗫𝗖𝗟𝗨𝗦𝗜𝗩𝗘 𝗙𝗘𝗔𝗧𝗨𝗥𝗘𝗦:          █
█  • 500+ Powerful Commands       █
█  • Ultra Fast Performance       █
█  • VIP Design Interface      █
█  • 24/7 Active Support          █
█  • VIP User Experience          █
█                                 █
█  🎯 𝗤𝗨𝗜𝗖𝗞 𝗦𝗧𝗔𝗥𝗧:                   █
█  • Use .menu2 for categories    █
█  • .ping to check speed         █
█  • .owner for support           █
█                                 █
█  💎 𝗣𝗢𝗪𝗘𝗥𝗘𝗗 𝗕𝗬 𝗕𝗢𝗦𝗦-𝗠𝗗 𝗞𝗜𝗟𝗟𝗘𝗥    █
█  ⏰ ${date.toLocaleDateString()} ${date.toLocaleTimeString()}     █
▀▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▀`
        });

    } catch (error) {
        console.error("Killer Menu Error:", error);
        // SIMPLE FALLBACK
        await conn.sendMessage(from, {
            text: `⚡ *BOSS-MD*\n\n👋 Hello ${pushName || "User"}!\n\n` +
                  `🎵 *Media:* .song .video .drama\n` +
                  `👥 *Group:* .add .kick .promote\n` +
                  `🤖 *AI:* .ai .gpt .image\n` +
                  `😄 *Fun:* .joke .meme .quote\n` +
                  `🎭 *React:* .love .hug .kiss\n\n` +
                  `⚡ *Quick:* .menu2 .ping .owner`
        }, { quoted: mek });
    }
});

// 🎭 CATEGORY MENU
cmd({
    pattern: "menu2",
    desc: "Killer Category Menu",
    category: "menu",
    react: "🎪",
    filename: __filename
}, async (conn, mek, m, { from, pushName }) => {
    const YOUR_PIC = "https://i.ibb.co/your-photo-code.jpg";
    
    const catMenu = `
▄▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▄
█                                 █
█    🎪 𝗖𝗔𝗧𝗘𝗚𝗢𝗥𝗬 𝗠𝗘𝗡𝗨 🎪        █
█                                 █
█        👋 ${pushName || "BOSS"}          █
█                                 █
█▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀█

╔═══════ ✦ 𝗦𝗘𝗟𝗘𝗖𝗧 𝗖𝗔𝗧𝗘𝗚𝗢𝗥𝗬 ✦ ═══════╗
║                                       ║
║  🔥 𝗠𝗔𝗜𝗡 𝗦𝗘𝗖𝗧𝗜𝗢𝗡𝗦:                 ║
║                                       ║
║  🎵 *Media Download*                 ║
║  • .menu media                       ║
║                                       ║
║  👥 *Group Tools*                    ║
║  • .menu group                       ║  
║                                       ║
║  🤖 *AI Chatbots*                    ║
║  • .menu ai                          ║
║                                       ║
║  😄 *Fun Zone*                       ║
║  • .menu fun                         ║
║                                       ║
║  🎭 *Reactions*                      ║
║  • .menu react                       ║
║                                       ║
║  🔧 *Utilities*                      ║
║  • .menu tools                       ║
║                                       ║
║  👑 *Owner Commands*                 ║
║  • .menu owner                       ║
║                                       ║
╚═══════════════════════════════════════╝

▄▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▄
█  📌 Usage: .menu [category]       █
█  🎯 Example: .menu media           █
█  💎 BOSS-MD KILLER EDITION         █
▀▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▀`;

    await conn.sendMessage(from, {
        image: { url: YOUR_PIC },
        caption: catMenu
    }, { quoted: mek });
});

console.log("⚡ BOSS-MD KILLER MENU LOADED!");
