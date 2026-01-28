const { cmd } = require('../command');
const axios = require('axios');
const yts = require('yt-search');

const AXIOS_DEFAULTS = {
    timeout: 60000,
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*'
    }
};

// NEW WORKING APIS
const VIDEO_APIS = [
    {
        name: "API 1",
        getUrl: (videoId) => `https://ytdl.raghavendraochi.workers.dev/api/youtube?url=https://www.youtube.com/watch?v=${videoId}&quality=720`
    },
    {
        name: "API 2", 
        getUrl: (videoId) => `https://youtube-video-download-info.p.rapidapi.com/dl?id=${videoId}`
    },
    {
        name: "API 3",
        getUrl: (videoId) => `https://yt-api.p.riteshw.workers.dev/dl?id=${videoId}`
    },
    {
        name: "API 4 (Arslan)",
        getUrl: (videoId, youtubeUrl) => `https://arslan-apis.vercel.app/download/ytmp4?url=${encodeURIComponent(youtubeUrl)}`
    }
];

async function getVideoDownloadUrl(youtubeUrl, videoId) {
    for (let api of VIDEO_APIS) {
        try {
            const apiUrl = api.getUrl(videoId, youtubeUrl);
            console.log(`Trying ${api.name}: ${apiUrl}`);

            const response = await axios.get(apiUrl, AXIOS_DEFAULTS);

            if (response.data) {

                // ✅ Arslan API format
                if (response.data.status && response.data.data?.download) {
                    return {
                        download: response.data.data.download,
                        title: response.data.data.title || "Video"
                    };
                }

                // Existing formats
                if (response.data.download && response.data.download.includes('.mp4')) {
                    return { 
                        download: response.data.download,
                        title: response.data.title || "Video"
                    };
                }

                if (response.data.result && response.data.result.download) {
                    return { 
                        download: response.data.result.download,
                        title: response.data.result.title || "Video"
                    };
                }

                if (response.data.links && response.data.links[0] && response.data.links[0].url) {
                    return { 
                        download: response.data.links[0].url,
                        title: response.data.title || "Video"
                    };
                }
            }
        } catch (error) {
            console.log(`${api.name} failed: ${error.message}`);
            continue;
        }
    }
    throw new Error('All video APIs failed');
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

        await sock.sendMessage(message.chat, { 
            text: `┌─⭓ *𝘽𝙊𝙎𝙎-𝙈𝘿* ⭓\n│\n│ 🔍 *Searching for video...*\n│ 📝 *Query:* ${query}\n└─────────────` 
        }, { quoted: message });

        if (query.startsWith('http://') || query.startsWith('https://')) {
            videoUrl = query;
            const urlMatch = query.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
            videoInfo.videoId = urlMatch ? urlMatch[1] : null;
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

        if (!videoInfo.videoId) {
            await sock.sendMessage(message.chat, { 
                text: "┌─⭓ *𝘽𝙊𝙎𝙎-𝙈𝘿* ⭓\n│\n│ ❌ *Invalid YouTube URL*\n│ 💡 Provide valid YouTube link\n└─────────────" 
            }, { quoted: message });
            return;
        }

        const title = videoInfo.title || "YouTube Video";
        const views = videoInfo.views ? videoInfo.views.toLocaleString() : "N/A";
        const author = videoInfo.author?.name || "Unknown";
        const duration = videoInfo.timestamp || "Unknown";
        const thumb = videoInfo.thumbnail;

        await sock.sendMessage(message.chat, {
            image: { url: thumb },
            caption: `┌─⭓ *𝘽𝙊𝙎𝙎-𝙈𝘿* ⭓\n│\n│ 🎬 *${title}*\n│ ⏱ *Duration:* ${duration}\n│ 👁 *Views:* ${views}\n│ 👤 *Channel:* ${author}\n│ 📥 *Finding download link...*\n└─────────────\n\n*© 𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 ꧁𓊈𒆜 𝑩𝒐𝒔𝒔-𝒎𝒅 𒆜𓊉꧂*`
        }, { quoted: message });

        const videoData = await getVideoDownloadUrl(videoUrl, videoInfo.videoId);

        await sock.sendMessage(message.chat, { 
            text: `┌─⭓ *𝘽𝙊𝙎𝙎-𝙈𝘿* ⭓\n│\n│ ✅ *Video Found!*\n│ 🎬 *Title:* ${videoData.title || title}\n│ 📦 *Sending as document...*\n└─────────────` 
        }, { quoted: message });

        await sock.sendMessage(message.chat, {
            document: { url: videoData.download },
            mimetype: 'video/mp4',
            fileName: `${(videoData.title || title).substring(0, 100)}.mp4`
        }, { quoted: message });

    } catch (error) {
        console.error('[DRAMA CMD ERROR]', error);
        await sock.sendMessage(message.chat, { 
            text: `┌─⭓ *𝘽𝙊𝙎𝙎-𝙈𝘿* ⭓\n│\n│ ❌ *Download failed!*\n│ 💡 Error: ${error?.message || 'Unknown error'}\n└─────────────` 
        }, { quoted: message });
    }
});
