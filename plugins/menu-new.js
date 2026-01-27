const { cmd } = require('../command');
const config = require('../config');

// 🎭 YOUR PICS (Multiple for rotation)
const YOUR_PICS = [
    "https://files.catbox.moe/w6d16s.jpg",
    "https://files.catbox.moe/w6d16s.jpg",
    "https://files.catbox.moe/w6d16s.jpg"
];

// 🎪 RANDOM QUOTES TO DISGUISE MENU
const RANDOM_QUOTES = [
    "✨ Success is not final, failure is not fatal.",
    "🔥 The only way to do great work is to love what you do.",
    "💎 Don't watch the clock; do what it does. Keep going.",
    "🚀 The future belongs to those who believe in beauty.",
    "🎯 It always seems impossible until it's done.",
    "🌟 Your time is limited, don't waste it living someone else's life.",
    "⚡ The harder I work, the more luck I seem to have.",
    "🛡️ Life is what happens to you while you're busy making other plans."
];

cmd({
    pattern: "menu",
    desc: "Hidden Scrollable Menu System",
    category: "menu",
    react: "🌀",
    filename: __filename
}, async (conn, mek, m, { from, reply, pushName, text, sender }) => {
    try {
        const user = pushName || "User";
        const userId = sender.split('@')[0];
        
        // Check if VIP user (you can customize this)
        const isVIP = userId === config.OWNER_NUMBER?.replace('+', '') || 
                     userId === "923001234567"; // Add VIP numbers
        
        // Get random quote and pic
        const randomQuote = RANDOM_QUOTES[Math.floor(Math.random() * RANDOM_QUOTES.length)];
        const randomPic = YOUR_PICS[Math.floor(Math.random() * YOUR_PICS.length)];
        
        // ==================== HIDDEN MENU PAGE 1 ====================
        const hiddenMenuPage1 = `
${randomQuote}

╔════════════════════════════════════╗
║                                    ║  
║        📱 *Device Information*     ║
║                                    ║
║  • User: ${user.substring(0, 15)}
║  • ID: ${userId}
║  • Time: ${new Date().toLocaleTimeString()}
║  • Status: ✅ Online
║                                    ║
╠════════════════════════════════════╣
║                                    ║
║    🎵 *Media Tools (Page 1/3)*     ║
║                                    ║
║  📥 .play [song]
║    → Download high quality MP3
║
║  🎬 .video [name]
║    → HD video download
║
║  📺 .drama [name]
║    → Drama series download
║
║  📱 .fb [url]
║    → Facebook video download
║
║  💃 .tiktok [url]
║    → TikTok download
║                                    ║
╠════════════════════════════════════╣
║                                    ║
║  🔄 *Page Navigation:*             ║
║  • Type 'n' for next page         ║
║  • Type 'p' for previous page     ║
║  • Type 'vip' for VIP section     ║
║                                    ║
╚════════════════════════════════════╝

_This looks like a normal message..._`;

        // Send first page with your pic
        await conn.sendMessage(from, {
            image: { url: randomPic },
            caption: hiddenMenuPage1
        }, { quoted: mek });
        
        // Send navigation instructions separately
        await conn.sendMessage(from, {
            text: `🌀 *Secret Navigation Activated*\n\nReply to this message with:\n• 'n' - Next page (2/3)\n• 'p' - Previous page\n• 'vip' - VIP Section ${isVIP ? '(Unlocked)' : '(Locked)'}\n• 'help' - Show all commands\n\n📌 _No one will know this is a menu_`
        });
        
        // Store user session for navigation
        const menuSession = {
            userId: sender,
            currentPage: 1,
            lastActive: Date.now()
        };
        
        // ==================== PAGE 2 CONTENT ====================
        const hiddenMenuPage2 = `
${randomQuote}

╔════════════════════════════════════╗
║                                    ║  
║     👥 *Group Management*          ║
║           (Page 2/3)               ║
║                                    ║
║  ➕ .add @user
║    → Add member to group
║
║  🚫 .kick @user
║    → Remove member
║
║  ⬆️ .promote @user
║    → Make admin
║
║  ⬇️ .demote @user
║    → Remove admin
║
║  🏷️ .tagall
║    → Mention everyone
║                                    ║
╠════════════════════════════════════╣
║                                    ║
║     🤖 *AI & Tools*                ║
║                                    ║
║  🧠 .ai [query]
║    → AI assistant
║
║  🤖 .gpt [query]
║    → ChatGPT
║
║  🖼️ .image [text]
║    → AI image generation
║
║  🎭 .disappear [s]
║    → Vanishing messages
║                                    ║
╠════════════════════════════════════╣
║                                    ║
║  🔄 *Navigation:* n / p / vip      ║
║                                    ║
╚════════════════════════════════════╝`;

        // ==================== PAGE 3 CONTENT ====================
        const hiddenMenuPage3 = `
${randomQuote}

╔════════════════════════════════════╗
║                                    ║  
║     😄 *Fun & Entertainment*       ║
║           (Page 3/3)               ║
║                                    ║
║  😂 .joke
║    → Random jokes
║
║  🤣 .meme
║    → Fresh memes
║
║  💬 .quote
║    → Motivational quotes
║
║  💘 .ship @user1 @user2
║    → Ship generator
║
║  👾 .hack @user
║    → Fake hack
║                                    ║
╠════════════════════════════════════╣
║                                    ║
║     🔧 *Utilities*                 ║
║                                    ║
║  🏷️ .sticker [image]
║    → Create sticker
║
║  🔊 .tts [text]
║    → Text to speech
║
║  ✨ .fancy [text]
║    → Fancy text
║
║  🌤️ .weather [city]
║    → Weather info
║                                    ║
╠════════════════════════════════════╣
║                                    ║
║  🔄 *Navigation:* n / p / vip      ║
║                                    ║
╚════════════════════════════════════╝`;

        // ==================== VIP SECTION ====================
        const vipSection = `
🔐 *VIP ACCESS GRANTED*

╔════════════════════════════════════╗
║                                    ║  
║        💎 *VIP SECTION*            ║
║          (Exclusive)               ║
║                                    ║
║  📨 .senddm @user [msg]
║    → Send private message
║
║  📢 .senddm all [msg]
║    → Broadcast to all users
║
║  📊 .getinfo [user/group/bot]
║    → Detailed information
║
║  👻 .disappear 604800 [msg]
║    → 7-day vanishing msg
║
║  💣 .bomb 300 [msg]
║    → 5-min self destruct
║                                    ║
╠════════════════════════════════════╣
║                                    ║
║     🛡️ *Owner Tools*              ║
║                                    ║
║  🔒 .block @user
║    → Block user from bot
║
║  🔓 .unblock @user
║    → Unblock user
║
║  🔄 .restart
║    → Restart bot
║
║  ⚡ .shutdown
║    → Shutdown bot
║                                    ║
╠════════════════════════════════════╣
║                                    ║
║  VIP Access: ${user}
║  Expires: Never
║                                    ║
╚════════════════════════════════════╝

_This section is only visible to VIP users_`;

        // Set up message handler for navigation
        const messageHandler = async (msgData) => {
            try {
                const msg = msgData.messages[0];
                if (!msg || msg.key.remoteJid !== from) return;
                
                const isReply = msg.message?.extendedTextMessage?.contextInfo?.stanzaId === mek.key.id;
                if (!isReply) return;
                
                const userInput = (msg.message.conversation || "").toLowerCase().trim();
                
                // Handle navigation
                if (userInput === 'n' || userInput === 'next') {
                    if (menuSession.currentPage === 1) {
                        await conn.sendMessage(from, {
                            image: { url: randomPic },
                            caption: hiddenMenuPage2
                        });
                        menuSession.currentPage = 2;
                    } else if (menuSession.currentPage === 2) {
                        await conn.sendMessage(from, {
                            image: { url: randomPic },
                            caption: hiddenMenuPage3
                        });
                        menuSession.currentPage = 3;
                    }
                }
                else if (userInput === 'p' || userInput === 'prev' || userInput === 'previous') {
                    if (menuSession.currentPage === 3) {
                        await conn.sendMessage(from, {
                            image: { url: randomPic },
                            caption: hiddenMenuPage2
                        });
                        menuSession.currentPage = 2;
                    } else if (menuSession.currentPage === 2) {
                        await conn.sendMessage(from, {
                            image: { url: randomPic },
                            caption: hiddenMenuPage1
                        });
                        menuSession.currentPage = 1;
                    }
                }
                else if (userInput === 'vip') {
                    if (isVIP) {
                        await conn.sendMessage(from, {
                            image: { url: randomPic },
                            caption: vipSection
                        });
                    } else {
                        await conn.sendMessage(from, {
                            text: "🔐 *VIP ACCESS DENIED*\n\nThis section is only available for VIP users.\n\nContact owner for VIP access."
                        });
                    }
                }
                else if (userInput === 'help') {
                    await conn.sendMessage(from, {
                        text: `📖 *Quick Commands List*\n\n• .play [song]\n• .video [name]\n• .drama [name]\n• .add @user\n• .kick @user\n• .ai [query]\n• .gpt [query]\n• .joke\n• .meme\n• .sticker [image]\n• .disappear [s]\n\nUse .menu for hidden navigation`
                    });
                }
                
                // Update session
                menuSession.lastActive = Date.now();
                
            } catch (error) {
                console.error("Menu navigation error:", error);
            }
        };
        
        // Add event listener
        conn.ev.on("messages.upsert", messageHandler);
        
        // Remove listener after 5 minutes
        setTimeout(() => {
            conn.ev.off("messages.upsert", messageHandler);
            conn.sendMessage(from, {
                text: "⏰ *Navigation session expired*\nUse .menu again for new session"
            });
        }, 5 * 60 * 1000); // 5 minutes
        
    } catch (error) {
        console.error("Hidden Menu Error:", error);
        // Fallback to simple menu
        await conn.sendMessage(from, {
            text: `📱 *Quick Commands*\n\n🎵 .play [song]\n🎬 .video [name]\n👥 .add @user\n🤖 .ai [query]\n😄 .joke\n🎭 .disappear [s]\n\nUse .help for more`
        }, { quoted: mek });
    }
});

// ==================== SIMPLE COMMAND FOR NON-VIP ====================
cmd({
    pattern: "help",
    desc: "Simple help command",
    category: "menu",
    react: "📖",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    await conn.sendMessage(from, {
        text: `📖 *Available Commands*\n\n` +
              `🎵 *Media:* .play .video .drama .fb .tiktok\n` +
              `👥 *Group:* .add .kick .promote .tagall\n` +
              `🤖 *AI:* .ai .gpt .image .blackbox\n` +
              `😄 *Fun:* .joke .meme .quote .ship\n` +
              `🎭 *Special:* .disappear .ghostpic .bomb\n` +
              `🔧 *Tools:* .sticker .tts .weather\n\n` +
              `💡 *Tip:* Use .menu for advanced navigation`
    }, { quoted: mek });
});

console.log("🌀 Hidden Scrollable Menu Loaded!");
