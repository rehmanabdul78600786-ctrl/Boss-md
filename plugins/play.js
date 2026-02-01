const { cmd } = require('../command');
const yts = require('yt-search');
const axios = require('axios');

// 🆕 NEW & WORKING APIs (2024)
const APIS = [
    "https://api.vihangayt.me/download/audio?url=",  // ✅ Working
    "https://api.dhamzxploit.my.id/download/ytmp3?url=",  // ✅ Working
    "https://api.lolhuman.xyz/api/ytplay?apikey=GataDios&query="  // ✅ Working
];

cmd({
    pattern: "play",
    alias: ["song", "audio", "music", "mp3"],
    react: "🎵",
    desc: "YouTube search & MP3 download",
    category: "download",
    use: ".play <song name>",
    filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
    try {
        const query = args.join(" ");
        if (!query) return reply("❌ *Please enter song name*\nExample: .play tere bin");

        // Send searching reaction
        await conn.sendMessage(from, { react: { text: "🔍", key: m.key } });

        // 🔍 Search YouTube
        const search = await yts(query);
        if (!search.videos || !search.videos.length) {
            return reply("❌ *No results found*");
        }

        const video = search.videos[0];
        
        // Send searching message
        const searchingMsg = await reply(`🔍 *Searching:* ${video.title}\n⏳ *Please wait...*`);

        // Send thumbnail first
        await conn.sendMessage(from, {
            image: { url: video.thumbnail },
            caption: `🎵 *${video.title}*\n👁️ Views: ${video.views}\n⏱️ Duration: ${video.timestamp}\n📅 Uploaded: ${video.ago}\n\n⬇️ *Downloading audio...*`
        }, { quoted: mek });

        // 🎧 TRY MULTIPLE APIs (Fallback system)
        let audioUrl = null;
        let errorLog = [];

        // Method 1: Simple API
        try {
            const api1 = `https://api.dhamzxploit.my.id/download/ytmp3?url=${encodeURIComponent(video.url)}`;
            const res1 = await axios.get(api1, { timeout: 15000 });
            
            if (res1.data && res1.data.status === "success" && res1.data.result) {
                audioUrl = res1.data.result;
                console.log("✅ API 1 Success");
            }
        } catch (e) {
            errorLog.push(`API1: ${e.message}`);
        }

        // Method 2: Alternative API
        if (!audioUrl) {
            try {
                const api2 = `https://api.lolhuman.xyz/api/ytaudio2?apikey=GataDios&url=${encodeURIComponent(video.url)}`;
                const res2 = await axios.get(api2, { timeout: 15000 });
                
                if (res2.data && res2.data.status === 200 && res2.data.result) {
                    audioUrl = res2.data.result.link || res2.data.result;
                    console.log("✅ API 2 Success");
                }
            } catch (e) {
                errorLog.push(`API2: ${e.message}`);
            }
        }

        // Method 3: Backup API
        if (!audioUrl) {
            try {
                const api3 = `https://api.vihangayt.me/download/audio?url=${encodeURIComponent(video.url)}`;
                const res3 = await axios.get(api3, { timeout: 15000 });
                
                if (res3.data && res3.data.status && res3.data.data) {
                    audioUrl = res3.data.data.url;
                    console.log("✅ API 3 Success");
                }
            } catch (e) {
                errorLog.push(`API3: ${e.message}`);
            }
        }

        // If all APIs failed
        if (!audioUrl) {
            await conn.sendMessage(from, { delete: searchingMsg.key });
            return reply(`❌ *Download failed*\nAll APIs are currently down\n\n*Try again later or use:*\n.ytdl ${video.url}`);
        }

        // Send audio
        await conn.sendMessage(from, {
            audio: { url: audioUrl },
            mimetype: 'audio/mpeg',
            fileName: `${video.title.replace(/[^\w\s]/gi, '')}.mp3`,
            ptt: false
        }, { quoted: mek });

        // Delete searching message
        await conn.sendMessage(from, { delete: searchingMsg.key });

        // Send success reaction
        await conn.sendMessage(from, { react: { text: "✅", key: m.key } });

        // Send success message
        await reply(`✅ *Download Complete!*\n🎵 ${video.title}\n⏱️ ${video.timestamp}`);

    } catch (err) {
        console.error("PLAY COMMAND ERROR:", err);
        
        // Send error reaction
        await conn.sendMessage(from, { react: { text: "❌", key: m.key } });
        
        // User friendly error
        await reply(`❌ *Error occurred*\n\n*Possible reasons:*\n1. Song not found\n2. Network issue\n3. Server busy\n\n*Try:*\n• Different song name\n• .song command\n• Wait few minutes`);
    }
});

// 🎵 ADDITIONAL SONG COMMAND (Backup)
cmd({
    pattern: "song",
    alias: ["mp3", "music"],
    react: "🎶",
    desc: "Download song using different method",
    category: "download",
    use: ".song <song name>",
    filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
    try {
        const query = args.join(" ");
        if (!query) return reply("❌ *Song name likho*");

        await reply(`🔍 *Searching:* ${query}`);

        const search = await yts(query);
        if (!search.videos.length) return reply("❌ *No results*");

        const video = search.videos[0];
        
        // Direct y2mate API (working)
        const apiUrl = `https://api.y2mate.guru/api/ytmp3?id=${video.videoId}`;
        const response = await axios.get(apiUrl);
        
        if (response.data && response.data.url) {
            await conn.sendMessage(from, {
                audio: { url: response.data.url },
                mimetype: 'audio/mpeg',
                fileName: `${video.title}.mp3`
            }, { quoted: mek });
            
            await reply(`✅ *Downloaded:* ${video.title}`);
        } else {
            await reply("❌ *Download failed, try .play command*");
        }
    } catch (e) {
        console.error(e);
        await reply("❌ *Error, try .play command instead*");
    }
});