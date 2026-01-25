const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

// Menu Data - Yaha apne commands add/edit karo
const menuData = {
    pages: [
        {
            title: "📜 MAIN SECTIONS",
            rows: [
                { id: "dl", title: "📥 Download Menu", description: "Facebook, TikTok, YouTube, etc" },
                { id: "grp", title: "👥 Group Menu", description: "Management & tagging tools" },
                { id: "fun", title: "😄 Fun Menu", description: "Games, jokes, reactions" },
                { id: "owner", title: "👑 Owner Menu", description: "Bot owner commands" },
                { id: "next1", title: "➡️ Next Page", description: "Page 2 of 5" }
            ]
        },
        {
            title: "🤖 AI & ANIME",
            rows: [
                { id: "ai", title: "🤖 AI Menu", description: "ChatGPT, GPT-3, Meta AI" },
                { id: "anime", title: "🎎 Anime Menu", description: "Anime images & characters" },
                { id: "convert", title: "🔄 Convert Menu", description: "Sticker, audio, text tools" },
                { id: "other", title: "📌 Other Menu", description: "Search, weather, news" },
                { id: "next2", title: "⬅️ Back | Next ➡️", description: "Page 3 of 5" }
            ]
        },
        {
            title: "💞 REACTIONS & MORE",
            rows: [
                { id: "react", title: "💞 Reactions", description: "Love, kiss, hug, slap, etc" },
                { id: "img", title: "📸 Image Menu", description: "Image generation & editing" },
                { id: "tools", title: "🛠️ Text Tools", description: "Fancy, TTS, base64" },
                { id: "search", title: "🔍 Search", description: "Weather, movie, define" },
                { id: "next3", title: "⬅️ Back | Next ➡️", description: "Page 4 of 5" }
            ]
        },
        {
            title: "🎮 FUN & GAMES",
            rows: [
                { id: "interactive", title: "🎭 Interactive", description: "Rate, insult, hack, ship" },
                { id: "random", title: "🎲 Random", description: "Flip, roll, facts, colors" },
                { id: "calc", title: "🔢 Calculate", description: "Math, count, time, date" },
                { id: "media", title: "🎵 Media", description: "Play, song, video, audio" },
                { id: "next4", title: "⬅️ Back | Next ➡️", description: "Page 5 of 5" }
            ]
        },
        {
            title: "⚙️ BOT CONTROLS",
            rows: [
                { id: "info", title: "📊 Bot Info", description: "Ping, uptime, runtime, repo" },
                { id: "admin", title: "⚡ Admin Tools", description: "Promote, demote, mute, lock" },
                { id: "user", title: "👤 User Tools", description: "Block, unblock, setpp" },
                { id: "cmd", title: "📋 All Commands", description: "List all 332 commands" },
                { id: "home", title: "⬅️ Back | Home 🏠", description: "Return to main page" }
            ]
        }
    ],
    
    // Command details for each section
    commands: {
        dl: `╭━━━〔 📥 DOWNLOAD MENU 〕━━━╮
│ • *facebook* [url]
│ • *tiktok* [url]
│ • *insta* [url]
│ • *play* [song]
│ • *video* [url]
│ • *song* [name]
│ • *ytmp3* [url]
│ • *ytmp4* [url]
╰━━━━━━━━━━━━━━━━━━━╯`,
        
        grp: `╭━━━〔 👥 GROUP MENU 〕━━━╮
│ • *add* @user
│ • *kick* @user
│ • *promote* @user
│ • *demote* @user
│ • *tagall*
│ • *hidetag* [msg]
│ • *mute* [time]
│ • *lockgc*
╰━━━━━━━━━━━━━━━━━━━╯`,
        
        fun: `╭━━━〔 😄 FUN MENU 〕━━━╮
│ • *shapar*
│ • *rate* @user
│ • *insult* @user
│ • *joke*
│ • *character*
│ • *pickup*
│ • *hack* @user
│ • *ship* @user1 @user2
╰━━━━━━━━━━━━━━━━━━━╯`,
        
        ai: `╭━━━〔 🤖 AI MENU 〕━━━╮
│ • *ai* [query]
│ • *gpt* [query]
│ • *gpt3* [query]
│ • *chat* [query]
│ • *blackbox* [query]
│ • *luma* [query]
│ • *image* [text]
│ • *imagine* [text]
╰━━━━━━━━━━━━━━━━━━━╯`,
        
        react: `╭━━━〔 💞 REACTIONS 〕━━━╮
│ • *love* @user
│ • *kiss* @user
│ • *hug* @user
│ • *slap* @user
│ • *pat* @user
│ • *cuddle* @user
│ • *bully* @user
│ • *kill* @user
╰━━━━━━━━━━━━━━━━━━━╯`
    }
};

// User session storage
let userSessions = {};

