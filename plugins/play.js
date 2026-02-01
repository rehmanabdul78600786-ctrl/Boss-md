const { cmd } = require('../command');
const yts = require('yt-search');
const axios = require('axios');

cmd({
    pattern: "play",
    alias: ["song", "audio"],
    desc: "Download song from YouTube",
    category: "download",
    filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
    try {
        let query = args.join(" ");
        if (!query) return reply("Song ka naam likho bhai!");

        // Searching message
        let msg = await reply("Searching song...");

        // YouTube search
        let search = await yts(query);
        let video = search.videos[0];
        if (!video) return reply("Kuch nai mila!");

        // Video info
        await reply(`*${video.title}*\n${video.timestamp} • ${video.views} views\n\nDownloading...`);

        // API try karo
        let audio = null;
        
        // API 1: Simple YouTube to MP3
        try {
            let res = await axios.get(`https://api.dhamzxploit.my.id/download/ytmp3?url=${video.url}`);
            if (res.data?.result) {
                audio = res.data.result;
            }
        } catch(e) {}
        
        // API 2: Backup
        if (!audio) {
            try {
                let res = await axios.get(`https://api.vihangayt.me/download/audio?url=${video.url}`);
                if (res.data?.data?.url) {
                    audio = res.data.data.url;
                }
            } catch(e) {}
        }
        
        // API 3: Last try
        if (!audio) {
            try {
                let videoId = video.url.split('v=')[1]?.split('&')[0];
                let res = await axios.get(`https://api.y2mate.guru/api/ytmp3?id=${videoId}`);
                if (res.data?.url) {
                    audio = res.data.url;
                }
            } catch(e) {}
        }

        if (!audio) return reply("Error! Baad mein try karo.");

        // Send audio
        await conn.sendMessage(from, {
            audio: { url: audio },
            mimetype: 'audio/mpeg',
            fileName: video.title + '.mp3'
        }, { quoted: mek });

        // Delete searching message
        if (msg.key) {
            await conn.sendMessage(from, { delete: msg.key });
        }

        reply("✅ Done!");

    } catch (error) {
        console.log(error);
        reply("Error aa gaya! Kuch aur try karo.");
    }
});

// Backup command
cmd({
    pattern: "music",
    alias: ["mp3"],
    desc: "Another method",
    category: "download",
    filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
    try {
        let query = args.join(" ");
        if (!query) return reply("Kuch to likho!");
        
        reply("Dhund raha hun...");
        
        let search = await yts(query);
        let video = search.videos[0];
        if (!video) return reply("Nai mila!");
        
        // Direct API
        let videoId = video.url.split('v=')[1]?.split('&')[0];
        let res = await axios.get(`https://cobalt2.cretin.cn/api/json?url=https://youtu.be/${videoId}`);
        
        if (res.data?.url) {
            await conn.sendMessage(from, {
                audio: { url: res.data.url },
                fileName: video.title + '.mp3'
            }, { quoted: mek });
            reply("✅ Ho gaya!");
        } else {
            reply("Nai hua download!");
        }
    } catch(e) {
        reply("Error!");
    }
});