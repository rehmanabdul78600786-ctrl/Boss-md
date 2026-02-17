const axios = require("axios");

async function getVideoBuffer(url) {
    const res = await axios.get(url, { responseType: "arraybuffer" });
    return Buffer.from(res.data);
}
const config = require('../config');
const { cmd, commands } = require('../command');
const os = require("os");
const fs = require("fs");

// DYNAMIC BOT NAME SYSTEM - Changes every time
const botNameTemplates = [
    // Standard Styles
    { name: "𝓑𝓞𝓢𝓢-𝓜𝓓", type: "script" },
    { name: "ᴮᴼˢˢᴹᴰ ᭄", type: "smallcaps" },
    { name: "𝕭𝖔𝖘𝖘-𝕸𝖉", type: "boldfraktur" },
    { name: "boss-𝔐𝔡", type: "fraktur" },
    { name: "✿𝓑𝓸𝓼𝓼-𝓶𝓭✿", type: "flowers" },
    { name: "꧁𝑩𝒐𝒔𝒔-𝒎𝒅꧂", type: "bamboo" },
    
    // New Unique Styles
    { name: "༺B⃟O⃟S⃟S⃟-⃟M⃟D⃟༻", type: "circle" },
    { name: "『𝐁𝐎𝐒𝐒-𝐌𝐃』", type: "bold" },
    { name: "【ＢＯＳＳ－ＭＤ】", type: "fullwidth" },
    { name: "≛BOSS-MD≛", type: "star" },
    { name: "『ʙᴏss-ᴍᴅ』", type: "small" },
    { name: "『ᗷOᔕᔕ-ᗰᗪ』", type: "box" },
    { name: "⟦𝙱𝙾𝚂𝚂-𝙼𝙳⟧", type: "mono" },
    { name: "『𝘉𝘖𝘚𝘚-𝘔𝘋』", type: "italic" },
    { name: "『𝘽𝙊𝙎𝙎-𝙈𝘿』", type: "boldsans" },
    { name: "『𝓑𝓞𝓢𝓢-𝓜𝓓』", type: "scriptbold" },
    { name: "『𝕭𝖔𝖘𝖘-𝕸𝖉』", type: "frakturbold" },
    { name: "『🅑🅞🅢🅢-🅜🅓』", type: "negative" },
    { name: "『🄱🄾🅂🅂-🄼🄳』", type: "squared" },
    { name: "『🅱🅾🆂🆂-🅼🅳』", type: "sans" },
    { name: "『🇧 🇴 🇸 🇸 - 🇲 🇩』", type: "flags" },
    { name: "『B҉O҉S҉S҉-҉M҉D҉』", type: "sparkles" },
    { name: "『B⃣O⃣S⃣S⃣-⃣M⃣D⃣』", type: "keycap" },
    { name: "『B⃠O⃠S⃠S⃠-⃠M⃠D⃠』", type: "slash" },
    { name: "『B̶o̶s̶s̶-̶M̶d̶』", type: "strike" },
    { name: "『B̾o̾s̾s̾-̾M̾d̾』", type: "zigzag" },
    { name: "『B̲o̲s̲s̲-̲M̲d̲』", type: "underline" },
    { name: "『B̳o̳s̳s̳-̳M̳d̳』", type: "doubleline" },
    { name: "『B͓̽o͓̽s͓̽s͓̽-͓̽M͓̽d͓̽』", type: "shadow" },
    { name: "『B̆ŏs̆s̆-̆M̆d̆』", type: "arc" },
    { name: "『B͜͡o͜͡s͜͡s͜͡-͜͡M͜͡d͜͡』", type: "ligature" },
    { name: "『B⃤O⃤S⃤S⃤-⃤M⃤D⃤』", type: "triangle" },
    { name: "『B̺͆O̺͆S̺͆S̺͆-̺͆M̺͆D̺͆』", type: "subtext" },
    { name: "『B⃟O⃟S⃟S⃟-⃟M⃟D⃟』", type: "circlefill" },
    { name: "『B⃦O⃦S⃦S⃦-⃦M⃦D⃦』", type: "dotted" },
    { name: "『B⃧O⃧S⃧S⃧-⃧M⃧D⃧』", type: "parentheses" },
    { name: "『B⃨O⃨S⃨S⃨-⃨M⃨D⃨』", type: "diamond" },
    { name: "『B⃩O⃩S⃩S⃩-⃩M⃩D⃩』", type: "asterisk" },
    { name: "『B⃪O⃪S⃪S⃪-⃪M⃪D⃪』", type: "double" },
    { name: "『B⃫O⃫S⃫S⃫-⃫M⃫D⃫』", type: "triple" },
    { name: "『B⃬O⃬S⃬S⃬-⃬M⃬D⃬』", type: "quadruple" },
    { name: "『B⃭O⃭S⃭S⃭-⃭M⃭D⃭』", type: "circleoutline" },
    { name: "『B⃮O⃮S⃮S⃮-⃮M⃮D⃮』", type: "square" },
    { name: "『B⃯O⃯S⃯S⃯-⃯M⃯D⃯』", type: "diamondsolid" },
    { name: "『B⃰O⃰S⃰S⃰-⃰M⃰D⃰』", type: "asteriskfill" }
];

