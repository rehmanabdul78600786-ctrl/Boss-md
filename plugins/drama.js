const { cmd } = require('../command');
const axios = require('axios');
const yts = require('yt-search');

const izumi = { baseURL: "https://izumiiiiiiii.dpdns.org" };

const AXIOS_DEFAULTS = {
    timeout: 60000,
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*'
    }
};

async function tryRequest(getter, attempts = 3) {
    let lastError;
    for (let attempt = 1; attempt <= attempts; attempt++) {
        try {
            return await getter();
        } catch (err) {
            lastError = err;
            if (attempt < attempts) await new Promise(r => setTimeout(r, 1000 * attempt));
        }
    }
    throw lastError;
}

async function getIzumiVideoByUrl(youtubeUrl) {
    const apiUrl = `${izumi.baseURL}/downloader/youtube?url=${encodeURIComponent(youtubeUrl)}&format=720`;
    const res = await tryRequest(() => axios.get(apiUrl, AXIOS_DEFAULTS));
    if (res?.data?.result?.download) return res.data.result;
    throw new Error('Izumi API returned no download link');
}

async function getOkatsuVideoByUrl(youtubeUrl) {
    const apiUrl = `https://okatsu-rolezapiiz.vercel.app/downloader/ytmp4?url=${encodeURIComponent(youtubeUrl)}`;
    const res = await tryRequest(() => axios.get(apiUrl, AXIOS_DEFAULTS));
    if (res?.data?.result?.mp4) {
        return { download: res.data.result.mp4, title: res.data.result.title };
    }
    throw new Error('Okatsu API returned no mp4');
}

cmd({
    pattern: "drama",
    alias: ["darama"],
    desc: "Download drama or YouTube video as document",
    category: "download",
    react: "🎬",
    filename: __filename
}, async (sock, message, args) => {
    try {
        const text = message.message?.conversation || message.message?.extendedTextMessage?.text;
        const query = text.split(' ').slice(1).join(' ').trim();

        if (!query) {
            await sock.sendMessage(message.chat, { 
                text: "┌─⭓ *𝘽𝙊𝙎𝙎-𝙈𝘿* ⭓\n│\n│ ⚠️ *Please provide a drama name*\n│ 💡 Example: .drama drama name\n└─────────────" 
            }, { quoted: message });
            return;
        }

        let videoUrl = "";
        let videoInfo = {};

        // Send processing message
        await sock.sendMessage(message.chat, { 
            text: `┌─⭓ *𝘽𝙊𝙎𝙎-𝙈𝘿* ⭓\n│\n│ 🔍 *Searching for video...*\n│ 📝 *Query:* ${query}\n└─────────────` 
        }, { quoted: message });

        if (query.startsWith('http://') || query.startsWith('https://')) {
            videoUrl = query;
        } else {
            const { videos } = await yts(query);
            if (!videos || videos.length === 0) {
                await sock.sendMessage(message.chat, { 
                    text: "┌─⭓ *𝘽𝙊𝙎𝙎-𝙈𝘿* ⭓\n│\n│ ❌ *No videos found!*\n│ 💡 Try different keywords\n└─────────────" 
                }, { quoted: message });
                return;
            }
            videoInfo = videos[0];
            videoUrl = videoInfo.url;
        }

        const title = videoInfo.title || "YouTube Video";
        const views = videoInfo.views ? videoInfo.views.toLocaleString() : "N/A";
        const author = videoInfo.author?.name || "Unknown";
        const duration = videoInfo.timestamp || "Unknown";
        const thumb = videoInfo.thumbnail;

        // 📸 Send info with stylish caption
        await sock.sendMessage(message.chat, {
            image: { url: thumb },
            caption: `┌─⭓ *𝘽𝙊𝙎𝙎-𝙈𝘿* ⭓\n│\n│ 🎬 *${title}*\n│ ⏱ *Duration:* ${duration}\n│ 👁 *Views:* ${views}\n│ 👤 *Channel:* ${author}\n│ 📥 *Downloading video...*\n└─────────────\n\n*© 𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 ꧁𓊈𒆜 𝑩𝒐𝒔𝒔-𝒎𝒅 𒆜𓊉꧂*`
        }, { quoted: message });

        // 🌀 Try Izumi first, fallback to Okatsu
        let videoData;
        try {
            videoData = await getIzumiVideoByUrl(videoUrl);
        } catch (e1) {
            videoData = await getOkatsuVideoByUrl(videoUrl);
        }

        // 📁 Send as document with stylish processing message
        await sock.sendMessage(message.chat, { 
            text: `┌─⭓ *𝘽𝙊𝙎𝙎-𝙈𝘿* ⭓\n│\n│ ✅ *Video Found!*\n│ 🎬 *Title:* ${videoData.title || title}\n│ 📦 *Sending as document...*\n└─────────────` 
        }, { quoted: message });

        // Send the video document
        await sock.sendMessage(message.chat, {
            document: { url: videoData.download },
            mimetype: 'video/mp4',
            fileName: `${videoData.title || title}.mp4`
        }, { quoted: message });

    } catch (error) {
        console.error('[DRAMA CMD ERROR]', error?.message || error);
        await sock.sendMessage(message.chat, { 
            text: `┌─⭓ *𝘽𝙊𝙎𝙎-𝙈𝘿* ⭓\n│\n│ ❌ *Download failed!*\n│ 💡 Error: ${error?.message || 'Unknown error'}\n└─────────────` 
        }, { quoted: message });
    }
});
