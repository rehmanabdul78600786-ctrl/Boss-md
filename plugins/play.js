const { cmd } = require('../command');
const yts = require('yt-search');
const axios = require('axios');

// ✅ UPDATED & WORKING APIs (2024)
const APIS = [
    {
        name: "y2mate",
        url: "https://api.y2mate.guru/api/ytmp3?id=",
        processor: (data) => data.url
    },
    {
        name: "lolhuman",
        url: "https://api.lolhuman.xyz/api/ytaudio2?apikey=GataDios&url=",
        processor: (data) => data.result.link || data.result
    },
    {
        name: "vihangayt",
        url: "https://api.vihangayt.me/download/audio?url=",
        processor: (data) => data.data.url
    },
    {
        name: "dhamzxploit",
        url: "https://api.dhamzxploit.my.id/download/ytmp3?url=",
        processor: (data) => data.result
    },
    {
        name: "saiphai",
        url: "https://saiphai.eu.org/ytmp3?url=",
        processor: (data) => data.url || data.downloadUrl
    }
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
        console.log(`🎵 Selected: ${video.title} | URL: ${video.url}`);

        // Send info message
        const infoMsg = await reply(`🎵 *${video.title}*\n👁️ Views: ${video.views}\n⏱️ Duration: ${video.timestamp}\n\n⬇️ *Downloading audio...*`);

        // Send thumbnail
        await conn.sendMessage(from, {
            image: { url: video.thumbnail },
            caption: `🎵 *Now Playing:* ${video.title}`
        }, { quoted: mek });

        // 🎧 TRY MULTIPLE APIs (Sequential fallback)
        let audioUrl = null;
        let apiUsed = null;
        let errors = [];

        for (let api of APIS) {
            try {
                console.log(`Trying ${api.name}...`);
                
                let url = '';
                if (api.name === "y2mate") {
                    // Extract video ID for y2mate
                    const videoId = video.url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
                    if (!videoId) continue;
                    url = api.url + videoId;
                } else {
                    url = api.url + encodeURIComponent(video.url);
                }

                const response = await axios({
                    method: 'GET',
                    url: url,
                    timeout: 10000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    }
                });

                if (response.data) {
                    audioUrl = api.processor(response.data);
                    if (audioUrl && (audioUrl.includes('http') || audioUrl.includes('.mp3'))) {
                        apiUsed = api.name;
                        console.log(`✅ Success with ${api.name}: ${audioUrl.substring(0, 50)}...`);
                        break;
                    }
                }
            } catch (error) {
                errors.push(`${api.name}: ${error.message}`);
                console.log(`❌ Failed ${api.name}: ${error.message}`);
                continue;
            }
        }

        // If all APIs failed
        if (!audioUrl) {
            await conn.sendMessage(from, { delete: infoMsg.key });
            return reply(`❌ *Download failed*\n\n*Try these alternatives:*\n1. Use command: .song ${query}\n2. Try again in 30 seconds\n3. Search on YouTube: ${video.url}\n\n*Errors:*\n${errors.slice(0, 3).join('\n')}`);
        }

        // Delete info message
        await conn.sendMessage(from, { delete: infoMsg.key });

        // Send audio with better error handling
        try {
            // Send downloading status
            await reply(`⬇️ *Downloading via ${apiUsed}...*`);
            
            await conn.sendMessage(from, {
                audio: { 
                    url: audioUrl,
                    ptt: false
                },
                mimetype: 'audio/mpeg',
                fileName: `${video.title.substring(0, 100).replace(/[^\w\s]/gi, '')}.mp3`,
                contextInfo: {
                    externalAdReply: {
                        title: video.title,
                        body: `Duration: ${video.timestamp}`,
                        thumbnail: { url: video.thumbnail },
                        mediaType: 1,
                        mediaUrl: video.url,
                        sourceUrl: video.url
                    }
                }
            }, { quoted: mek });

            // Send success reaction
            await conn.sendMessage(from, { react: { text: "✅", key: m.key } });

            // Success message
            await reply(`✅ *Download Complete!*\n\n🎵 *Title:* ${video.title}\n⏱️ *Duration:* ${video.timestamp}\n👁️ *Views:* ${video.views}\n📅 *Uploaded:* ${video.ago}`);

        } catch (sendError) {
            console.error("Send error:", sendError);
            await reply(`❌ *Cannot send audio*\n\n*Direct Download Link:*\n${audioUrl}\n\n*Video Link:*\n${video.url}`);
        }

    } catch (err) {
        console.error("PLAY COMMAND ERROR:", err);
        
        // Send error reaction
        await conn.sendMessage(from, { react: { text: "❌", key: m.key } });
        
        // User friendly error
        await reply(`❌ *Error occurred*\n\n*Possible solutions:*\n1. Try: .song <song name>\n2. Check your internet\n3. Try different song\n4. Wait 1 minute\n\n*Error:* ${err.message}`);
    }
});

