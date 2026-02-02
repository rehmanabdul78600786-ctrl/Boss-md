const { cmd } = require('../command');
const axios = require('axios');
const yts = require('yt-search');
const { fakevCard } = require('../lib/fakevCard');

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
            return reply("❌ *Search With Query Kash Bhai ap Kuch or pr laty*\nExample:\n.video pasoori");
        }

        // 🔍 Search
        const search = await yts(query);
        if (!search.videos || !search.videos.length) {
            return reply("❌ *No video found*");
        }

        const vid = search.videos[0];

        // 🎨 YOUR STYLE MESSAGE
        const caption = `
╔═══════════════════════════╗
║       🎬 BOSS-MD VIDEO      ║
╚═══════════════════════════╝

📌 *Title:* ${vid.title}
⏱️ *Duration:* ${vid.timestamp}
⏳ *Processing video...*
`;

        await conn.sendMessage(from, {
            image: { url: vid.thumbnail },
            caption
        }, { quoted: fakevCard });

        await conn.sendMessage(from, {
            react: { text: "⏳", key: mek.key }
        });

        // 🎥 API CALL
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

        // 📤 SEND VIDEO (DIRECT STREAM)
        await conn.sendMessage(from, {
            video: { url: dl.url },
            mimetype: "video/mp4",
            caption: `
╔═══════════════════════════╗
║     🎬 BOSS-MD VIDEO       ║
╚═══════════════════════════╝

🎬 *${meta.title || vid.title}*
🎞️ *Quality:* ${dl.quality || "360p"}
⏱️ *Duration:* ${meta.duration || vid.timestamp}

⚡ *Powered by BOSS-MD*
`
        }, { quoted: fakevCard });

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