// Get random bot name
function getRandomBotName() {
    return botNameTemplates[Math.floor(Math.random() * botNameTemplates.length)].name;
}

// ORIGINAL PING COMMAND (Your ping2 renamed as ping)
cmd({
    pattern: "pong",
    alias: ["speed", "pong", "test", "ping2"], // ADDED ping2 as alias
    desc: "Check bot's response time with fancy design.",
    category: "main",
    react: "🌡️",
    filename: __filename
},
async (conn, mek, m, { from, quoted, sender, reply, pushname }) => {
    try {
        const start = new Date().getTime();

        const reactionEmojis = ['🔥', '⚡', '🚀', '💨', '🎯', '🎉', '🌟', '💥', '🕐', '🔹'];
        const textEmojis = ['💎', '🏆', '⚡️', '🚀', '🎶', '🌠', '🌀', '🔱', '🛡️', '✨'];

        const reactionEmoji = reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)];
        let textEmoji = textEmojis[Math.floor(Math.random() * textEmojis.length)];

        // Ensure reaction and text emojis are different
        while (textEmoji === reactionEmoji) {
            textEmoji = textEmojis[Math.floor(Math.random() * textEmojis.length)];
        }

        // Send reaction using conn.sendMessage()
        await conn.sendMessage(from, {
            react: { text: textEmoji, key: mek.key }
        });

        const end = new Date().getTime();
        const responseTime = (end - start) / 1000;

        // Get random fancy bot name
        const fancyBotName = getRandomBotName();

        const text = `> *${fancyBotName} SPEED: ${responseTime.toFixed(2)}ms ${reactionEmoji}*`;

        await conn.sendMessage(from, {
            text,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363422481806597@newsletter',
                    newsletterName: "𝗕𝗼𝘀𝘀-𝗺𝗱",
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("Error in ping command:", e);
        reply(`An error occurred: ${e.message}`);
    }
});

