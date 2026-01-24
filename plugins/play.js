const { cmd } = require('../command');
const yts = require('yt-search');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

cmd({
    pattern: "song",
    alias: ["play", "mp3", "audio"],
    react: "🎵",
    desc: "Download YouTube audio (Simple & Working)",
    category: "main",
    use: '.song <song name>',
    filename: __filename
}, async (conn, mek, m, { from, reply, q }) => {
    try {
        if (!q) return reply("❌ *Song name required!*\nExample: .song baby shark");

        // Step 1: Search song
        await reply("🔍 *Searching for your song...*");
        
        const searchResults = await yts(q);
        if (!searchResults.videos || searchResults.videos.length === 0) {
            return reply("❌ *No songs found!*");
        }

        const video = searchResults.videos[0];
        const title = video.title;
        const duration = video.duration.timestamp || "N/A";
        const thumbnail = video.thumbnail;
        const videoUrl = video.url;

        await reply(`✅ *Found:* ${title}\n⏱️ *Duration:* ${duration}\n📥 *Downloading...*`);

        // Step 2: Get download link from public API
        const apiUrl = `https://api.nyx.my.id/download/y2mate/mp3?url=${encodeURIComponent(videoUrl)}`;
        
        const apiResponse = await axios.get(apiUrl, { 
            timeout: 30000,
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });

        if (!apiResponse.data || !apiResponse.data.data || !apiResponse.data.data.url) {
            return reply("❌ *Download link not available*");
        }

        const downloadUrl = apiResponse.data.data.url;

        // Step 3: Download audio as buffer
        await reply("⬇️ *Downloading audio...*");
        
        const audioResponse = await axios({
            method: 'GET',
            url: downloadUrl,
            responseType: 'arraybuffer',
            timeout: 60000,
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });

        const audioBuffer = Buffer.from(audioResponse.data);
        const fileSizeMB = (audioBuffer.length / (1024 * 1024)).toFixed(2);

        // Check size limit
        if (audioBuffer.length > 16 * 1024 * 1024) {
            return reply(`❌ *File too large!* (${fileSizeMB}MB)\nWhatsApp limit: 16MB`);
        }

        // Step 4: Send audio
        await conn.sendMessage(from, {
            audio: audioBuffer,
            mimetype: 'audio/mpeg',
            fileName: `${title.substring(0, 50)}.mp3`,
            caption: `🎵 *${title}*\n⏱️ ${duration} | 📦 ${fileSizeMB}MB\n\n_Downloaded via BOSS-MD_`
        }, { quoted: mek });

        await reply("✅ *Audio sent successfully!*");

    } catch (error) {
        console.error("Song Error:", error);
        
        // User-friendly error messages
        if (error.message.includes('timeout')) {
            reply("⏰ *Timeout!* Server is slow, try again.");
        } else if (error.message.includes('Network Error')) {
            reply("🌐 *Network error!* Check your connection.");
        } else if (error.message.includes('ENOTFOUND')) {
            reply("🔗 *API not reachable!* Try later.");
        } else {
            reply(`❌ *Error:* ${error.message || "Unknown error"}`);
        }
    }
});
