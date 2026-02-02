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

// retry helper (unchanged)
async function tryRequest(fn, tries = 3) {
    let err;
    for (let i = 1; i <= tries; i++) {
        try {
            return await fn();
        } catch (e) {
            err = e;
            await new Promise(r => setTimeout(r, i * 1000));
        }
    }
    throw err;
}

// ✅ ONLY WORKING API (AS YOU GAVE)
async function getVideo(url) {
    const api = `https://arslan-apis.vercel.app/download/ytmp4?url=${encodeURIComponent(url)}`;
    const res = await tryRequest(() => axios.get(api, AXIOS_DEFAULTS));

    // EXACT JSON HANDLING
    if (res.data?.status === true) {

        if (res.data.result?.status === false) {
            throw new Error(res.data.result.message || "Invalid YouTube URL");
        }

        if (res.data.result?.download) {
            return {
                download: res.data.result.download,
                title: res.data.result.title || "YouTube Video",
                thumbnail: res.data.result.thumbnail || null
            };
        }
    }

    throw new Error("Download failed");
}

// bot name (same)
const botNames = [
    "𝓑𝓞𝓢𝓢-𝓜𝓓",
    "𝐁𝐎𝐒𝐒-𝐌𝐃",
    "𝗕𝗢𝗦𝗦-𝗠𝗗",
    "ᗷOᔕᔕ-ᗰᗪ"
];
const getBotName = () => botNames[Math.floor(Math.random() * botNames.length)];

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
        const botName = getBotName();

        if (!query) {
            return sock.sendMessage(message.chat, {
                text:
`🎬 *${botName}*

❌ Video name ya YouTube URL do

📌 Example:
.video bela ciao
.video https://youtube.com/watch?v=xxxx`
            }, { quoted: message });
        }

        await sock.sendMessage(message.chat, {
            text: `🎬 *${botName}*\n⏳ Processing...`
        }, { quoted: message });

        let videoUrl;
        let title = "YouTube Video";
        let thumb;

        if (query.startsWith("http")) {
            videoUrl = query;
        } else {
            const search = await yts(query);
            if (!search.videos.length) {
                return sock.sendMessage(message.chat, {
                    text: `❌ No video found`
                }, { quoted: message });
            }
            videoUrl = search.videos[0].url;
            title = search.videos[0].title;
            thumb = search.videos[0].thumbnail;
        }

        if (thumb) {
            await sock.sendMessage(message.chat, {
                image: { url: thumb },
                caption:
`🎬 *${botName}*
📺 ${title}
⏳ Downloading...`
            }, { quoted: message });
        }

        const data = await getVideo(videoUrl);

        await sock.sendMessage(message.chat, {
            video: { url: data.download },
            mimetype: "video/mp4",
            fileName: `${data.title.replace(/[^\w\s]/gi, '')}.mp4`,
            caption:
`🎬 *${botName}*

📺 ${data.title}
✅ Download Complete

👤 ${message.pushName || "User"}`
        }, { quoted: message });

        await sock.sendMessage(message.chat, {
            react: { text: "✅", key: message.key }
        });

    } catch (err) {
        await sock.sendMessage(message.chat, {
            text:
`❌ Error

⚠️ ${err.message}

✔️ Valid YouTube URL use karo`
        }, { quoted: message });
    }
});