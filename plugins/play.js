const { cmd } = require('../command');
const yts = require('yt-search');
const axios = require('axios');

cmd({
    pattern: "play",
    alias: ["song", "audio"],
    react: "🎵",
    desc: "YouTube search & MP3 play",
    category: "download",
    use: ".play <song name>",
    filename: __filename
}, async (conn, mek, m, { from, reply, text, pushName }) => {
    try {
        const query = text || mek.message?.conversation?.split(' ').slice(1).join(' ') || '';
        
        if (!query) return reply("❌ Bhai song name likho chaprio waly kam nai kro");

        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

        // 🔍 YouTube search
        const search = await yts(query);
        if (!search.videos || !search.videos.length) {
            return reply("❌ Koi result nahi mila");
        }

        const video = search.videos[0];
        console.log(`🎵 Searching: ${query} | Found: ${video.title}`);

        // 🎧 MP3 API (Working API)
        const apiUrl = `https://yt-api.p.riteshw.workers.dev/dl?id=${video.videoId}&type=audio`;
        
        const res = await axios.get(apiUrl, { 
            timeout: 60000,
            headers: {
                'User-Agent': 'Mozilla/5.0'
            }
        });

        console.log('API Response:', res.data ? 'Received' : 'No data');

        // Check response
        if (!res.data || !res.data.download) {
            // Try alternative API
            const altApi = `https://api.agriyan.lol/ytaudio?url=${video.url}`;
            const altRes = await axios.get(altApi, { timeout: 60000 });
            
            if (!altRes.data?.result?.url) {
                return reply("❌ Audio generate nahi ho saka. Koi aur song try karo.");
            }
            
            const dlUrl = altRes.data.result.url;
            const audioResponse = await axios.get(dlUrl, {
                responseType: 'arraybuffer',
                timeout: 60000
            });
            
            const audioBuffer = Buffer.from(audioResponse.data);
            
            // Send audio
            await conn.sendMessage(from, {
                audio: audioBuffer,
                mimetype: "audio/mpeg",
                ptt: false,
                fileName: `${video.title.substring(0, 50)}.mp3`,
                caption: `🎵 *${video.title}*\n⏱️ ${video.timestamp || "Unknown"}\n👤 ${pushName || "User"}\n\n> © BOSS-MD`
            }, { quoted: mek });
            
        } else {
            // Original API working
            const dlUrl = res.data.download;
            const audioResponse = await axios.get(dlUrl, {
                responseType: 'arraybuffer',
                timeout: 60000
            });
            
            const audioBuffer = Buffer.from(audioResponse.data);
            
            // Send audio
            await conn.sendMessage(from, {
                audio: audioBuffer,
                mimetype: "audio/mpeg",
                ptt: false,
                fileName: `${video.title.substring(0, 50)}.mp3`,
                caption: `🎵 *${video.title}*\n⏱️ ${video.timestamp || "Unknown"}\n👤 ${pushName || "User"}\n\n> © BOSS-MD`
            }, { quoted: mek });
        }

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (err) {
        console.error("PLAY ERROR:", err);
        
        // Simple fallback
        try {
            const video = await yts(text || 'shape of you');
            if (video.videos && video.videos[0]) {
                await reply("🔄 Alternative method se bhej raha hoon...");
                
                await conn.sendMessage(from, {
                    audio: { url: `https://www.yt-download.org/api/button/mp3/${video.videos[0].videoId}` },
                    mimetype: 'audio/mpeg',
                    fileName: 'song.mp3',
                    caption: `🎵 ${video.videos[0].title}\n⏱️ ${video.videos[0].timestamp}\n\n> © BOSS-MD`
                }, { quoted: mek });
            }
        } catch (fallbackErr) {
            reply("❌ Bhai error aa gaya, thori der baad try karo\nError: " + err.message);
        }
    }
});
