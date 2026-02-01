// ============================================
// 🎵 PLAY.JS - BOSS-MD STYLE
// ============================================
const { cmd } = require('../command');
const yts = require('yt-search');
const axios = require('axios');

// ────────────────────────────────────────────
// 🎯 CONFIGURATION
// ────────────────────────────────────────────
const CONFIG = {
    BOT_NAME: "BOSS-MD",
    VERSION: "v2.0",
    AUTHOR: "BOSS TEAM"
};

// ────────────────────────────────────────────
// 📡 WORKING APIs 2024
// ────────────────────────────────────────────
const APIS = [
    { name: "🎯 Y2MATE PRO", url: id => `https://api.y2mate.guru/api/ytmp3?id=${id}`, get: d => d?.url },
    { name: "⚡ LOLHUMAN VIP", url: url => `https://api.lolhuman.xyz/api/ytaudio2?apikey=GataDios&url=${encodeURIComponent(url)}`, get: d => d?.result?.link },
    { name: "🚀 DHAMZ XP", url: url => `https://api.dhamzxploit.my.id/download/ytmp3?url=${encodeURIComponent(url)}`, get: d => d?.result },
    { name: "💎 VIHANGA YT", url: url => `https://api.vihangayt.me/download/audio?url=${encodeURIComponent(url)}`, get: d => d?.data?.url }
];

// ────────────────────────────────────────────
// 🛠️ UTILITY FUNCTIONS
// ────────────────────────────────────────────
function extractVideoId(url) {
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/,
        /youtube\.com\/embed\/([\w-]{11})/,
        /youtube\.com\/v\/([\w-]{11})/
    ];
    for (let pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }
    return null;
}

function formatViews(views) {
    if (!views) return '0';
    if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M';
    if (views >= 1000) return (views / 1000).toFixed(1) + 'K';
    return views.toString();
}

async function tryAPIs(videoId, videoUrl) {
    for (let api of APIS) {
        try {
            console.log(`🎯 Trying: ${api.name}`);
            const url = api.name.includes("Y2MATE") ? api.url(videoId) : api.url(videoUrl);
            const res = await axios.get(url, { timeout: 8000 });
            const audioUrl = api.get(res.data);
            if (audioUrl && audioUrl.includes('http')) {
                console.log(`✅ Success: ${api.name}`);
                return { url: audioUrl, api: api.name };
            }
        } catch (e) {
            console.log(`❌ Failed: ${api.name}`);
            continue;
        }
    }
    return null;
}

