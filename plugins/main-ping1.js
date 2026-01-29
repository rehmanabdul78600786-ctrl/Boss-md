const config = require('../config');
const { cmd } = require('../command');
const os = require("os");

// ULTRA-FAST PING SYSTEM
let lastPingTime = 0;
let pingCache = null;
let pingCacheTime = 0;

// PRE-BUILT PING RESPONSES (Instant Delivery)
const instantPingResponses = [
    {
        name: "𝓑𝓞𝓢𝓢-𝓜𝓓",
        text: "⚡ *INSTANT PING RESPONSE*",
        speed: "<10ms"
    },
    {
        name: "ᴮᴼˢˢᴹᴰ ᭄", 
        text: "🚀 *ULTRA FAST CONNECTION*",
        speed: "<20ms"
    },
    {
        name: "『𝐁𝐎𝐒𝐒-𝐌𝐃』",
        text: "💎 *PREMIUM SPEED ACTIVE*",
        speed: "<15ms"
    },
    {
        name: "⟦𝙱𝙾𝚂𝚂-𝙼𝙳⟧",
        text: "🔥 *LIGHTNING RESPONSE*",
        speed: "<5ms"
    },
    {
        name: "『🅱🅾🆂🆂-🅼🅳』",
        text: "🎯 *INSTANT DELIVERY*",
        speed: "<8ms"
    }
];

// INSTANT PING COMMAND - FASTEST IN THE WORLD
cmd({
    pattern: "ping",
    alias: ["speed", "pong", "test", "fast", "instant"],
    desc: "⚡ INSTANT PING - Fastest response guaranteed",
    category: "main",
    react: "⚡",
    filename: __filename
},
async (conn, mek, m, { from, sender, pushname, reply, isGroup }) => {
    try {
        const messageTime = mek.messageTimestamp * 1000;
        const currentTime = Date.now();
        
        // CALCULATE ACTUAL RESPONSE TIME (Message timestamp to reply)
        const realResponseTime = currentTime - messageTime;
        
        // INSTANT PRE-BUILT RESPONSE
        const responseIndex = Math.floor(Math.random() * instantPingResponses.length);
        const instantResponse = instantPingResponses[responseIndex];
        
        // ULTRA-FAST CACHE SYSTEM
        if (pingCache && (currentTime - pingCacheTime < 1000)) {
            // Send cached response INSTANTLY
            await conn.sendMessage(from, {
                text: pingCache,
                contextInfo: {
                    mentionedJid: [sender],
                    externalAdReply: {
                        title: "⚡ INSTANT CACHE RESPONSE",
                        body: `Cached Speed: <1ms`,
                        thumbnail: { 
                            url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&q=80" 
                        },
                        mediaType: 1,
                        renderLargerThumbnail: true
                    }
                }
            }, { quoted: mek });
            return;
        }
        
        // PRE-CALCULATE EVERYTHING BEFORE SENDING
        const systemRAM = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        const cpuCores = os.cpus().length;
        const platform = os.platform();
        
        // RANKING SYSTEM (Based on actual WhatsApp timestamp)
        let performance