// UNIQUE PING COMMAND - Completely Different Every Time
cmd({
    pattern: "ping3",
    alias: ["liveping", "fancyping", "uniqueping"], // NEW COMMAND
    desc: "UNIQUE ping design that changes every time!",
    category: "main",
    react: "🌀",
    filename: __filename
},
async (conn, mek, m, { from, sender, pushname, reply, isGroup }) => {
    try {
        const startTime = Date.now();
        
        // RANDOM DESIGN SELECTION
        const designs = ["star", "hexagon", "circle", "diamond", "wave", "gear", "flower", "crown"];
        const currentDesign = designs[Math.floor(Math.random() * designs.length)];
        
        // RANDOM BOT NAME (different every time)
        const botName = getRandomBotName();
        
        // RANDOM EMOJI SET
        const emojiSets = [
            ["✨", "🌟", "⭐", "💫", "🌠"],
            ["⚡", "🔥", "💥", "🎇", "🌈"],
            ["🌀", "💠", "🔶", "🔷", "🔸"],
            ["🎮", "🎯", "🎲", "🎪", "🎭"],
            ["🔰", "🛡️", "⚔️", "🏹", "🪄"]
        ];
        const currentEmojis = emojiSets[Math.floor(Math.random() * emojiSets.length)];
        
        // RANDOM COLOR THEME
        const themes = [
            { border: "═", corner: "╔╗╚╝", line: "║" },
            { border: "─", corner: "┌┐└┘", line: "│" },
            { border: "━", corner: "┏┓┗┛", line: "┃" },
            { border: "═", corner: "╔╗╚╝", line: "║" },
            { border: "─", corner: "╭╮╰╯", line: "│" },
            { border: "✧", corner: "✦", line: "✧" },
            { border: "•", corner: "◦", line: "•" },
            { border: "▒", corner: "▓", line: "░" }
        ];
        const theme = themes[Math.floor(Math.random() * themes.length)];
        
        // RANDOM LOADING MESSAGE
        const loadingMessages = [
            `🌀 *Rotating Ping Matrix...*`,
            `✨ *Generating Unique Design...*`,
            `⚡ *Calculating Cosmic Speed...*`,
            `🌟 *Creating Magic Response...*`,
            `🎮 *Loading Game Engine...*`,
            `🔮 *Predicting Ping Future...*`,
            `🌌 *Accessing Multiverse Data...*`,
            `🎨 *Painting Digital Canvas...*`,
            `💎 *Crafting Crystal Response...*`,
            `🪐 *Connecting to Space Network...*`
        ];
        
        const loadingMsg = await reply(loadingMessages[Math.floor(Math.random() * loadingMessages.length)]);
        
        // CALCULATE PING
        const endTime = Date.now();
        const ping = endTime - startTime;
        
        // RANK SYSTEM
        let rank = "";
        let rankEmoji = "";
        if (ping < 50) {
            rank = "GOD TIER";
            rankEmoji = "👑";
        } else if (ping < 100) {
            rank = "LEGENDARY";
            rankEmoji = "🔥";
        } else if (ping < 200) {
            rank = "ELITE";
            rankEmoji = "⚡";
        } else if (ping < 500) {
            rank = "PRO";
            rankEmoji = "💎";
        } else if (ping < 1000) {
            rank = "AVERAGE";
            rankEmoji = "✅";
        } else {
            rank = "BEGINNER";
            rankEmoji = "🐢";
        }
        
        // BUILD THE UNIQUE MESSAGE
        const uniqueMessage = `
${theme.corner[0]}${theme.border.repeat(30)}${theme.corner[1]}
${theme.line}        ✨ ${botName} ✨        ${theme.line}
${theme.line}     🎯 UNIQUE PING DESIGN     ${theme.line}
${theme.corner[2]}${theme.border.repeat(30)}${theme.corner[3]}

${currentEmojis[0]} 𝗣𝗜𝗡𝗚 » ${ping}ms
${currentEmojis[1]} 𝗥𝗔𝗡𝗞 » ${rank} ${rankEmoji}
${currentEmojis[2]} 𝗗𝗘𝗦𝗜𝗚𝗡 » ${currentDesign.toUpperCase()}

${theme.line}${theme.border.repeat(30)}${theme.line}

👤 𝗨𝗦𝗘𝗥 » ${pushname || "User"}
📱 𝗡𝗨𝗠𝗕𝗘𝗥 » ${sender.split('@')[0]}
🕒 𝗧𝗜𝗠𝗘 » ${new Date().toLocaleTimeString()}

${currentEmojis[3]} 𝗦𝗬𝗦𝗧𝗘𝗠 𝗜𝗡𝗙𝗢
├─ 💾 𝗥𝗔𝗠 » ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB
├─ 🖥️ 𝗢𝗦 » ${os.platform().toUpperCase()}
└─ ⚙️ 𝗖𝗣𝗨 » ${os.cpus().length} Core

${theme.corner[0]}${theme.border.repeat(30)}${theme.corner[1]}
🎲 𝗘𝗩𝗘𝗥𝗬 𝗣𝗜𝗡𝗚 𝗜𝗦 𝗗𝗜𝗙𝗙𝗘𝗥𝗘𝗡𝗧!
✨ Name changes every time
🎨 Design changes every time
🌈 Colors change every time
⚡ Emojis change every time
${theme.corner[2]}${theme.border.repeat(30)}${theme.corner[3]}

⚡ 𝗣𝗢𝗪𝗘𝗥𝗘𝗗 𝗕𝗬: ${botName}
🌀 𝗨𝗡𝗜𝗤𝗨𝗘𝗡𝗘𝗦𝗦: 100% GUARANTEED`;
        
        // Delete loading message
        if (loadingMsg) {
            await conn.sendMessage(from, { delete: loadingMsg.key });
        }
        
        // Send unique ping
        await conn.sendMessage(from, {
            text: uniqueMessage.trim(),
            contextInfo: {
                mentionedJid: [sender],
                externalAdReply: {
                    title: `🎨 ${botName} UNIQUE PING`,
                    body: `Different Every Time • ${ping}ms`,
                    thumbnail: { 
                        url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&q=80" 
                    },
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: mek });
        
        // Send random reaction
        const reactions = ["🌀", "✨", "⚡", "🌟", "🎯", "💎", "🔥", "🎮"];
        await conn.sendMessage(from, {
            react: { 
                text: reactions[Math.floor(Math.random() * reactions.length)], 
                key: mek.key 
            }
        });
        
    } catch (error) {
        console.error("Unique ping error:", error);
        await reply(`🌀 *Unique Ping Error*\n${error.message}\n\nTry .ping for normal ping!`);
    }
});

// VIDEO PING COMMAND - Your original ping2 with video
cmd({
    pattern: "ping2",
    alias: ["videoping", "vp", "vidping"], // Your original ping2 command
    use: '.ping',
    desc: "Video ping with fancy design.",
    category: "main",
    react: "🎬",
    filename: __filename
},
async (conn, mek, m, { from, quoted, sender, reply, pushname }) => {
    try {
        const start = new Date().getTime();

        const reactionEmojis = ['🔥', '⚡', '🚀', '💨', '🎯', '🎉', '🌟', '💥', '🕐', '🔹'];
        const textEmojis = ['💎', '🏆', '⚡️', '🚀', '🎶', '🌠', '🌀', '🔱', '🛡️', '✨'];

        const reactionEmoji = reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)];
        let textEmoji = textEmojis[Math.floor(Math.random() * textEmojis.length)];

        // Ensure reaction and text emojis are different
        while (textEmoji === reactionEmoji) {
            textEmoji = textEmojis[Math.floor(Math.random() * textEmojis.length)];
        }

        // Send reaction
        await conn.sendMessage(from, {
            react: { text: textEmoji, key: mek.key }
        });

        // Get system info
        const totalRAM = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
        const usedRAM = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        const freeRAM = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);
        const platform = os.platform();
        const arch = os.arch();
        const cpus = os.cpus().length;
        const cpuModel = os.cpus()[0].model.split('@')[0];
        const uptime = process.uptime();
        
        // Format uptime
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);
        const uptimeStr = `${hours}h ${minutes}m ${seconds}s`;

        const end = new Date().getTime();
        const responseTime = (end - start) / 1000;

        // Get random fancy bot name
        const fancyBotName = getRandomBotName();

        // Performance rating
        let performanceLevel = "";
        if (responseTime < 0.1) performanceLevel = "⚡ ULTRA FAST";
        else if (responseTime < 0.5) performanceLevel = "🚀 EXTREME";
        else if (responseTime < 1) performanceLevel = "🔥 FAST";
        else if (responseTime < 2) performanceLevel = "✅ GOOD";
        else performanceLevel = "🐢 SLOW";

        // Create detailed ping message
        const text = `
╔════════════════════════════════╗
║        🎬 *VIDEO PING 1.0*       ║
╚════════════════════════════════╝

🤖 *BOT:* ${fancyBotName}
⏱️ *RESPONSE:* ${responseTime.toFixed(3)}s
🏆 *PERFORMANCE:* ${performanceLevel} ${reactionEmoji}

📊 *SYSTEM INFO:*
├─ 🖥️ OS: ${platform.toUpperCase()}
├─ 🧠 CPU: ${cpuModel}
├─ 📊 CORES: ${cpus}
├─ 💾 RAM: ${usedRAM}MB
├─ 📈 FREE: ${freeRAM}GB
└─ ⏳ UPTIME: ${uptimeStr}

👤 *USER:* ${pushname || "User"}
📞 *NUMBER:* ${sender.split('@')[0]}

🎯 *SPEED RATING:*
${responseTime < 0.1 ? "⭐⭐⭐⭐⭐ ELITE" : 
  responseTime < 0.5 ? "⭐⭐⭐⭐⭐ EXCELLENT" : 
  responseTime < 1 ? "⭐⭐⭐⭐ GREAT" : 
  responseTime < 2 ? "⭐⭐⭐ GOOD" : "⭐⭐ AVERAGE"}

                ⚡ *BOSS-MD Technology*
        🕒 *TIME:* ${new Date().toLocaleTimeString()}
        `.trim();

        // FAST reply (instant) - COMMENTED
        // await reply("⚡ Checking speed...");

        // TikTok video buffer
        const videoBuffer = await getVideoBuffer(
            "https://files.catbox.moe/vpar3s.mp4"
        );

        // Send VIDEO with caption
        await conn.sendMessage(from, {
            video: videoBuffer,
            caption: text,
            mimetype: "video/mp4",
            contextInfo: {
                mentionedJid: [sender],
                externalAdReply: {
                    title: "🎬 VIDEO PING 1.0",
                    body: "TikTok Video • Fast Response",
                    thumbnail: {
                        url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&q=80"
                    },
                    mediaType: 2,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: mek });
    } catch (e) {
        console.error("Video ping error:", e);
        // Fallback to text if video fails
        const end = new Date().getTime();
        const responseTime = (end - start) / 1000;
        const fancyBotName = getRandomBotName();
        
        const fallbackText = `
🎬 *VIDEO PING 2.0 (Text Mode)*

🤖 BOT: ${fancyBotName}
⏱️ RESPONSE: ${responseTime.toFixed(3)}s
📊 VIDEO ERROR: ${e.message}

⚡ Using text mode for now...
        `.trim();
        
        await reply(fallbackText);
    }
});

