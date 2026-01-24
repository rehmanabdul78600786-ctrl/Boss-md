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
    
    start: async (Miku, m, { text, prefix, args }) => {
        try {
            if (!text) {
                return Miku.sendMessage(m.from, {
                    text: "❌ *Please provide a song name!*\n\n*Example:*\n.song shape of you\n.song diljit dosanjh"
                }, { quoted: m });
            }

            // Searching message
            await Miku.sendMessage(m.from, {
                text: `🔍 *Searching:* "${text}"\n⏳ *Please wait...*`
            }, { quoted: m });

            let audioUrl = null;
            let songInfo = null;
            let apiUsed = "";

            // ====== TRY API 1: Fast and Simple ======
            try {
                console.log("Trying API 1...");
                const api1 = await axios.get(`https://api.dhamzxploit.my.id/api/ytplay?query=${encodeURIComponent(text)}`, { timeout: 10000 });
                if (api1.data && api1.data.result && api1.data.result.url) {
                    audioUrl = api1.data.result.url;
                    songInfo = api1.data.result;
                    apiUsed = "API 1";
                    console.log("API 1 Success");
                }
            } catch (e) { console.log("API 1 Failed:", e.message); }

            // ====== TRY API 2: Alternative ======
            if (!audioUrl) {
                try {
                    console.log("Trying API 2...");
                    const api2 = await axios.get(`https://api.erdwpe.com/api/download/ytplay?query=${encodeURIComponent(text)}`, { timeout: 10000 });
                    if (api2.data && api2.data.result && api2.data.result.audio) {
                        audioUrl = api2.data.result.audio;
                        songInfo = api2.data.result;
                        apiUsed = "API 2";
                        console.log("API 2 Success");
                    }
                } catch (e) { console.log("API 2 Failed:", e.message); }
            }

            // ====== TRY API 3: yt-search + direct link ======
            if (!audioUrl) {
                try {
                    console.log("Trying yt-search...");
                    const search = await yts(text);
                    if (search.videos.length > 0) {
                        const video = search.videos[0];
                        songInfo = {
                            title: video.title,
                            duration: video.duration.timestamp || "N/A",
                            thumbnail: video.thumbnail
                        };
                        // Use SnapTik API for download
                        const snapRes = await axios.get(`https://snaptik.app/api/v1/get?url=${encodeURIComponent(video.url)}`);
                        if (snapRes.data && snapRes.data.data && snapRes.data.data.mp3) {
                            audioUrl = snapRes.data.data.mp3;
                            apiUsed = "yt-search";
                            console.log("yt-search Success");
                        }
                    }
                } catch (e) { console.log("yt-search Failed:", e.message); }
            }

            // ====== TRY API 4: Ultimate Fallback ======
            if (!audioUrl) {
                try {
                    console.log("Trying API 4...");
                    const api4 = await axios.get(`https://vihangayt.me/download/mp3?query=${encodeURIComponent(text)}`, { timeout: 10000 });
                    if (api4.data && api4.data.data && api4.data.data.url) {
                        audioUrl = api4.data.data.url;
                        if (!songInfo) {
                            songInfo = {
                                title: text,
                                duration: "Unknown"
                            };
                        }
                        apiUsed = "API 4";
                        console.log("API 4 Success");
                    }
                } catch (e) { console.log("API 4 Failed:", e.message); }
            }

            // If still no audio URL
            if (!audioUrl) {
                return Miku.sendMessage(m.from, {
                    text: `❌ *All APIs are down!*\n\nPlease try:\n1. Use different keywords\n2. Try again in 5 minutes\n3. Check your internet connection`
                }, { quoted: m });
            }

            // Downloading message
            await Miku.sendMessage(m.from, {
                text: `✅ *Found:* ${songInfo.title || text}\n⬇️ *Downloading audio...*\n🔧 *Using:* ${apiUsed}`
            }, { quoted: m });

            // Download audio
            const audioResponse = await axios({
                method: 'GET',
                url: audioUrl,
                responseType: 'arraybuffer',
                timeout: 60000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Accept': 'audio/mpeg,audio/*',
                    'Referer': 'https://www.youtube.com/'
                }
            });

            const audioBuffer = Buffer.from(audioResponse.data);
            const fileSize = (audioBuffer.length / (1024 * 1024)).toFixed(2);

            // Check WhatsApp limit
            if (audioBuffer.length > 16 * 1024 * 1024) {
                return Miku.sendMessage(m.from, {
                    text: `❌ *File too large!*\n📦 Size: ${fileSize}MB\n⚡ WhatsApp limit: 16MB`
                }, { quoted: m });
            }

            // Send audio
            await Miku.sendMessage(m.from, {
                audio: audioBuffer,
                mimetype: 'audio/mpeg',
                fileName: `${(songInfo.title || 'song').substring(0, 50).replace(/[^\w\s]/gi, '')}.mp3`,
                caption: `🎵 *${songInfo.title || text}*\n⏱️ ${songInfo.duration || 'Unknown'}\n📦 ${fileSize}MB\n\n✅ *Downloaded via BOSS-MD*\n🔧 ${apiUsed}`
            }, { quoted: m });

        } catch (error) {
            console.error("Song Error:", error);
            
            let errorMsg = "❌ *Error!*\n";
            
            if (error.code === 'ENOTFOUND' || error.code === 'EAI_AGAIN') {
                errorMsg += "🌐 *Network/DNS Error!*\nCheck your internet or try later.";
            } else if (error.message.includes('timeout')) {
                errorMsg += "⏰ *Timeout!* Try again.";
            } else {
                errorMsg += `⚠️ ${error.message}`;
            }
            
            await Miku.sendMessage(m.from, {
                text: errorMsg
            }, { quoted: m });
        }
    }
};
