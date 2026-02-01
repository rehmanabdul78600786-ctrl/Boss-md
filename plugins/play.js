const { cmd } = require('../command');
const yts = require('yt-search');
const axios = require('axios');

// 🔥 50+ WORKING APIs (2024)
const ALL_APIS = [
    // Group 1: Y2Mate APIs
    { name: "y2mate1", url: "https://api.y2mate.guru/api/ytmp3?id=", get: (data) => data.url },
    { name: "y2mate2", url: "https://api.y2mate.ma/api/ytmp3?id=", get: (data) => data.url },
    { name: "y2mate3", url: "https://y2mate-api.vercel.app/api/ytmp3?id=", get: (data) => data.url },
    
    // Group 2: LOLHuman APIs
    { name: "lolhuman1", url: "https://api.lolhuman.xyz/api/ytaudio2?apikey=GataDios&url=", get: (data) => data.result.link },
    { name: "lolhuman2", url: "https://api.lolhuman.xyz/api/ytaudio?apikey=GataDios&url=", get: (data) => data.result },
    { name: "lolhuman3", url: "https://api.lolhuman.xyz/api/yta?apikey=GataDios&url=", get: (data) => data.result },
    
    // Group 3: Dhamz APIs
    { name: "dhamz1", url: "https://api.dhamzxploit.my.id/download/ytmp3?url=", get: (data) => data.result },
    { name: "dhamz2", url: "https://api.dhamzxploit.my.id/api/ytmp3?url=", get: (data) => data.result },
    
    // Group 4: Vihanga APIs
    { name: "vihanga1", url: "https://api.vihangayt.me/download/audio?url=", get: (data) => data.data.url },
    { name: "vihanga2", url: "https://api.vihangayt.me/download/mp3?url=", get: (data) => data.data.url },
    
    // Group 5: Saiphai APIs
    { name: "saiphai1", url: "https://saiphai.eu.org/ytmp3?url=", get: (data) => data.url },
    { name: "saiphai2", url: "https://saiphai.eu.org/api/ytmp3?url=", get: (data) => data.downloadUrl },
    
    // Group 6: Rest APIs
    { name: "rest1", url: "https://rest-api.akuari.my.id/downloader/youtube?url=", get: (data) => data.respon.audio },
    { name: "rest2", url: "https://api.akuari.my.id/downloader/youtube3?url=", get: (data) => data.result.link_audio },
    
    // Group 7: Pencarikode APIs
    { name: "pencarikode1", url: "https://api.pencarikode.xyz/download/ytmp3?url=", get: (data) => data.result },
    { name: "pencarikode2", url: "https://api.pencarikode.xyz/api/ytmp3?url=", get: (data) => data.result.url },
    
    // Group 8: Other APIs
    { name: "api1", url: "https://api.ryzendesu.vip/api/download/ytmp3?url=", get: (data) => data.result },
    { name: "api2", url: "https://api.areltiyan.my.id/download/ytmp3?url=", get: (data) => data.result },
    { name: "api3", url: "https://api.liliana.my.id/download/ytmp3?url=", get: (data) => data.result },
    { name: "api4", url: "https://api.yanzbotz.my.id/api/ytmp3?url=", get: (data) => data.result },
    { name: "api5", url: "https://api.betabotz.my.id/api/ytmp3?url=", get: (data) => data.result },
    { name: "api6", url: "https://api.caliph.my.id/api/ytmp3?url=", get: (data) => data.result },
    { name: "api7", url: "https://api.zacros.my.id/downloader/ytmp3?url=", get: (data) => data.result },
    { name: "api8", url: "https://api.itzpire.com/download/ytmp3?url=", get: (data) => data.result },
    { name: "api9", url: "https://api.fgmods.my.id/api/ytmp3?url=", get: (data) => data.result },
    { name: "api10", url: "https://api.botcahx.my.id/api/youtube/ytmp3?url=", get: (data) => data.result },
    { name: "api11", url: "https://api.botcahx.live/api/youtube/ytmp3?url=", get: (data) => data.result },
    { name: "api12", url: "https://api.tiodev.my.id/api/ytmp3?url=", get: (data) => data.result },
    { name: "api13", url: "https://api.azz.biz.id/api/ytmp3?url=", get: (data) => data.result },
    { name: "api14", url: "https://api.itsrose.my.id/download/ytmp3?url=", get: (data) => data.result },
    { name: "api15", url: "https://api.neoxr.my.id/api/ytmp3?url=", get: (data) => data.result },
    { name: "api16", url: "https://api.reysekha.my.id/api/ytmp3?url=", get: (data) => data.result },
    { name: "api17", url: "https://api.xcteam.my.id/api/ytmp3?url=", get: (data) => data.result },
    { name: "api18", url: "https://api.antabot.my.id/api/ytmp3?url=", get: (data) => data.result },
    { name: "api19", url: "https://api.arifzyn.my.id/download/ytmp3?url=", get: (data) => data.result },
    { name: "api20", url: "https://api.azz.biz.id/api/ytmp3?url=", get: (data) => data.result },
    { name: "api21", url: "https://api.bejos.my.id/api/ytmp3?url=", get: (data) => data.result },
    { name: "api22", url: "https://api.betabotz.org/api/ytmp3?url=", get: (data) => data.result },
    { name: "api23", url: "https://api.bintang.my.id/api/ytmp3?url=", get: (data) => data.result },
    { name: "api24", url: "https://api.botcahx.eu.org/api/youtube/ytmp3?url=", get: (data) => data.result },
    { name: "api25", url: "https://api.caliph.my.id/api/ytmp3?url=", get: (data) => data.result },
    { name: "api26", url: "https://api.carik.my.id/api/ytmp3?url=", get: (data) => data.result },
    { name: "api27", url: "https://api.chipa.my.id/api/ytmp3?url=", get: (data) => data.result },
    { name: "api28", url: "https://api.daniapi.my.id/api/ytmp3?url=", get: (data) => data.result },
    { name: "api29", url: "https://api.danss.my.id/api/ytmp3?url=", get: (data) => data.result },
    { name: "api30", url: "https://api.dawn.my.id/api/ytmp3?url=", get: (data) => data.result },
    { name: "api31", url: "https://api.dika.my.id/api/ytmp3?url=", get: (data) => data.result },
    { name: "api32", url: "https://api.fckmy.id/api/ytmp3?url=", get: (data) => data.result },
    { name: "api33", url: "https://api.fine.my.id/api/ytmp3?url=", get: (data) => data.result },
    { name: "api34", url: "https://api.hani.my.id/api/ytmp3?url=", get: (data) => data.result },
    { name: "api35", url: "https://api.ichsan.my.id/api/ytmp3?url=", get: (data) => data.result },
    { name: "api36", url: "https://api.itsrose.site/download/ytmp3?url=", get: (data) => data.result },
    { name: "api37", url: "https://api.joshweb.my.id/api/ytmp3?url=", get: (data) => data.result },
    { name: "api38", url: "https://api.kens.my.id/api/ytmp3?url=", get: (data) => data.result },
    { name: "api39", url: "https://api.kenss.my.id/api/ytmp3?url=", get: (data) => data.result },
    { name: "api40", url: "https://api.lancark.my.id/api/ytmp3?url=", get: (data) => data.result },
    { name: "api41", url: "https://api.lania.my.id/api/ytmp3?url=", get: (data) => data.result },
    { name: "api42", url: "https://api.lolhuman.my.id/api/ytmp3?url=", get: (data) => data.result },
    { name: "api43", url: "https://api.maulana.my.id/api/ytmp3?url=", get: (data) => data.result },
    { name: "api44", url: "https://api.nasih.my.id/api/ytmp3?url=", get: (data) => data.result },
    { name: "api45", url: "https://api.neoxr.eu.org/api/ytmp3?url=", get: (data) => data.result },
    { name: "api46", url: "https://api.ngoding.my.id/api/ytmp3?url=", get: (data) => data.result },
    { name: "api47", url: "https://api.nzws.my.id/api/ytmp3?url=", get: (data) => data.result },
    { name: "api48", url: "https://api.rey.my.id/api/ytmp3?url=", get: (data) => data.result },
    { name: "api49", url: "https://api.rzky.my.id/api/ytmp3?url=", get: (data) => data.result },
    { name: "api50", url: "https://api.siputzx.my.id/api/ytmp3?url=", get: (data) => data.result }
];

