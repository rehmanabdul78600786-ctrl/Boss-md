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
}, async (conn, mek, m) => {
    try {
        const from = m.chat;
        const query = m.text?.split(' ').slice(1).join(' ');

        if (!query) {
            return conn.sendMessage(from, { text: "❌ *Search With Query*\nExample:\n.video pasoori" }, { quoted: mek });
        }

        // 🔍 Search YouTube
        const search = await yts(query);
        if (!search.videos.length) {
            return conn.sendMessage(from, { text: "❌ *No video found*" }, { quoted: mek });
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
┃⏳ *Fetching Video...*
╰━━━━━━━━━━━━━━⊷
> © Powered By Boss-MD
`
        }, { quoted: mek });

        // 🔹 Fetch Video via API
        const apiUrl = `https://arslan-apis.vercel.app/download/ytmp4?url=${encodeURIComponent(vid.url)}`;
        const res = await axios.get(apiUrl, { timeout: 60000 });

        if (!res.data?.status || !res.data.result?.download?.url) {
            return conn.sendMessage(from, { text: "❌ *Video API failed*" }, { quoted: mek });
        }

        const videoUrl = res.data.result.download.url;

        try {
            // Try sending as WhatsApp video
            await conn.sendMessage(from, {
                video: { url: videoUrl },
                mimetype: 'video/mp4',
                caption: `
╔ஜ۩▒█ ʙᴏꜱꜱ X ᴍᴅ █▒۩ஜ╗
┃🎬 *${vid.title}*
┃🎞️ *Quality:* ${res.data.result.download.quality || "360p"}
┃⏱️ *Duration:* ${vid.timestamp}
╰━━━━━━━━━━━━━━⊷
> © Powered By Boss-MD
`
            }, { quoted: mek });

        } catch (err) {
            // ⬅️ Fallback: Send as document if video fails
            await conn.sendMessage(from, {
                document: { url: videoUrl },
                mimetype: 'video/mp4',
                fileName: `${vid.title}.mp4`,
                caption: `
╔ஜ۩▒█ ʙᴏꜱꜱ X ᴍᴅ █▒۩ஜ╗
┃🎬 *${vid.title}*
┃📄 *Sent as document (WhatsApp video failed)*
╰━━━━━━━━━━━━━━⊷
> © Powered By Boss-MD
`
            }, { quoted: mek });
        }

    } catch (e) {
        console.error("VIDEO ERROR:", e);
        conn.sendMessage(m.chat, { text: "❌ *Error while processing video*\nPlease try again later." }, { quoted: mek });
    }
});