// SIMPLE PONG COMMAND (Your original simple ping)
cmd({
    pattern: "ping1",
    alias: ["pong", "speed", "test"],
    desc: "Check bot response speed and status",
    category: "main",
    react: "⚡",
    filename: __filename
},
async (conn, mek, m, { from, reply, pushname }) => {
    try {
        const start = Date.now();
        const initialMsg = await reply(`_Pinging chapri..._`);
        
        const end = Date.now();
        const ping = end - start;
        const memory = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1);
        
        // Smart status based on ping
        let status = "✅ Excellent";
        let emoji = "⚡";
        
        if (ping > 200) {
            status = "🚀 Good";
            emoji = "🚀";
        }
        if (ping > 500) {
            status = "⚠️ Slow";
            emoji = "🐢";
        }
        
        await conn.sendMessage(from, { 
            text: `
${emoji} *BOT STATUS REPORT* ${emoji}

🏓 Response Time: *${ping}ms*
🧠 Memory Usage: *${memory}MB*
📊 Status: *${status}*

👤 User: ${pushname || "User"}
🎯 Prefix: ${config.PREFIX || "."}
            ` 
        }, { quoted: initialMsg });
        
    } catch (e) {
        console.error("Ping error:", e);
        reply("❌ Could not check status");
    }
});

