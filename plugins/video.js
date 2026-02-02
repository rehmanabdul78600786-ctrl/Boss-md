const { cmd } = require('../command');
const axios = require('axios');
const yts = require('yt-search');
const fetch = require('node-fetch');

cmd({
    pattern: "video",
    alias: ["vid", "mp4", "ytmp4"],
    desc: "Download YouTube video",
    category: "download",
    react: "🎬",
    filename: __filename
},
async (conn, mek, m) => {
    try {
        const from = m.chat;
        const q = m.text?.split(' ').slice(1).join(' ');

        if (!q) {
            return conn.sendMessage(from, {
                text: "❌ *Search With Query*\nExample:\n.video pasoori"
            }, { quoted: mek });
        }

        // 🔍 Search YouTube
        const search = await yts(q);
        if (!search.videos.length) {
            return conn.sendMessage(from, {
                text: "❌ *No video found*"
            }, { quoted: mek });
        }

        const vid = search.videos[0];

        // 🎨 Boss X MD Info
        await conn.sendMessage(from, {
            image: { url: vid.thumbnail },
            caption: `
╔ஜ۩▒█ ʙᴏꜱꜱ X ᴍᴅ █▒۩ஜ╗
┃🎬 *VIDEO FOUND*
┃📌 *Title:* ${vid.title}
┃⏱️ *Duration:* ${vid.timestamp}
┃⏳ *Processing...*
╰━━━━━━━━━━━━━━⊷
> © Powered By Boss-MD
`
        }, { quoted: mek });

        // 🎥 Fetch video URL from API
        const apiUrl = `https://arslan-apis.vercel.app/download/ytmp4?url=${encodeURIComponent(vid.url)}`;
        const res = await axios.get(apiUrl, { timeout: 60000 });

        if (!res.data?.status) {
            return conn.sendMessage(from, {
                text: "❌ *Video API failed*"
            }, { quoted: mek });
        }

        const dl = res.data.result.download;

        // ⬇️ Download video as buffer for WhatsApp
        const videoRes = await fetch(dl.url);
        const videoBuffer = await videoRes.buffer();

        // 📤 Send video
        await conn.sendMessage(from, {
            video: videoBuffer,
            mimetype: 'video/mp4',
            caption: `
╔ஜ۩▒█ ʙᴏꜱꜱ X ᴍᴅ █▒۩ஜ╗
┃🎬 *${vid.title}*
┃🎞️ *Quality:* ${dl.quality || "360p"}
┃⏱️ *Duration:* ${vid.timestamp}
╰━━━━━━━━━━━━━━⊷
> © Powered By Boss-MD
`
        }, { quoted: mek });

    } catch (e) {
        console.log("VIDEO ERROR:", e);
        conn.sendMessage(m.chat, {
            text: "❌ *Error while processing video*\nPlease try again later."
        }, { quoted: mek });
    }
});