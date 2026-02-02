const { cmd } = require('../command');
const axios = require('axios');
const yts = require('yt-search');

cmd({
    pattern: "video",
    alias: ["vid", "mp4", "ytmp4"],
    desc: "Download YouTube video",
    category: "download",
    react: "🎬",
    filename: __filename
}, async (conn, mek, m, { from, reply, text, args, q }) => {
    try {
        const query = q || args.join(" ");
        if (!query) {
            return reply("❌ *Search With Query*\nExample:\n.video pasoori");
        }

        // 🔍 Search
        const search = await yts(query);
        if (!search.videos || !search.videos.length) {
            return reply("❌ *No video found*");
        }

        const vid = search.videos[0];

        // Thumbnail message (without quoted)
        await conn.sendMessage(from, {
            image: { url: vid.thumbnail },
            caption: `🎬 *${vid.title}*\n⏱️ ${vid.timestamp}\n⬇️ Downloading video...`
        });

        await conn.sendMessage(from, {
            react: { text: "⏳", key: mek.key }
        });

        // API call
        const apiUrl = `https://arslan-apis.vercel.app/download/ytmp4?url=${encodeURIComponent(vid.url)}`;
        const res = await axios.get(apiUrl, { timeout: 60000 });

        if (
            !res.data ||
            !res.data.status ||
            !res.data.result ||
            !res.data.result.download ||
            !res.data.result.download.url
        ) {
            return reply("❌ *Video API failed*");
        }

        const dl = res.data.result.download;
        const meta = res.data.result.metadata || {};

        // Send video (with quoted mek)
        await conn.sendMessage(from, {
            video: { url: dl.url },
            mimetype: "video/mp4",
            caption: `🎬 *${meta.title || vid.title}*\n🎞️ ${dl.quality || "360p"} | ⏱️ ${meta.duration || vid.timestamp}\n⚡ BOSS-MD`
        }, { quoted: mek });

        await conn.sendMessage(from, {
            react: { text: "✅", key: mek.key }
        });

    } catch (err) {
        console.error("VIDEO ERROR:", err);
        reply("❌ *Video processing error*\nPlease try again later.");
        await conn.sendMessage(from, {
            react: { text: "❌", key: mek.key }
        });
    }
});