// COMMAND SUMMARY MESSAGE
cmd({
    pattern: "pinghelp",
    alias: ["pingcommands", "pchelp"],
    desc: "Show all ping commands.",
    category: "main",
    react: "📚",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        const helpMessage = `
╔════════════════════════════════╗
║       🚀 PING COMMANDS         ║
╚════════════════════════════════╝

📌 *Available Commands:*

1. *.ping* / *.speed* / *.pong* / *.test*
   » Your original ping2 command
   » Fancy bot name, random reactions

2. *.ping2* / *.videoping* / *.vp*
   » Video ping with system stats
   » Shows video with detailed info

3. *.ping3* / *.uniqueping* / *.fancyping*
   » UNIQUE design every time!
   » Different name, design, colors each use

4. *.pong* / *.simpleping*
   » Simple ping response
   » Quick and basic

5. *.pinghelp*
   » This help message

🎯 *Features:*
• 40+ different bot name styles
• Random designs every time
• Video support in ping2
• System information
• Performance ratings

⚡ *All commands working!*
🔗 *Original ping2 is now .ping*
        `.trim();
        
        await reply(helpMessage);
        
    } catch (error) {
        console.error("Ping help error:", error);
        await reply(`Error: ${error.message}`);
    }
});

// Send welcome message when someone says ping
cmd({
    pattern: "ping4",
    desc: "Auto response to ping mentions",
    category: "auto",
    filename: __filename,
    fromMe: false
},
async (conn, mek, m, { from, sender, body, reply }) => {
    try {
        if (body && body.toLowerCase().includes("ping")) {
            const botName = getRandomBotName();
            await reply(`🏓 *${botName} is here!*\n\nUse:\n• .ping - For speed test\n• .ping2 - For video ping\n• .ping3 - For unique design\n• .pinghelp - For all commands`);
        }
    } catch (e) {
        // Silent fail
    }
});