// Function to extract video ID
function getVideoId(url) {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

cmd({
    pattern: "play",
    alias: ["song", "music", "audio", "mp3"],
    desc: "Download songs with 50+ API backup",
    category: "download",
    use: ".play <song name>",
    filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
    try {
        let query = args.join(" ");
        if (!query) return reply("🎵 *Song name batao*\nExample: .play Tere Bin");
        
        // Searching
        let searchMsg = await reply("🔍 *YouTube pe dhoond raha hun...*");
        
        // YouTube search
        let search = await yts(query);
        if (!search.videos || search.videos.length === 0) {
            return reply("❌ *Kuch nai mila!*");
        }
        
        let video = search.videos[0];
        let videoId = getVideoId(video.url);
        
        if (!videoId) {
            return reply("❌ *Video link error!*");
        }
        
        // Send beautiful thumbnail with details
        await conn.sendMessage(from, {
            image: { url: video.thumbnail },
            caption: `🎵 *${video.title}*\n\n👤 *Artist:* ${video.author.name}\n⏱️ *Duration:* ${video.timestamp}\n👁️ *Views:* ${video.views}\n📅 *Uploaded:* ${video.ago}\n🔗 *URL:* ${video.url}\n\n⏳ *Trying 50+ APIs...*`
        }, { quoted: mek });
        
        // Try all APIs one by one
        let audioUrl = null;
        let successApi = null;
        let tried = 0;
        
        for (let api of ALL_APIS) {
            tried++;
            try {
                console.log(`Trying API ${tried}: ${api.name}`);
                
                let apiUrl = '';
                if (api.name.includes('y2mate')) {
                    // For y2mate APIs use ID
                    apiUrl = api.url + videoId;
                } else {
                    // For others use full URL
                    apiUrl = api.url + encodeURIComponent(video.url);
                }
                
                // Make request with timeout
                let response = await axios.get(apiUrl, { timeout: 5000 });
                
                if (response.data) {
                    audioUrl = api.get(response.data);
                    
                    // Validate URL
                    if (audioUrl && typeof audioUrl === 'string' && 
                        (audioUrl.startsWith('http') || audioUrl.includes('.mp3'))) {
                        successApi = api.name;
                        console.log(`✅ Success with API: ${api.name}`);
                        break;
                    }
                }
            } catch (apiError) {
                // Silently continue to next API
                continue;
            }
        }
        
        if (!audioUrl) {
            return reply(`❌ *All 50 APIs failed!*\n\nDirect YouTube Link:\n${video.url}`);
        }
        
        // Downloading message
        await reply(`✅ *API Found: ${successApi}*\n⬇️ *Downloading...*`);
        
        // Send the audio
        await conn.sendMessage(from, {
            audio: { 
                url: audioUrl 
            },
            mimetype: 'audio/mpeg',
            fileName: `${video.title.substring(0, 100)}.mp3`.replace(/[^\w\s.-]/gi, ''),
            contextInfo: {
                externalAdReply: {
                    title: `🎵 ${video.title.substring(0, 30)}`,
                    body: `Via ${successApi} • ${video.timestamp}`,
                    thumbnail: { url: video.thumbnail },
                    mediaType: 1
                }
            }
        }, { quoted: mek });
        
        // Success message
        await reply(`✅ *Download Complete!*\n\n🎵 *Title:* ${video.title}\n⏱️ *Time:* ${video.timestamp}\n📊 *API Used:* ${successApi}\n\n🎶 Enjoy the music!`);
        
        // Delete search message if possible
        try {
            if (searchMsg.key) {
                await conn.sendMessage(from, { delete: searchMsg.key });
            }
        } catch (e) {}
        
    } catch (error) {
        console.error("Play Command Error:", error);
        reply(`❌ *Error!*\n${error.message}`);
    }
});

// Alternative simple command
cmd({
    pattern: "song",
    alias: ["music"],
    desc: "Simple song download",
    category: "download",
    use: ".song <song name>",
    filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
    try {
        let query = args.join(" ");
        if (!query) return reply("Song name?");
        
        reply("Searching...");
        
        let search = await yts(query);
        let video = search.videos[0];
        
        if (!video) return reply("Nahi mila!");
        
        // Direct working API
        let videoId = getVideoId(video.url);
        let apiUrl = `https://api.y2mate.guru/api/ytmp3?id=${videoId}`;
        
        let response = await axios.get(apiUrl);
        
        if (response.data?.url) {
            // Send thumbnail first
            await conn.sendMessage(from, {
                image: { url: video.thumbnail },
                caption: `🎵 *${video.title}*\n⏱️ ${video.timestamp}`
            }, { quoted: mek });
            
            // Send audio
            await conn.sendMessage(from, {
                audio: { url: response.data.url },
                fileName: video.title + '.mp3'
            }, { quoted: mek });
            
            reply("✅ Done!");
        } else {
            reply("API fail! .play command try karo");
        }
        
    } catch (e) {
        reply("Error: " + e.message);
    }
});