// ────────────────────────────────────────────
// 🎵 MAIN PLAY COMMAND
// ────────────────────────────────────────────
cmd({
    pattern: "play",
    alias: ["song", "music", "audio"],
    react: "🎵",
    desc: "Download high quality audio from YouTube",
    category: "media",
    use: "<song_name>",
    filename: __filename
}, async (conn, mek, m, { from, args, reply, sender }) => {
    try {
        // ────────────────────────────────────────────
        // 📥 INPUT VALIDATION
        // ────────────────────────────────────────────
        const query = args.join(" ").trim();
        if (!query) {
            return await reply(`🎵 *${CONFIG.BOT_NAME} MUSIC SYSTEM* 🎵

❌ *MISSING INPUT*
━━━━━━━━━━━━━━━
📝 Please provide song name
💡 Example: .play tere bin
💡 Example: .play dil diyan gallan

🔧 *${CONFIG.VERSION}* | 👑 *${CONFIG.AUTHOR}*`);
        }

        // ────────────────────────────────────────────
        // 🔍 SEARCHING PHASE
        // ────────────────────────────────────────────
        const searchMsg = await reply(`🔍 *SEARCHING YOUTUBE*
━━━━━━━━━━━━━━━
🎯 Query: *${query}*
⏳ Please wait...`);
        
        let search;
        try {
            search = await yts(query);
        } catch (e) {
            await conn.sendMessage(from, { delete: searchMsg.key });
            return await reply(`❌ *SEARCH FAILED*
━━━━━━━━━━━━━━━
📛 Error: YouTube search unavailable
🔧 Try again in 30 seconds`);
        }
        
        if (!search.videos || search.videos.length === 0) {
            await conn.sendMessage(from, { delete: searchMsg.key });
            return await reply(`❌ *NO RESULTS FOUND*
━━━━━━━━━━━━━━━
🎯 Query: *${query}*
💡 Try different keywords
💡 Check spelling`);
        }
        
        const video = search.videos[0];
        const videoId = extractVideoId(video.url);
        
        if (!videoId) {
            await conn.sendMessage(from, { delete: searchMsg.key });
            return await reply(`❌ *INVALID VIDEO DATA*
━━━━━━━━━━━━━━━
🔗 Could not process YouTube URL
💡 Try different song`);
        }
        
        await conn.sendMessage(from, { delete: searchMsg.key });

        // ────────────────────────────────────────────
        // 🖼️ THUMBNAIL WITH DETAILS
        // ────────────────────────────────────────────
        await conn.sendMessage(from, {
            image: { 
                url: video.thumbnail || 'https://i.ibb.co/4tM1WqG/music-thumb.jpg'
            },
            caption: `🎵 *${video.title.toUpperCase()}*
━━━━━━━━━━━━━━━━━━━━

👤 *ARTIST*: ${video.author?.name || 'Unknown Artist'}
⏱️ *DURATION*: ${video.timestamp || 'N/A'}
👁️ *VIEWS*: ${formatViews(video.views)}
📅 *UPLOADED*: ${video.ago || 'N/A'}
🔗 *URL*: ${video.url}

⬇️ *DOWNLOADING AUDIO...*
━━━━━━━━━━━━━━━━━━━━
⏳ Initializing download system
🔧 Checking available sources
📥 Preparing audio stream

🎛️ *${CONFIG.BOT_NAME} MUSIC SYSTEM*
🔧 Version: ${CONFIG.VERSION}
👑 Powered by: ${CONFIG.AUTHOR}`,
            contextInfo: {
                externalAdReply: {
                    title: `🎧 ${CONFIG.BOT_NAME} MUSIC`,
                    body: `Playing: ${video.title.substring(0, 30)}`,
                    thumbnail: { url: video.thumbnail },
                    mediaType: 1,
                    mediaUrl: video.url,
                    sourceUrl: video.url
                }
            }
        }, { quoted: mek });

        // ────────────────────────────────────────────
        // 📥 DOWNLOADING PHASE
        // ────────────────────────────────────────────
        const downloadMsg = await reply(`⬇️ *DOWNLOAD IN PROGRESS*
━━━━━━━━━━━━━━━
🎵 Title: *${video.title}*
🔧 Method: Trying APIs...
⏳ Status: Initializing`);

        const result = await tryAPIs(videoId, video.url);
        
        if (!result) {
            await conn.sendMessage(from, { delete: downloadMsg.key });
            return await reply(`❌ *DOWNLOAD FAILED*
━━━━━━━━━━━━━━━
🎵 Title: *${video.title}*
📛 Error: All APIs unavailable

🔧 *TROUBLESHOOTING*
━━━━━━━━━━━━━━━
1️⃣ Try again after 5 minutes
2️⃣ Use .song command
3️⃣ Check: ${video.url}

💎 *${CONFIG.BOT_NAME} SYSTEM*`);
        }

        // Update download message
        await conn.sendMessage(from, {
            delete: downloadMsg.key
        });

        const processingMsg = await reply(`✅ *SOURCE FOUND*
━━━━━━━━━━━━━━━
🎵 Title: *${video.title}*
🔧 API: ${result.api}
📊 Status: Processing audio...
⏳ Please wait`);

        // ────────────────────────────────────────────
        // 🎧 SENDING AUDIO
        // ────────────────────────────────────────────
        try {
            await conn.sendMessage(from, {
                audio: { 
                    url: result.url,
                    ptt: false
                },
                mimetype: 'audio/mpeg',
                fileName: `${video.title.substring(0, 60).replace(/[^\w\s]/gi, '')}.mp3`,
                ptt: false,
                contextInfo: {
                    mentionedJid: [sender],
                    externalAdReply: {
                        title: `🎵 ${video.title.substring(0, 40)}`,
                        body: `Via ${CONFIG.BOT_NAME} • ${video.timestamp}`,
                        thumbnail: { url: video.thumbnail },
                        mediaType: 1,
                        mediaUrl: video.url,
                        sourceUrl: video.url
                    }
                }
            }, { quoted: mek });

            await conn.sendMessage(from, { delete: processingMsg.key });

            // ────────────────────────────────────────────
            // ✅ SUCCESS MESSAGE
            // ────────────────────────────────────────────
            await reply(`✅ *DOWNLOAD COMPLETE*
━━━━━━━━━━━━━━━
🎵 *TITLE*: ${video.title}
⏱️ *DURATION*: ${video.timestamp}
👁️ *VIEWS*: ${formatViews(video.views)}
🔧 *API USED*: ${result.api}

📥 *DOWNLOAD INFO*
━━━━━━━━━━━━━━━
📊 Status: ✓ Successful
💾 Format: MP3 Audio
🎚️ Quality: High

🎛️ *${CONFIG.BOT_NAME} SYSTEM*
━━━━━━━━━━━━━━━
🔧 Version: ${CONFIG.VERSION}
👑 Powered by: ${CONFIG.AUTHOR}
💎 Enjoy your music!`);

            // Success reaction
            try {
                await conn.sendMessage(from, { 
                    react: { text: "✅", key: mek.key } 
                });
            } catch (e) {}

        } catch (sendError) {
            await conn.sendMessage(from, { delete: processingMsg.key });
            
            await reply(`⚠️ *SENDING FAILED*
━━━━━━━━━━━━━━━
🎵 Title: *${video.title}*
📛 Error: Could not send audio

🔧 *ALTERNATIVES*
━━━━━━━━━━━━━━━
1️⃣ Direct link: ${result.url.substring(0, 80)}...
2️⃣ YouTube: ${video.url}
3️⃣ Try: .song ${query}

💎 *${CONFIG.BOT_NAME} SUPPORT*`);
        }

    } catch (error) {
        console.error("🎵 PLAY ERROR:", error);
        
        await reply(`🚨 *SYSTEM ERROR*
━━━━━━━━━━━━━━━
📛 Type: ${error.name || 'Unknown'}
💬 Message: ${error.message || 'No details'}

🔧 *QUICK FIX*
━━━━━━━━━━━━━━━
1️⃣ Check internet connection
2️⃣ Try simpler song name
3️⃣ Wait 2 minutes
4️⃣ Contact admin

🎛️ *${CONFIG.BOT_NAME} SYSTEM*
🔧 ${CONFIG.VERSION} | 👑 ${CONFIG.AUTHOR}`);
    }
});

