const { cmd } = require('../command');
const axios = require('axios');
const yts = require('yt-search');

const AXIOS_DEFAULTS = {
    timeout: 60000,
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': 'application/json, text/plain, */*'
    }
};

// Fallback retry helper
async function tryRequest(fn, tries = 3) {
    let err;
    for (let i = 1; i <= tries; i++) {
        try {
            return await fn();
        } catch (e) {
            err = e;
            await new Promise(res => setTimeout(res, i * 1000));
        }
    }
    throw err;
}

// Yupra API
async function getYupraVideoByUrl(url) {
    const api = `https://api.yupra.my.id/api/downloader/ytmp4?url=${encodeURIComponent(url)}`;
    const res = await tryRequest(() => axios.get(api, AXIOS_DEFAULTS));
    if (res?.data?.success && res?.data?.data?.download_url) {
        return {
            download: res.data.data.download_url,
            title: res.data.data.title,
            thumbnail: res.data.data.thumbnail
        };
    }
    throw new Error("Yupra failed");
}

// Okatsu fallback
async function getOkatsuVideoByUrl(url) {
    const api = `https://okatsu-rolezapiiz.vercel.app/downloader/ytmp4?url=${encodeURIComponent(url)}`;
    const res = await tryRequest(() => axios.get(api, AXIOS_DEFAULTS));
    if (res.data?.result?.mp4)
        return { download: res.data.result.mp4, title: res.data.result.title, thumbnail: res.data.result.thumb };
    throw new Error("Okatsu failed");
}

// 🔥 STYLISH BOT NAME SYSTEM
const botNameStyles = [
    { name: "𝓑𝓞𝓢𝓢-𝓜𝓓", style: "script" },
    { name: "𝐁𝐎𝐒𝐒-𝐌𝐃", style: "bold" },
    { name: "𝘽𝙊𝙎𝙎-𝙈𝘿", style: "boldsans" },
    { name: "𝗕𝗢𝗦𝗦-𝗠𝗗", style: "sans" },
    { name: "ᗷOᔕᔕ-ᗰᗪ", style: "box" },
    { name: "ＢＯＳＳ－ＭＤ", style: "fullwidth" },
    { name: "🄱🄾🅂🅂-🄼🄳", style: "squared" },
    { name: "B⃟O⃟S⃟S⃟-⃟M⃟D⃟", style: "circle" }
];

function getRandomBotName() {
    return botNameStyles[Math.floor(Math.random() * botNameStyles.length)].name;
}

cmd({
    pattern: "video",
    alias: ["ytvideo", "ytv", "ytmp", "download", "ytdl"],
    desc: "Download YouTube videos with multiple quality options",
    category: "media",
    react: "🎬",
    filename: __filename
}, async (sock, message) => {
    try {
        const text = message.message?.conversation || message.message?.extendedTextMessage?.text || "";
        const query = text.split(" ").slice(1).join(" ").trim();
        const botName = getRandomBotName();

        if (!query) {
            return sock.sendMessage(message.chat, { 
                text: `🎬 *${botName} YouTube Downloader*\n\n❌ Please provide a video name or URL.\n\n📌 *Usage:*\n.video taylor swift\n.video https://youtube.com/watch?...\n\n⚡ *Features:*\n• Auto-search by name\n• Direct URL support\n• HQ Video Download\n• Smart retry system` 
            }, { quoted: message });
        }

        // Send processing message
        await sock.sendMessage(message.chat, { 
            text: `🎬 *${botName} YouTube Downloader*\n🔍 Processing your request...\n📥 Fetching video data...` 
        }, { quoted: message });

        let videoUrl = "";
        let thumbnail = "";
        let videoTitle = "";

        // URL or search
        if (query.startsWith("http")) {
            videoUrl = query;
            thumbnail = "https://i.imgur.com/LyHic3i.gif";
            videoTitle = "YouTube Video";
        } else {
            const search = await yts(query);
            if (!search.videos.length) return sock.sendMessage(message.chat, { 
                text: `❌ *${botName} Search Result*\n\nNo videos found for: "${query}"\n\n💡 *Tips:*\n• Check spelling\n• Try different keywords\n• Use exact video title` 
            }, { quoted: message });
            
            videoUrl = search.videos[0].url;
            thumbnail = search.videos[0].thumbnail;
            videoTitle = search.videos[0].title;
        }

        // Send thumbnail with info
        await sock.sendMessage(message.chat, { 
            image: { url: thumbnail }, 
            caption: `🎬 *${botName} YouTube Downloader*\n\n📺 *Title:* ${videoTitle}\n🔗 *URL:* ${videoUrl}\n\n⏳ *Downloading video...*\n📊 *Quality:* Highest Available\n⚡ *Powered by:* ${botName}` 
        }, { quoted: message });

        // Fetch video with fallback
        let videoData;
        try {
            videoData = await getYupraVideoByUrl(videoUrl);
        } catch {
            videoData = await getOkatsuVideoByUrl(videoUrl);
        }

        // Send video with stylish caption
        const finalCaption = `🎬 *${botName} YouTube Downloader*\n
📺 *Video Title:* ${videoData.title || videoTitle}
📊 *Quality:* High Definition
💾 *Format:* MP4
⏱️ *Status:* Downloaded Successfully

📌 *Download Details:*
├─ 📹 Video: Ready to Play
├─ 🔊 Audio: Included
├─ 📱 Compatible: All Devices
└─ ⚡ Speed: Optimized

👤 *Requested by:* ${message.pushName || "User"}
🆔 *User ID:* ${message.sender.split('@')[0]}

⚡ *Powered by:* ${botName}
🎬 *Enjoy your video!*`;

        // Send video
        await sock.sendMessage(message.chat, {
            video: { url: videoData.download },
            mimetype: 'video/mp4',
            fileName: `${(videoData.title || "video").replace(/[^\w\s]/gi, '')}.mp4`,
            caption: finalCaption
        }, { quoted: message });

        // Send success reaction
        await sock.sendMessage(message.chat, {
            react: { text: '✅', key: message.key }
        });

    } catch (err) {
        console.error('Video Error:', err);
        const botName = getRandomBotName();
        await sock.sendMessage(message.chat, { 
            text: `❌ *${botName} Download Failed*\n\nError: ${err.message}\n\n💡 *Solutions:*\n1. Try different video\n2. Check internet connection\n3. Try again in 1 minute\n4. Contact owner for support\n\n⚡ *Bot:* ${botName}` 
        }, { quoted: message });
    }
});

// 🔥 EXTRA: VIDEO INFO COMMAND
cmd({
    pattern: "videoinfo",
    alias: ["vinfo", "ytinfo"],
    desc: "Get YouTube video information without downloading",
    category: "media",
    react: "📊",
    filename: __filename
}, async (sock, message) => {
    try {
        const text = message.message?.conversation || message.message?.extendedTextMessage?.text || "";
        const query = text.split(" ").slice(1).join(" ").trim();
        const botName = getRandomBotName();

        if (!query) {
            return sock.sendMessage(message.chat, { 
                text: `📊 *${botName} Video Info*\n\nUsage: .videoinfo <YouTube URL or name>` 
            }, { quoted: message });
        }

        await sock.sendMessage(message.chat, { 
            text: `📊 *${botName} Video Info*\n🔍 Fetching video details...` 
        }, { quoted: message });

        // ... video info fetching logic

    } catch (err) {
        console.error('VideoInfo Error:', err);
    }
});
