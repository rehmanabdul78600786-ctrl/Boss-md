const { cmd } = require('../command');
const axios = require('axios');
const yts = require('yt-search');

const AXIOS_DEFAULTS = {
    timeout: 60000,
    headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'application/json'
    }
};

// Retry helper
async function tryRequest(fn, tries = 3) {
    let lastErr;
    for (let i = 1; i <= tries; i++) {
        try {
            return await fn();
        } catch (e) {
            lastErr = e;
            await new Promise(r => setTimeout(r, i * 1000));
        }
    }
    throw lastErr;
}

// ✅ ARSLAN API (WORKING)
async function getVideoByArslan(url) {
    const api = `https://arslan-apis.vercel.app/download/ytmp4?url=${encodeURIComponent(url)}`;
    const res = await tryRequest(() => axios.get(api, AXIOS_DEFAULTS));

    if (
        res.data?.status === true &&
        res.data?.result &&
        res.data?.result?.status !== false &&
        res.data?.result?.download
    ) {
        return {
            download: res.data.result.download,
            title: res.data.result.title || "YouTube Video",
            thumbnail: res.data.result.thumbnail || null
        };
    }

    throw new Error(res.data?.result?.message || "Download failed");
}

// 🔥 BOT NAME STYLES (UNCHANGED)
const botNameStyles = [
    "𝓑𝓞𝓢𝓢-𝓜𝓓",
    "𝐁𝐎𝐒𝐒-𝐌𝐃",
    "𝘽𝙊𝙎𝙎-𝙈𝘿",
    "𝗕𝗢𝗦𝗦-𝗠𝗗",
    "ᗷOᔕᔕ-ᗰᗪ",
    "ＢＯＳＳ－ＭＤ",
    "🄱🄾🅂🅂-🄼🄳",
    "B⃟O⃟S⃟S⃟-⃟M⃟D⃟"
];

const getRandomBotName = () =>
    botNameStyles[Math.floor(Math.random() * botNameStyles.length)];

cmd({
    pattern: "video",
    alias: ["ytvideo", "ytv", "ytmp", "download", "ytdl"],
    desc: "Download YouTube video",
    category: "media",
    react: "🎬",
    filename: __filename
}, async (sock, message) => {
    try {
        const text =
            message.message?.conversation ||
            message.message?.extendedTextMessage?.text ||
            "";

        const query = text.split(" ").slice(1).join(" ").trim();
        const botName = getRandomBotName();

        if (!query) {
            return sock.sendMessage(message.chat, {
                text:
`🎬 *${botName} YouTube Downloader*

❌ Video name ya URL do

📌 *Usage*
.video taylor swift
.video https://youtube.com/watch?v=xxxx

⚡ Fast • HD • MP4`
            }, { quoted: message });
        }

        await sock.sendMessage(message.chat, {
            text: `🎬 *${botName}*\n🔍 Processing your request...`
        }, { quoted: message });

        let videoUrl, title, thumb;

        if (query.startsWith("http")) {
            videoUrl = query;
            title = "YouTube Video";
        } else {
            const search = await yts(query);
            if (!search.videos.length)
                return sock.sendMessage(message.chat, {
                    text: `❌ No results found for *${query}*`
                }, { quoted: message });

            const v = search.videos[0];
            videoUrl = v.url;
            title = v.title;
            thumb = v.thumbnail;
        }

        if (thumb) {
            await sock.sendMessage(message.chat, {
                image: { url: thumb },
                caption:
`🎬 *${botName} Downloader*

📺 *Title:* ${title}
🔗 ${videoUrl}

⏳ Downloading...`
            }, { quoted: message });
        }

        const video = await getVideoByArslan(videoUrl);

        const caption =
`🎬 *${botName} YouTube Video*

📺 *Title:* ${video.title}
📊 *Quality:* HD MP4
📱 *Compatible:* All devices

👤 *Requested by:* ${message.pushName || "User"}

⚡ Powered by ${botName}`;

        await sock.sendMessage(message.chat, {
            video: { url: video.download },
            mimetype: "video/mp4",
            caption,
            fileName: `${video.title.replace(/[^\w\s]/gi, '')}.mp4`
        }, { quoted: message });

        await sock.sendMessage(message.chat, {
            react: { text: "✅", key: message.key }
        });

    } catch (err) {
        const botName = getRandomBotName();
        await sock.sendMessage(message.chat, {
            text:
`❌ *${botName} Error*

⚠️ ${err.message}

💡 Try another video or valid YouTube URL`
        }, { quoted: message });
    }
});