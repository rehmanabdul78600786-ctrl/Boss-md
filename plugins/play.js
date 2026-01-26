const { cmd } = require('../command');
const yts = require('yt-search');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const stream = require('stream');
const { promisify } = require('util');
const pipeline = promisify(stream.pipeline);

cmd({
    pattern: "play",
    alias: ["song", "audio"],
    react: "🎵",
    desc: "YouTube search & MP3 download",
    category: "download",
    use: ".play <song name>",
    filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
    try {
        const query = args.join(" ");
        if (!query) return reply("❌ Bhai song name likho chaprio waly kam nai kr fareed chapri ki tra");

        await conn.sendMessage(from, { react: { text: "⏳", key: m.key } });

        // 🔍 YouTube search
        const search = await yts(query);
        if (!search.videos.length) {
            return reply("❌ Koi result nahi mila");
        }

        const video = search.videos[0];

        // 🎧 Download API (tumhari)
        const apiUrl = `https://arslan-apis.vercel.app/download/ytmp3?url=${video.url}`;
        const res = await axios.get(apiUrl, { timeout: 60000 });

        if (
            !res.data ||
            !res.data.status ||
            !res.data.result ||
            !res.data.result.download ||
            !res.data.result.download.url
        ) {
            return reply("❌ Audio download failed");
        }

        const dlUrl = res.data.result.download.url;
        const meta = res.data.result.metadata;

        // ⬇️ Download audio
        const tempDir = path.join(__dirname, 'temp');
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

        const filePath = path.join(tempDir, `play_${Date.now()}.mp3`);
        const audioStream = await axios({
            method: "GET",
            url: dlUrl,
            responseType: "stream",
            timeout: 120000
        });

        await pipeline(audioStream.data, fs.createWriteStream(filePath));
        const audioBuffer = fs.readFileSync(filePath);

        // 📤 Send audio
        await conn.sendMessage(from, {
            audio: audioBuffer,
            mimetype: "audio/mpeg",
            fileName: `${meta.title}.mp3`,
            caption: `🎵 *${meta.title}*\n🎚️ Quality: ${res.data.result.download.quality}\n\n> © Arslan-MD`,
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

        // 🧹 Cleanup
        fs.unlinkSync(filePath);

        await conn.sendMessage(from, { react: { text: "✅", key: m.key } });

    } catch (err) {
        console.error("PLAY CMD ERROR:", err);
        reply("❌ Error aa gaya bhai, baad me try karo");
        await conn.sendMessage(from, { react: { text: "❌", key: m.key } });
    }
});
