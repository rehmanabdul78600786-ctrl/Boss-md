const config = require('../config');
const { cmd } = require('../command');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const stream = require('stream');
const pipeline = promisify(stream.pipeline);

cmd({
    pattern: "song",
    alias: ["play", "mp3", "audio"],
    react: "💽",
    desc: "Download YouTube song using PrivateZia API",
    category: "main",
    use: '.song <song name>',
    filename: __filename
}, async (conn, mek, m, { from, reply, q }) => {
    try {
        if (!q) return reply("❌ *Please provide a song name.*");

        const processingMsg = await reply(`┌─⭓ *𝘽𝙊𝙎𝙎-𝙈𝘿* ⭓\n│\n│ 🔍 *Searching for your audio...*\n│ 📝 *Query:* ${q}\n└─────────────`);

        // API Request
        const apiUrl = `https://api.privatezia.biz.id/api/downloader/ytplaymp3?query=${encodeURIComponent(q)}`;
        const res = await axios.get(apiUrl, {
            timeout: 30000,
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
        });

        if (!res.data || !res.data.status || !res.data.result) {
            return reply("┌─⭓ *𝘽𝙊𝙎𝙎-𝙈𝘿-𝐀𝐈* ⭓\n│\n│ ❌ *Failed to fetch song*\n│ 💡 Please try again later\n└─────────────");
        }

        const { title, thumbnail, duration, downloadUrl, quality, videoUrl } = res.data.result;

        // Update processing message
        await conn.sendMessage(from, { 
            text: `┌─⭓ *𝘽𝙊𝙎𝙎-𝙈𝘿* ⭓\n│\n│ ✅ *Song Found!*\n│ 🎵 *Title:* ${title}\n│ ⏱️ *Duration:* ${duration}s\n│ 🎚️ *Quality:* ${quality.toUpperCase()}\n│ 📥 *Downloading audio...*\n└─────────────` 
        }, { quoted: mek });

        // Temporary file path
        const tempDir = path.join(__dirname, 'temp');
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

        const tempFile = path.join(tempDir, `song_${Date.now()}.mp3`);

        // Download audio
        const audioResponse = await axios({
            method: 'GET',
            url: downloadUrl,
            responseType: 'stream',
            timeout: 120000,
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
        });

        await pipeline(audioResponse.data, fs.createWriteStream(tempFile));

        const audioBuffer = fs.readFileSync(tempFile);

        // Send audio with stylish caption
        await conn.sendMessage(from, {
            audio: audioBuffer,
            mimetype: 'audio/mpeg',
            fileName: `${title.replace(/[^\w\s]/gi, '')}.mp3`,
            caption: `┌─⭓ *𝘽𝙊𝙎𝙎-𝙈𝘿* ⭓\n│\n│ 🎵 *${title}*\n│ ⏱️ *Duration:* ${duration}s\n│ 🎚️ *Quality:* ${quality.toUpperCase()}\n│ 📥 *Downloaded Successfully*\n└─────────────\n\n*© 𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 BOSS MD*`,
            contextInfo: {
                externalAdReply: {
                    title: title.length > 25 ? `${title.substring(0, 22)}...` : title,
                    body: `🎶 ${quality.toUpperCase()} | Duration: ${duration}s\n𝘽𝙊𝙎𝙎-𝙈𝘿`,
                    mediaType: 1,
                    thumbnailUrl: thumbnail,
                    sourceUrl: videoUrl,
                    showAdAttribution: false,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: mek });

        // Cleanup
        try { if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile); } catch { }

    } catch (error) {
        console.error("Error:", error);
        reply(`┌─⭓ *𝘽𝙊𝙎𝙎-𝙈𝘿* ⭓\n│\n│ ❌ *Something went wrong*\n│ 💡 Please try again later\n└─────────────`);
    }
});
