const { cmd } = require('../command');

// =================== Fun Messages ===================
const muthMessages = [
    "😂 Muth Mare! Dost hiraan ho gaya 😏",
    "🤣 Dost bhi react kar raha hai! Muth level max!",
    "😎 Boss-MD dekha! Ye muth kamaal ka tha!",
    "😜 Arre bhai, ye muth bhi zabardast tha! Ha ha ha!",
    "😆 Haha! Sab ne muth feel kiya! 😂"
];

const muthImages = [
    "https://i.ibb.co/8dF7s6f/muth1.jpg",
    "https://i.ibb.co/Vwx3JTp/muth2.jpg",
    "https://i.ibb.co/NFZfXvQ/muth3.jpg"
];

const ungliMessages = [
    "🖕 Ungli dekh ke shock ho gaye?",
    "😜 Boss-MD ki ungli unbeatable!",
    "😂 Ungli mode activated! Dost hiran!",
    "😏 Arre bhai, ungli ka level max!"
];

const xMessages = [
    "😱 Chupy lao! Surprise! 😎",
    "😳 Arre bhai, x command ne hiraan kar diya!",
    "👀 Dekha? Boss-MD ka magic! 🤣",
    "😂 Haha! Ye x command full funny tha!"
];

const xImages = [
    "https://i.ibb.co/2y0vVQx/x1.jpg",
    "https://i.ibb.co/NYX1YB3/x2.jpg"
];

// =================== .muth Command ===================
cmd({
    pattern: "muth",
    alias: [],
    desc: "Fun muth command with emojis & images",
    category: "fun",
    react: "✊",
    filename: __filename,
    use: ".muth"
}, async (conn, mek, m, { from }) => {
    try {
        const msg = muthMessages[Math.floor(Math.random() * muthMessages.length)];
        const img = muthImages[Math.floor(Math.random() * muthImages.length)];

        await conn.sendMessage(from, {
            image: { url: img },
            caption: msg
        }, { quoted: mek });
    } catch (e) {
        console.error("Muth Command Error:", e);
        await conn.sendMessage(from, { text: "❌ Error in .muth command!" }, { quoted: mek });
    }
});

// =================== .ungli Command ===================
cmd({
    pattern: "ungli",
    alias: [],
    desc: "Random fun message - Ungli",
    category: "fun",
    react: "🖕",
    filename: __filename,
    use: ".ungli"
}, async (conn, mek, m, { from }) => {
    try {
        const msg = ungliMessages[Math.floor(Math.random() * ungliMessages.length)];
        await conn.sendMessage(from, { text: msg }, { quoted: mek });
    } catch (e) {
        console.error("Ungli Command Error:", e);
        await conn.sendMessage(from, { text: "❌ Error in .ungli command!" }, { quoted: mek });
    }
});

// =================== .x Command ===================
cmd({
    pattern: "x",
    alias: [],
    desc: "Surprise / Chupy lao fun with images",
    category: "fun",
    react: "❌",
    filename: __filename,
    use: ".x"
}, async (conn, mek, m, { from }) => {
    try {
        const msg = xMessages[Math.floor(Math.random() * xMessages.length)];
        const img = xImages[Math.floor(Math.random() * xImages.length)];

        await conn.sendMessage(from, {
            image: { url: img },
            caption: msg
        }, { quoted: mek });
    } catch (e) {
        console.error("X Command Error:", e);
        await conn.sendMessage(from, { text: "❌ Error in .x command!" }, { quoted: mek });
    }
});

console.log("🎉 Megnumin Ultimate Fun Plugin Loaded!");
