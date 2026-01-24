const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

module.exports = {
    name: "song",
    alias: ["play", "music", "mp3"],
    desc: "Download songs from YouTube",
    category: "media",
    usage: ".song <song name>",
    react: "🎵",
    
    start: async (Miku, m, { text, prefix, args }) => {
        try {
            if (!text) {
                await Miku.sendMessage(m.from, {
                    text: "❌ *Please provide a song name!*\n\n*Example:*\n.song shape of you\n.say diljit dosanjh g.o.a.t."
                }, { quoted: m });
                return;
            }

            // Step 1: Searching message
            await Miku.sendMessage(m.from, {
                text: `⏳ *Searching for:* ${text}\n🔍 *Please wait...*`
            }, { quoted: m });

            // Step 2: Use external API for reliable download
            const apiUrl = `https://api.heckerman06.repl.co/api/audio/ytplay?query=${encodeURIComponent(text)}`;
            
            const response = await axios.get(apiUrl, { 
                timeout: 30000,
                headers: {
                    'User-Agent': 'Mozilla/5.0'
                }
            });

            if (!response.data || !response.data.result) {
                throw new Error('No results found');
            }

            const songData = response.data.result;
            
            // Step 3: Downloading message
            await Miku.sendMessage(m.from, {
                text: `✅ *Found:* ${songData.title || text}\n⬇️ *Downloading audio...*\n⏱️ *Duration:* ${songData.duration || 'Unknown'}`
            }, { quoted: m });

            // Step 4: Download audio
            const audioResponse = await axios({
                method: 'GET',
                url: songData.downloadUrl || songData.audioUrl,
                responseType: 'arraybuffer',
                timeout: 120000 // 2 minutes
            });

            const audioBuffer = Buffer.from(audioResponse.data);
            const fileSize = (audioBuffer.length / (1024 * 1024)).toFixed(2);

            // Check file size
            if (audioBuffer.length > 15 * 1024 * 1024) {
                await Miku.sendMessage(m.from, {
                    text: `❌ *File too large!*\n📦 *Size:* ${fileSize}MB\n⚡ *WhatsApp limit is 16MB*`
                }, { quoted: m });
                return;
            }

            // Step 5: Send audio
            await Miku.sendMessage(m.from, {
                audio: audioBuffer,
                mimetype: 'audio/mpeg',
                fileName: `${(songData.title || 'song').replace(/[^\w\s]/gi, '_')}.mp3`,
                caption: `🎵 *${songData.title || text}*\n⏱️ ${songData.duration || 'Unknown'}\n📦 ${fileSize}MB\n\n✅ *Downloaded via BOSS-MD*`
            }, { quoted: m });

        } catch (error) {
            console.error('Song error:', error);
            
            // User-friendly error messages
            let errorMsg = "❌ *Error downloading song!*\n";
            
            if (error.message.includes('timeout')) {
                errorMsg += "⏰ *Server timeout!* Try again later.";
            } else if (error.message.includes('Network Error')) {
                errorMsg += "🌐 *Network error!* Check your connection.";
            } else if (error.message.includes('No results')) {
                errorMsg += "🔍 *No song found!* Try different keywords.";
            } else {
                errorMsg += `⚠️ ${error.message}`;
            }
            
            await Miku.sendMessage(m.from, {
                text: errorMsg
            }, { quoted: m });
        }
    }
};
