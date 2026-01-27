const { cmd } = require('../command');
const yts = require('yt-search');
const axios = require('axios');

cmd({
    pattern: "play",
    alias: ["song", "audio"],
    react: "🎵",
    desc: "YouTube search & MP3 play",
    category: "download",
    use: ".play <song name>",
    filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
    try {
        const query = args.join(" ");
        if (!query) return reply("❌ Bhai song name likho chaprio waly kam nai kro");

        await conn.sendMessage(from, { react: { text: "⏳", key: m.key } });

        // 🔍 YouTube search
        const search = await yts(query);
        if (!search.videos || !search.videos.length) {
            return reply("❌ Koi result nahi mila");
        }

        const video = search.videos[0];

        // 🎧 MP3 API (tumhari)
        const apiUrl = `https://arslan-apis.vercel.app/download/ytmp3?url=${video.url}`;
        const res = await axios.get(apiUrl, { timeout: 60000 });

        if (
            !res.data ||
            !res.data.status ||
            !res.data.result ||
            !res.data.result.download ||
            !res.data.result.download.url
        ) {
            return reply("❌ Audio generate nahi ho saka");
        }

        const dlUrl = res.data.result.download.url;
        const meta = res.data.result.metadata;
        const quality = res.data.result.download.quality || "128kbps";

        // ✅ FIX 1: Download audio to buffer first
        const audioResponse = await axios.get(dlUrl, {
            responseType: 'arraybuffer',
            timeout: 60000
        });
        
        const audioBuffer = Buffer.from(audioResponse.data);

        // ✅ FIX 2: Send as buffer instead of URL
        await conn.sendMessage(from, {
            audio: audioBuffer, // ✅ Buffer use karo, URL nahi
            mimetype: "audio/mpeg",
            ptt: false,
            fileName: `${meta.title.substring(0, 50)}.mp3`,
            caption:
                `🎵 *${meta.title}*\n` +
                `⏱️ Duration: ${video.timestamp || "Unknown"}\n` +
                `🎚️ Quality: ${quality}\n\n` +
                `> © BOSS-MD`,
            contextInfo: {
                externalAdReply: {
                    title: meta.title.length > 40
                        ? meta.title.substring(0, 40) + "..."
                        : meta.title,
                    body: "YouTube MP3",
                    thumbnailUrl: meta.thumbnail,
                    sourceUrl: video.url,
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: "✅", key: m.key } });

    } catch (err) {
        console.error("PLAY ERROR:", err);
        
        // Alternative method if first fails
        try {
            const video = await yts(query);
            if (video.videos && video.videos[0]) {
                await conn.sendMessage(from, {
                    audio: { url: `https://www.youtubepp.com/watch?v=${video.videos[0].videoId}` },
                    mimetype: 'audio/mpeg',
                    fileName: 'song.mp3'
                }, { quoted: mek });
            }
        } catch (fallbackErr) {
            reply("❌ Bhai error aa gaya, thori der baad try karo");
            await conn.sendMessage(from, { react: { text: "❌", key: m.key } });
        }
    }
});
