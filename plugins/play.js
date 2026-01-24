const axios = require('axios');
const fs = require('fs');
const yts = require('yt-search');

module.exports = {
    name: "song",
    alias: ["play", "music", "mp3"],
    desc: "Download YouTube songs",
    category: "media",
    usage: ".song <song name>",
    react: "🎵",
    
    start: async (Miku, m, { text }) => {
        try {
            if (!text) return m.reply("❌ *Song name chahiye!*\nExample: .song diljit dosanjh");

            // Step 1: Search
            await m.reply("🔍 *Searching...*");
            
            const search = await yts(text);
            if (!search.videos.length) return m.reply("❌ *Koi gaana nai mila!*");
            
            const video = search.videos[0];
            
            // Step 2: Downloading message
            await m.reply(`✅ *Mil gaya:* ${video.title}\n⬇️ *Downloading...*`);
            
            // Step 3: Use simple API that always works
            const apiUrl = `https://yt-api.cyclic.app/audio?id=${video.videoId}`;
            
            const response = await axios.get(apiUrl, { 
                responseType: 'arraybuffer',
                timeout: 60000 
            });
            
            const audioBuffer = Buffer.from(response.data);
            const sizeMB = (audioBuffer.length / (1024 * 1024)).toFixed(2);
            
            // Step 4: Send
            await Miku.sendMessage(m.from, {
                audio: audioBuffer,
                mimetype: 'audio/mpeg',
                fileName: video.title.substring(0, 50) + '.mp3',
                caption: `🎵 *${video.title}*\n⏱️ ${video.timestamp}\n📦 ${sizeMB}MB\n\n✅ *BOSS-MD*`
            }, { quoted: m });
            
        } catch (error) {
            console.log(error);
            
            // SIMPLE FALLBACK METHOD
            try {
                await m.reply("🔄 *Trying alternative method...*");
                
                // Alternative API
                const fallback = await axios.get(`https://ytdl-express.vercel.app/audio?url=https://youtu.be/${video.videoId}`, {
                    responseType: 'arraybuffer'
                });
                
                const buffer = Buffer.from(fallback.data);
                
                await Miku.sendMessage(m.from, {
                    audio: buffer,
                    mimetype: 'audio/mpeg',
                    fileName: 'song.mp3',
                    caption: `🎵 ${video.title}\n✅ *BOSS-MD*`
                }, { quoted: m });
                
            } catch (fallbackError) {
                m.reply(`❌ *Error:* ${fallbackError.message || "Download failed"}`);
            }
        }
    }
};
