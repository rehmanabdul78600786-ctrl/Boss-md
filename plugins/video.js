const { cmd } = require('../command');
const { spawn } = require('child_process');
const yts = require('yt-search');
const fs = require('fs');
const path = require('path');

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

        // 🎨 Send info first
        await conn.sendMessage(from, {
            image: { url: vid.thumbnail },
            caption: `
╔ஜ۩▒█ ʙᴏꜱꜱ X ᴍᴅ █▒۩ஜ╗
┃🎬 *VIDEO FOUND*
┃📌 *Title:* ${vid.title}
┃⏱️ *Duration:* ${vid.timestamp}
┃⏳ *Downloading & Processing...*
╰━━━━━━━━━━━━━━⊷
> © Powered By Boss-MD
`
        }, { quoted: mek });

        // 🔹 Download video using yt-dlp
        const fileName = `./tmp_${Date.now()}.mp4`;
        await new Promise((resolve, reject) => {
            const ytdlp = spawn('yt-dlp', [
                '-f', 'best[ext=mp4][height<=360]', // safe 360p
                '-o', fileName,
                vid.url
            ]);

            ytdlp.stderr.on('data', data => console.log(data.toString()));
            ytdlp.on('close', code => {
                if (code === 0) resolve();
                else reject(new Error('yt-dlp failed'));
            });
        });

        // 🔹 Send video
        const videoBuffer = fs.readFileSync(fileName);
        await conn.sendMessage(from, {
            video: videoBuffer,
            mimetype: 'video/mp4',
            caption: `
╔ஜ۩▒█ ʙᴏꜱꜱ X ᴍᴅ █▒۩ஜ╗
┃🎬 *${vid.title}*
┃🎞️ *Quality:* 360p
┃⏱️ *Duration:* ${vid.timestamp}
╰━━━━━━━━━━━━━━⊷
> © Powered By Boss-MD
`
        }, { quoted: mek });

        // 🔹 Cleanup
        fs.unlinkSync(fileName);

    } catch (e) {
        console.error("VIDEO ERROR:", e);
        conn.sendMessage(m.chat, { text: "❌ *Error while processing video*\nPlease try again later." }, { quoted: mek });
    }
});