// ────────────────────────────────────────────
// 🎶 BACKUP SONG COMMAND
// ────────────────────────────────────────────
cmd({
    pattern: "song",
    alias: ["mp3", "music"],
    react: "🎶",
    desc: "Alternative song download method",
    category: "media",
    use: "<song_name>",
    filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
    try {
        const query = args.join(" ").trim();
        if (!query) {
            return await reply(`🎶 *${CONFIG.BOT_NAME} BACKUP SYSTEM*
━━━━━━━━━━━━━━━
❌ Please provide song name
💡 Example: .song tere bin`);
        }

        const msg = await reply(`🔍 *BACKUP SEARCH*
━━━━━━━━━━━━━━━
🎯 Query: ${query}
⏳ Searching...`);

        const search = await yts(query);
        if (!search.videos?.length) {
            await conn.sendMessage(from, { delete: msg.key });
            return await reply(`❌ *NO SONGS FOUND*
━━━━━━━━━━━━━━━
💡 Try different keywords`);
        }

        const video = search.videos[0];
        const videoId = extractVideoId(video.url);
        
        await conn.sendMessage(from, { delete: msg.key });

        // Send thumbnail
        await conn.sendMessage(from, {
            image: { url: video.thumbnail },
            caption: `🎶 *${video.title}*
━━━━━━━━━━━━━━━
⏱️ ${video.timestamp} • 👁️ ${formatViews(video.views)}
⬇️ Downloading via backup system...`
        }, { quoted: mek });

        // Try direct API
        try {
            const apiUrl = `https://api.y2mate.guru/api/ytmp3?id=${videoId}`;
            const response = await axios.get(apiUrl, { timeout: 10000 });
            
            if (response.data?.url) {
                await conn.sendMessage(from, {
                    audio: { url: response.data.url },
                    fileName: `${video.title.substring(0, 50)}.mp3`
                }, { quoted: mek });
                
                await reply(`✅ *BACKUP DOWNLOAD*
━━━━━━━━━━━━━━━
🎵 ${video.title}
⏱️ ${video.timestamp}
🔧 Status: ✓ Complete`);
            } else {
                throw new Error("No URL");
            }
        } catch (apiError) {
            await reply(`❌ *BACKUP FAILED*
━━━━━━━━━━━━━━━
💡 Use main command: .play ${query}
🔗 Or try: ${video.url}`);
        }

    } catch (error) {
        await reply(`⚠️ *SONG COMMAND ERROR*
━━━━━━━━━━━━━━━
💡 Use: .play command instead
🔧 ${CONFIG.BOT_NAME} System`);
    }
});

// ────────────────────────────────────────────
// ℹ️ HELP SECTION
// ────────────────────────────────────────────
cmd({
    pattern: "playhelp",
    alias: ["musichelp", "songhelp"],
    react: "❓",
    desc: "Show play command help",
    category: "help",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    await reply(`🎵 *${CONFIG.BOT_NAME} MUSIC HELP*
━━━━━━━━━━━━━━━━━━━━

🎯 *AVAILABLE COMMANDS*
━━━━━━━━━━━━━━━━━━━━
🎵 .play <song_name>   - Main music download
🎶 .song <song_name>   - Backup download
❓ .playhelp           - This help menu

💡 *EXAMPLES*
━━━━━━━━━━━━━━━━━━━━
🎵 .play tere bin
🎶 .song dil diyan gallan
🎵 .play kishore kumar songs

🔧 *FEATURES*
━━━━━━━━━━━━━━━━━━━━
✓ High quality MP3
✓ Fast downloading
✓ YouTube search
✓ Thumbnail preview
✓ Multiple APIs backup

🎛️ *SYSTEM INFO*
━━━━━━━━━━━━━━━━━━━━
🔧 Version: ${CONFIG.VERSION}
👑 Author: ${CONFIG.AUTHOR}
💎 Status: Operational

⚠️ *NOTE*
━━━━━━━━━━━━━━━━━━━━
• For best results use .play command
• If one fails, try the other
• Some songs may not be available

📞 *SUPPORT*
━━━━━━━━━━━━━━━━━━━━
Contact admin for help`);
});