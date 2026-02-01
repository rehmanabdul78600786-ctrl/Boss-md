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
        if (!query) return reply("❌ Bhai song name likho");

        await conn.sendMessage(from, { react: { text: "⏳", key: m.key } });

        // 🔍 YouTube search (SOURCE OF TRUTH)
        const search = await yts(query);
        if (!search.videos || !search.videos.length) {
            return reply("❌ Koi result nahi mila");
        }

        const video = search.videos[0];

        // 🎧 MP3 API (sirf download ke liye)
        const apiUrl = `https://arslan-apis.vercel.app/download/ytmp3?url=${encodeURIComponent(video.url)}`;
        const res = await axios.get(apiUrl, { timeout: 60000 });

        if (
            !res.data ||
            !res.data.status ||
            !res.data.download ||
            !res.data.download.url
        ) {
            return reply("❌ Audio generate nahi ho saka");
        }

        const dlUrl = res.data.download.url;
        const quality = res.data.download.quality || "mp3";

        // 🎵 SEND AUDIO (yt-search metadata)
        await conn.sendMessage(from, {
            audio: { url: dlUrl },
            mimetype: "audio/mpeg",
            ptt: false,
            fileName: `${video.title}.mp3`,
            caption:
                `🎵 *${video.title}*\n` +
                `👤 Channel: ${video.author.name}\n` +
                `⏱️ Duration: ${video.timestamp}\n` +
                `🎚️ Quality: ${quality}\n\n` +
                `> © BOSS-MD`,
            contextInfo: {
                externalAdReply: {
                    title: video.title.length > 40
                        ? video.title.substring(0, 40) + "..."
                        : video.title,
                    body: "YouTube MP3",
                    thumbnailUrl: video.thumbnail,
                    sourceUrl: video.url,
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: "✅", key: m.key } });

    } catch (err) {
        console.error("PLAY ERROR:", err);
        reply("❌ Bhai error aa gaya, thori der baad try karo");
        await conn.sendMessage(from, { react: { text: "❌", key: m.key } });
    }
});