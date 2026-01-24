const config = require('../config');
const { cmd } = require('../command');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const stream = require('stream');
const pipeline = promisify(stream.pipeline);
const yts = require('yt-search');

cmd({
    pattern: "song",
    alias: ["play", "mp3", "audio"],
    react: "💽",
    desc: "Download YouTube song (Multiple API Fallback)",
    category: "main",
    use: '.song <song name>',
    filename: __filename
}, async (conn, mek, m, { from, reply, q }) => {
    try {
        if (!q) return reply("❌ *Please provide a song name.*");

        const processingMsg = await reply(`┌─⭓ *𝘽𝙊𝙎𝙎-𝙈𝘿* ⭓\n│\n│ 🔍 *Searching for your audio...*\n│ 📝 *Query:* ${q}\n└─────────────`);

        let songData = null;
        let downloadUrl = null;

        // ====== API 1: PrivateZia API ======
        try {
            console.log("Trying PrivateZia API...");
            const apiUrl = `https://api.privatezia.biz.id/api/downloader/ytplaymp3?query=${encodeURIComponent(q)}`;
            const res = await axios.get(apiUrl, { timeout: 15000 });
            
            if (res.data && res.data.status && res.data.result) {
                songData = res.data.result;
                downloadUrl = songData.downloadUrl;
                console.log("PrivateZia API Success");
            }
        } catch (err) {
            console.log("PrivateZia API Failed:", err.message);
        }

        // ====== API 2: LolHuman API (Fallback) ======
        if (!downloadUrl) {
            try {
                console.log("Trying LolHuman API...");
                const searchRes = await axios.get(`https://api.lolhuman.xyz/api/ytsearch?apikey=YOUR_LOLHUMAN_KEY&query=${encodeURIComponent(q)}`, { timeout: 15000 });
                if (searchRes.data && searchRes.data.result && searchRes.data.result.length > 0) {
                    const videoId = searchRes.data.result[0].videoId;
                    const audioRes = await axios.get(`https://api.lolhuman.xyz/api/ytaudio2?apikey=YOUR_LOLHUMAN_KEY&url=https://youtu.be/${videoId}`, { timeout: 15000 });
                    if (audioRes.data && audioRes.data.result && audioRes.data.result.link) {
                        songData = {
                            title: searchRes.data.result[0].title,
                            duration: searchRes.data.result[0].duration,
                            quality: "128kbps",
                            thumbnail: searchRes.data.result[0].thumbnail,
                            videoUrl: `https://youtu.be/${videoId}`
                        };
                        downloadUrl = audioRes.data.result.link;
                        console.log("LolHuman API Success");
                    }
                }
            } catch (err) {
                console.log("LolHuman API Failed:", err.message);
            }
        }

        // ====== API 3: Direct yt-search + ytdl-core (Ultimate Fallback) ======
        if (!downloadUrl) {
            try {
                console.log("Trying yt-search...");
                const searchResults = await yts(q);
                if (searchResults.videos.length > 0) {
                    const video = searchResults.videos[0];
                    songData = {
                        title: video.title,
                        duration: video.duration.seconds,
                        quality: "128kbps",
                        thumbnail: video.thumbnail,
                        videoUrl: video.url
                    };
                    // Use public converter API
                    downloadUrl = `https://api.nyx.my.id/download/y2mate/mp3?url=${encodeURIComponent(video.url)}`;
                    console.log("yt-search Success");
                }
            } catch (err) {
                console.log("yt-search Failed:", err.message);
            }
        }

        // If still no result
        if (!songData || !downloadUrl) {
            return reply(`┌─⭓ *𝘽𝙊𝙎𝙎-𝙈𝘿* ⭓\n│\n│ ❌ *No song found!*\n│ 💡 Try different keywords\n│ 🔄 APIs might be down\n└─────────────`);
        }

        const { title, thumbnail, duration, quality, videoUrl } = songData;

        // Update processing message
        await conn.sendMessage(from, { 
            text: `┌─⭓ *𝘽𝙊𝙎𝙎-𝙈𝘿* ⭓\n│\n│ ✅ *Song Found!*\n│ 🎵 *Title:* ${title}\n│ ⏱️ *Duration:* ${duration}s\n│ 🎚️ *Quality:* ${quality}\n│ 📥 *Downloading audio...*\n└─────────────` 
        }, { quoted: mek });

        // Temporary file path
        const tempDir = path.join(__dirname, 'temp');
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
        const tempFile = path.join(tempDir, `song_${Date.now()}.mp3`);

        // Download audio with retry
        let downloaded = false;
        for (let retry = 0; retry < 2; retry++) {
            try {
                const audioResponse = await axios({
                    method: 'GET',
                    url: downloadUrl,
                    responseType: 'stream',
                    timeout: 60000,
                    headers: { 
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                        'Accept': '*/*',
                        'Referer': 'https://www.youtube.com/'
                    }
                });

                await pipeline(audioResponse.data, fs.createWriteStream(tempFile));
                downloaded = true;
                break;
            } catch (dlErr) {
                console.log(`Download attempt ${retry + 1} failed:`, dlErr.message);
                if (retry === 1) throw new Error("Download failed after retries");
            }
        }

        if (!downloaded) {
            return reply(`┌─⭓ *𝘽𝙊𝙎𝙎-𝙈𝘿* ⭓\n│\n│ ❌ *Download failed!*\n│ 💡 Try again later\n└─────────────`);
        }

        const audioBuffer = fs.readFileSync(tempFile);
        const fileSize = (audioBuffer.length / (1024 * 1024)).toFixed(2);

        // Check file size limit (WhatsApp limit ~16MB)
        if (audioBuffer.length > 16 * 1024 * 1024) {
            return reply(`┌─⭓ *𝘽𝙊𝙎𝙎-𝙈𝘿* ⭓\n│\n│ ❌ *File too large!*\n│ 📦 Size: ${fileSize}MB\n│ ⚠️ Max 16MB allowed\n└─────────────`);
        }

        // Send audio
        await conn.sendMessage(from, {
            audio: audioBuffer,
            mimetype: 'audio/mpeg',
            fileName: `${title.replace(/[^\w\s]/gi, '_').substring(0, 50)}.mp3`,
            caption: `┌─⭓ *𝘽𝙊𝙎𝙎-𝙈𝘿* ⭓\n│\n│ 🎵 *${title}*\n│ ⏱️ *Duration:* ${duration}s\n│ 🎚️ *Quality:* ${quality}\n│ 📦 *Size:* ${fileSize}MB\n│ 📥 *Downloaded Successfully*\n└─────────────\n\n*© 𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 BOSS MD*`,
            contextInfo: {
                externalAdReply: {
                    title: title.length > 25 ? `${title.substring(0, 22)}...` : title,
                    body: `🎶 ${quality} | ${duration}s`,
                    mediaType: 1,
                    thumbnailUrl: thumbnail,
                    sourceUrl: videoUrl,
                    showAdAttribution: false,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: mek });

        // Cleanup
        try { 
            if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile); 
        } catch (cleanErr) { 
            console.log("Cleanup error:", cleanErr.message);
        }

    } catch (error) {
        console.error("Main Error:", error);
        reply(`┌─⭓ *𝘽𝙊𝙎𝙎-𝙈𝘿* ⭓\n│\n│ ❌ *Error: ${error.message || "Unknown"}*\n│ 💡 Try again in a minute\n└─────────────`);
    }
});