// 🎵 SIMPLE SONG COMMAND (Direct method)
cmd({
    pattern: "song",
    alias: ["mp3", "music", "audio"],
    react: "🎶",
    desc: "Download song (alternative method)",
    category: "download",
    use: ".song <song name>",
    filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
    try {
        const query = args.join(" ");
        if (!query) return reply("❌ *Please enter song name*");

        await reply("🔍 *Searching...*");

        const search = await yts(query);
        if (!search.videos.length) return reply("❌ *No results found*");

        const video = search.videos[0];
        
        // Use reliable y2mate API
        const videoId = video.url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
        
        if (!videoId) return reply("❌ *Invalid video URL*");

        const apiUrl = `https://api.y2mate.guru/api/ytmp3?id=${videoId}`;
        
        await reply(`⬇️ *Downloading:* ${video.title}`);
        
        const response = await axios.get(apiUrl, { timeout: 15000 });
        
        if (response.data && response.data.url) {
            await conn.sendMessage(from, {
                audio: { url: response.data.url },
                mimetype: 'audio/mpeg',
                fileName: `${video.title.substring(0, 50)}.mp3`
            }, { quoted: mek });
            
            await reply(`✅ *Downloaded:* ${video.title}\n⏱️ ${video.timestamp}`);
        } else {
            throw new Error("No download URL found");
        }
    } catch (e) {
        console.error("SONG ERROR:", e);
        await reply(`❌ *Error:* ${e.message}\n\nTry: .play <song name>`);
    }
});

// 🎵 YTDL COMMAND (Direct video link)
cmd({
    pattern: "ytd",
    alias: ["ytm3", "yt5"],
    react: "📥",
    desc: "Download from YouTube URL",
    category: "download",
    use: ".ytdl <youtube_url>",
    filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
    try {
        const url = args[0];
        if (!url || !url.includes("youtube.com") && !url.includes("youtu.be")) {
            return reply("❌ *Please provide a valid YouTube URL*");
        }

        await reply("🔗 *Processing YouTube link...*");
        
        // Extract video ID
        const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
        
        if (!videoId) return reply("❌ *Invalid YouTube URL*");

        // Get video info
        const search = await yts({ videoId });
        if (!search) return reply("❌ *Cannot fetch video info*");

        // Download using y2mate
        const apiUrl = `https://api.y2mate.guru/api/ytmp3?id=${videoId}`;
        const response = await axios.get(apiUrl, { timeout: 15000 });
        
        if (response.data && response.data.url) {
            await conn.sendMessage(from, {
                audio: { url: response.data.url },
                mimetype: 'audio/mpeg',
                fileName: `${search.title || 'audio'}.mp3`
            }, { quoted: mek });
            
            await reply(`✅ *Downloaded from YouTube*\n📹 ${search.title || 'Audio'}`);
        } else {
            await reply("❌ *Download failed. Try again later.*");
        }
    } catch (e) {
        console.error("YTDL ERROR:", e);
        await reply(`❌ *Error:* ${e.message}`);
    }
});