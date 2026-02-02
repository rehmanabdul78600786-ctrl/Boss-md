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
            return reply("❌ *Search With Query*\nExample: .video pasoori");
        }

        // Search
        const search = await yts(query);
        if (!search.videos || !search.videos.length) {
            return reply("❌ *No video found*");
        }

        const vid = search.videos[0];

        // Send loading reaction
        await conn.sendMessage(from, {
            react: { text: "⏳", key: mek.key }
        });

        // Try different APIs
        let videoUrl = null;
        let quality = "360p";

        // Try first API
        try {
            const apiUrl = `https://arslan-apis.vercel.app/download/ytmp4?url=${encodeURIComponent(vid.url)}`;
            const res = await axios.get(apiUrl, { timeout: 30000 });
            
            if (res.data && res.data.status && res.data.result && res.data.result.download && res.data.result.download.url) {
                videoUrl = res.data.result.download.url;
                quality = res.data.result.download.quality || "360p";
            }
        } catch (e) {
            console.log("API 1 failed:", e.message);
        }

        // Try backup API
        if (!videoUrl) {
            try {
                const videoId = vid.url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
                if (videoId) {
                    const backupApi = `https://api.y2mate.guru/api/ytmp4?id=${videoId}`;
                    const res2 = await axios.get(backupApi, { timeout: 30000 });
                    if (res2.data && res2.data.url) {
                        videoUrl = res2.data.url;
                        quality = "720p";
                    }
                }
            } catch (e) {
                console.log("API 2 failed:", e.message);
            }
        }

        if (!videoUrl) {
            return reply("❌ *Download failed*\nTry again later.");
        }

        // Send video with detailed caption in your style
        await conn.sendMessage(from, {
            video: { url: videoUrl },
            mimetype: "video/mp4",
            caption: `
╔═══════════════════════════╗
║       🎬 BOSS-MD VIDEO      ║
╚═══════════════════════════╝

📌 *Title:* ${vid.title}
👤 *Channel:* ${vid.author.name}
⏱️ *Duration:* ${vid.timestamp}
🎞️ *Quality:* ${quality}
👁️ *Views:* ${vid.views}
📅 *Uploaded:* ${vid.ago}
🔗 *URL:* ${vid.url}

💡 *Download Info:*
📥 Status: ✅ Successful
⚡ Speed: High Speed
🔧 Method: YouTube API

🎛️ *BOSS-MD System:*
🔧 Version: v3.5
👑 Developer: BOSS Team
🚀 Powered by BOSS-MD
`
        }, { quoted: mek });

        // Success reaction
        await conn.sendMessage(from, {
            react: { text: "✅", key: mek.key }
        });

    } catch (err) {
        console.error("VIDEO ERROR:", err);
        await conn.sendMessage(from, {
            react: { text: "❌", key: mek.key }
        });
        reply("❌ *Video processing error*\nPlease try again later.");
    }
});