// Send menu page
async function sendMenuPage(message, pageNum = 0) {
    const user = message.from;
    userSessions[user] = { page: pageNum };
    
    const page = menuData.pages[pageNum];
    
    await client.sendMessage(user, {
        text: `╭━━━〔 *BOSS-MD AI BOT* 〕━━━┈⊷
│ 📄 Page: ${pageNum + 1}/${menuData.pages.length}
│ 📚 Commands: 332
│ 👑 Owner: BOSS-MD
╰━━━━━━━━━━━━━━━━━━━━━━━━━`,
        footer: "Select option or type .next/.back",
        title: page.title,
        buttonText: "📋 Select",
        sections: [page]
    });
}

// Send command details
async function sendCommandDetails(message, cmdId) {
    const cmd = menuData.commands[cmdId];
    if (cmd) {
        await client.sendMessage(message.from, cmd);
        // Auto return to menu after 5 seconds
        setTimeout(async () => {
            const session = userSessions[message.from];
            if (session) {
                await sendMenuPage(message, session.page);
            }
        }, 5000);
    } else {
        await client.sendMessage(message.from, `❌ Command "${cmdId}" not found. Use *.menu* to see all options.`);
    }
}

// Handle messages
client.on('message', async (message) => {
    if (message.body.startsWith('.')) {
        const cmd = message.body.toLowerCase().trim();
        
        switch(cmd) {
            case '.menu':
                await sendMenuPage(message, 0);
                break;
                
            case '.next':
                const nextSession = userSessions[message.from];
                if (nextSession) {
                    const nextPage = (nextSession.page + 1) % menuData.pages.length;
                    await sendMenuPage(message, nextPage);
                } else {
                    await sendMenuPage(message, 0);
                }
                break;
                
            case '.back':
                const backSession = userSessions[message.from];
                if (backSession) {
                    const prevPage = (backSession.page - 1 + menuData.pages.length) % menuData.pages.length;
                    await sendMenuPage(message, prevPage);
                } else {
                    await sendMenuPage(message, 0);
                }
                break;
                
            case '.help':
                await client.sendMessage(message.from, 
                    `╭━━━〔 🆘 HELP 〕━━━╮
│ *Commands:*
│ • .menu - Show menu
│ • .next - Next page
│ • .back - Previous page
│ • .help - This help
│ • .ping - Check bot
│ • .owner - Contact owner
╰━━━━━━━━━━━━━━━━━━━╯`);
                break;
                
            case '.ping':
                const start = Date.now();
                await client.sendMessage(message.from, '🏓 Pinging...');
                const latency = Date.now() - start;
                await client.sendMessage(message.from, `🏓 Pong! Latency: ${latency}ms`);
                break;
                
            default:
                // Check if it's a menu command
                const cmdKey = cmd.substring(1);
                if (menuData.commands[cmdKey]) {
                    await sendCommandDetails(message, cmdKey);
                } else {
                    await client.sendMessage(message.from, 
                        `❌ Unknown command. Use *.menu* to see all available commands.\n📌 Example: .facebook [url]`);
                }
        }
    }
});

// Handle button clicks (list responses)
client.on('message', async (message) => {
    if (message.type === 'list_response') {
        const selectedId = message.listResponse.title;
        const session = userSessions[message.from];
        
        // Navigation handling
        if (selectedId.includes('next') || selectedId.includes('Next')) {
            if (session) {
                const nextPage = (session.page + 1) % menuData.pages.length;
                await sendMenuPage(message, nextPage);
            }
            return;
        }
        
        if (selectedId.includes('back') || selectedId.includes('Back')) {
            if (session) {
                const prevPage = (session.page - 1 + menuData.pages.length) % menuData.pages.length;
                await sendMenuPage(message, prevPage);
            }
            return;
        }
        
        if (selectedId.includes('home') || selectedId.includes('Home')) {
            await sendMenuPage(message, 0);
            return;
        }
        
        // Command handling
        const cmdMap = {
            '📥 Download Menu': 'dl',
            '👥 Group Menu': 'grp',
            '😄 Fun Menu': 'fun',
            '👑 Owner Menu': 'owner',
            '🤖 AI Menu': 'ai',
            '🎎 Anime Menu': 'anime',
            '🔄 Convert Menu': 'convert',
            '📌 Other Menu': 'other',
            '💞 Reactions': 'react',
            '📸 Image Menu': 'img',
            '🛠️ Text Tools': 'tools',
            '🔍 Search': 'search',
            '🎭 Interactive': 'interactive',
            '🎲 Random': 'random',
            '🔢 Calculate': 'calc',
            '🎵 Media': 'media',
            '📊 Bot Info': 'info',
            '⚡ Admin Tools': 'admin',
            '👤 User Tools': 'user',
            '📋 All Commands': 'cmd'
        };
        
        if (cmdMap[selectedId]) {
            await sendCommandDetails(message, cmdMap[selectedId]);
        }
    }
});

// Bot startup
client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log('📱 Scan QR code with WhatsApp');
});

client.on('ready', () => {
    console.log('✅ BOSS-MD Bot is ready!');
    console.log('📋 Commands available:');
    console.log('• .menu - Show scrollable menu');
    console.log('• .help - Show help');
    console.log('• .ping - Check bot status');
});

client.on('disconnected', (reason) => {
    console.log('❌ Bot disconnected:', reason);
});

// Initialize bot
client.initialize();

// Export for use in other files
module.exports = { client, sendMenuPage };
