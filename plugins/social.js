const { cmd } = require('../command');
const axios = require('axios');
const ytdl = require('ytdl-core');
const yts = require('yt-search');

cmd({
    pattern: "social",
    alias: ["dl", "download", "media"],
    desc: "All-in-one social media downloader",
    category: "download",
    react: "📥",
    filename: __filename,
    use: ".social [url] OR .social [platform] [url]"
}, async (conn, mek, m, { from, reply, text, quoted }) => {
    try {
        let url = text;
        
        // Check if replied to message
        if (quoted && quoted.message && quoted.message.extendedTextMessage?.text) {
            url = quoted.message.extendedTextMessage.text;
        }
        
        if (!url) {
            return reply(`📥 *SOCIAL MEDIA DOWNLOADER*\n\nSupported Platforms:\n\n🎵 *YouTube:*\n• .social https://youtube.com/watch?v=...\n• .social yt [video name]\n\n📱 *TikTok:*\n• .social https://tiktok.com/@user/...\n\n📘 *Facebook:*\n• .social https://facebook.com/...\n\n📷 *Instagram:*\n• .social https://instagram.com/p/...\n\n📦 *MediaFire:*\n• .social https://mediafire.com/...\n\n📌 *Example:* .social https://tiktok.com/...`);
        }
        
        await conn.sendMessage(from, { 
            text: "📥 *Processing your link...*\n\nPlease wait 10-15 seconds..." 
        }, { quoted: mek });
        
        // ==================== YOUTUBE DETECTION ====================
        if (url.includes('youtube.com') || url.includes('youtu.be') || url.startsWith('yt ') || url.startsWith('youtube ')) {
            await downloadYouTube(conn, mek, m, from, url);
        }
        
        // ==================== TIKTOK DETECTION ====================
        else if (url.includes('tiktok.com')) {
            await downloadTikTok(conn, mek, m, from, url);
        }
        
        // ==================== FACEBOOK DETECTION ====================
        else if (url.includes('facebook.com') || url.includes('fb.com') || url.includes('fb.watch')) {
            await downloadFacebook(conn, mek, m, from, url);
        }
        
        // ==================== INSTAGRAM DETECTION ====================
        else if (url.includes('instagram.com')) {
            await downloadInstagram(conn, mek, m, from, url);
        }
        
        // ==================== MEDIAFIRE DETECTION ====================
        else if (url.includes('mediafire.com')) {
            await downloadMediaFire(conn, mek, m, from, url);
        }
        
        // ==================== UNKNOWN/SEARCH YOUTUBE ====================
        else {
            // Try as YouTube search
            await downloadYouTube(conn, mek, m, from, url);
        }
        
    } catch (error) {
        console.error("Social download error:", error);
        await reply(`❌ Download failed!\n\nError: ${error.message}\n\nTry:\n1. Check if link is valid\n2. Video may be private\n3. Try different link`);
    }
});

// ==================== YOUTUBE DOWNLOADER ====================
async function downloadYouTube(conn, mek, m, from, query) {
    try {
        let videoUrl = query;
        let videoInfo = {};
        
        // If it's a search query (not URL)
        if (!query.includes('http') && !query.includes('youtube.com') && !query.includes('youtu.be')) {
            await conn.sendMessage(from, { 
                text: "🎵 *Searching YouTube...*" 
            });
            
            const search = await yts(query);
            if (!search.videos || !search.videos.length) {
                await reply("❌ No YouTube videos found!");
                return;
            }
            
            videoInfo = search.videos[0];
            videoUrl = videoInfo.url;
        } else {
            // Extract video ID from URL
            const videoId = extractYouTubeId(query);
            if (!videoId) {
                await reply("❌ Invalid YouTube URL!");
                return;
            }
            
            videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
        }
        
        await conn.sendMessage(from, { 
            text: "⬇️ *Downloading from YouTube...*" 
        });
        
        // Get video info
        const info = await ytdl.getInfo(videoUrl);
        const title = info.videoDetails.title;
        const duration = formatDuration(info.videoDetails.lengthSeconds);
        const thumb = info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1].url;
        
        // Send video info
        await conn.sendMessage(from, {
            image: { url: thumb },
            caption: `🎬 *YouTube Video*\n\n📛 ${title}\n⏱️ ${duration}\n👁️ ${info.videoDetails.viewCount || 'N/A'} views\n👤 ${info.videoDetails.author.name}\n\n⬇️ Downloading...`
        }, { quoted: mek });
        
        // Get highest quality format
        const format = ytdl.chooseFormat(info.formats, { quality: 'highest' });
        
        if (!format) {
            await reply("❌ No downloadable format found!");
            return;
        }
        
        // Check file size
        const fileSizeMB = format.contentLength ? (format.contentLength / (1024 * 1024)).toFixed(2) : "Unknown";
        
        if (fileSizeMB > 16 && fileSizeMB !== "Unknown") {
            await reply(`❌ *File too large!* (${fileSizeMB}MB)\n\nWhatsApp limit is 16MB.\nTry: .social yt [search] for smaller videos.`);
            return;
        }
        
        // Send video
        await conn.sendMessage(from, {
            video: { url: format.url },
            caption: `🎬 *${title}*\n⏱️ ${duration}\n📦 ${fileSizeMB}MB\n✅ Downloaded via BOSS-MD`,
            fileName: `${title.substring(0, 50)}.mp4`
        }, { quoted: mek });
        
        await conn.sendMessage(from, {
            react: { text: "✅", key: mek.key }
        });
        
    } catch (error) {
        console.error("YouTube error:", error);
        throw new Error(`YouTube: ${error.message}`);
    }
}

// ==================== TIKTOK DOWNLOADER ====================
async function downloadTikTok(conn, mek, m, from, url) {
    try {
        await conn.sendMessage(from, { 
            text: "📱 *Downloading TikTok...*" 
        });
        
        const apiUrl = `https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(url)}`;
        const response = await axios.get(apiUrl, { timeout: 30000 });
        
        if (!response.data?.video?.noWatermark) {
            throw new Error("No video found");
        }
        
        const videoUrl = response.data.video.noWatermark;
        const title = response.data.title || "TikTok Video";
        const author = response.data.author?.nickname || "Unknown";
        
        await conn.sendMessage(from, {
            video: { url: videoUrl },
            caption: `📱 *TIKTOK*\n\n${title}\n👤 ${author}\n✅ No watermark\n📥 Via BOSS-MD`,
            fileName: `tiktok_${Date.now()}.mp4`
        }, { quoted: mek });
        
        await conn.sendMessage(from, {
            react: { text: "✅", key: mek.key }
        });
        
    } catch (error) {
        console.error("TikTok error:", error);
        throw new Error(`TikTok: ${error.message}`);
    }
}

// ==================== FACEBOOK DOWNLOADER ====================
async function downloadFacebook(conn, mek, m, from, url) {
    try {
        await conn.sendMessage(from, { 
            text: "📘 *Downloading Facebook...*" 
        });
        
        const apiUrl = `https://api.dhamzxploit.my.id/api/fb?url=${encodeURIComponent(url)}`;
        const response = await axios.get(apiUrl, { timeout: 40000 });
        
        if (!response.data?.result?.url) {
            throw new Error("No video found");
        }
        
        const videoUrl = response.data.result.url;
        const title = response.data.result.title || "Facebook Video";
        const quality = response.data.result.quality || "HD";
        
        await conn.sendMessage(from, {
            video: { url: videoUrl },
            caption: `📘 *FACEBOOK*\n\n${title}\n🎬 ${quality}\n✅ Downloaded via BOSS-MD`,
            fileName: `fb_${Date.now()}.mp4`
        }, { quoted: mek });
        
        await conn.sendMessage(from, {
            react: { text: "✅", key: mek.key }
        });
        
    } catch (error) {
        console.error("Facebook error:", error);
        throw new Error(`Facebook: ${error.message}`);
    }
}

// ==================== INSTAGRAM DOWNLOADER ====================
async function downloadInstagram(conn, mek, m, from, url) {
    try {
        await conn.sendMessage(from, { 
            text: "📷 *Downloading Instagram...*" 
        });
        
        const apiUrl = `https://api.dhamzxploit.my.id/api/ig?url=${encodeURIComponent(url)}`;
        const response = await axios.get(apiUrl, { timeout: 30000 });
        
        if (!response.data?.result?.url) {
            throw new Error("No media found");
        }
        
        const mediaUrl = response.data.result.url;
        const type = response.data.result.type;
        const caption = response.data.result.title || "Instagram Post";
        
        if (type === 'video') {
            await conn.sendMessage(from, {
                video: { url: mediaUrl },
                caption: `📷 *INSTAGRAM*\n\n${caption.substring(0, 200)}\n✅ Downloaded via BOSS-MD`,
                fileName: `ig_${Date.now()}.mp4`
            }, { quoted: mek });
        } else {
            await conn.sendMessage(from, {
                image: { url: mediaUrl },
                caption: `📷 *INSTAGRAM*\n\n${caption.substring(0, 200)}\n✅ Downloaded via BOSS-MD`
            }, { quoted: mek });
        }
        
        await conn.sendMessage(from, {
            react: { text: "✅", key: mek.key }
        });
        
    } catch (error) {
        console.error("Instagram error:", error);
        throw new Error(`Instagram: ${error.message}`);
    }
}

// ==================== MEDIAFIRE DOWNLOADER ====================
async function downloadMediaFire(conn, mek, m, from, url) {
    try {
        await conn.sendMessage(from, { 
            text: "📦 *Processing MediaFire...*" 
        });
        
        // Extract MediaFire file ID
        const fileId = extractMediaFireId(url);
        if (!fileId) {
            throw new Error("Invalid MediaFire URL");
        }
        
        const apiUrl = `https://api.dhamzxploit.my.id/api/mediafire?url=${encodeURIComponent(url)}`;
        const response = await axios.get(apiUrl, { timeout: 30000 });
        
        if (!response.data?.result?.url) {
            throw new Error("No file found");
        }
        
        const fileUrl = response.data.result.url;
        const fileName = response.data.result.filename || `mediafire_${Date.now()}`;
        const fileSize = response.data.result.filesize || "Unknown";
        
        await conn.sendMessage(from, {
            document: { url: fileUrl },
            fileName: fileName,
            caption: `📦 *MEDIAFIRE*\n\n📁 ${fileName}\n📊 ${fileSize}\n✅ Downloaded via BOSS-MD`
        }, { quoted: mek });
        
        await conn.sendMessage(from, {
            react: { text: "✅", key: mek.key }
        });
        
    } catch (error) {
        console.error("MediaFire error:", error);
        throw new Error(`MediaFire: ${error.message}`);
    }
}

// ==================== HELPER FUNCTIONS ====================
function extractYouTubeId(url) {
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
        /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
        /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/
    ];
    
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }
    
    return null;
}

function extractMediaFireId(url) {
    const match = url.match(/mediafire\.com\/\?(.*)$|mediafire\.com\/file\/([a-z0-9]+)/i);
    return match ? (match[1] || match[2]) : null;
}

function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
}

// ==================== INDIVIDUAL COMMANDS ====================
cmd({
    pattern: "yt",
    alias: ["youtube", "video"],
    desc: "YouTube video download",
    category: "download",
    react: "🎬",
    filename: __filename,
    use: ".yt [url/search]"
}, async (conn, mek, m, { from, reply, text }) => {
    await downloadYouTube(conn, mek, m, from, text || "music");
});

cmd({
    pattern: "tt",
    alias: ["tiktok"],
    desc: "TikTok download",
    category: "download",
    react: "📱",
    filename: __filename,
    use: ".tt [url]"
}, async (conn, mek, m, { from, reply, text }) => {
    await downloadTikTok(conn, mek, m, from, text);
});

cmd({
    pattern: "fb",
    alias: ["facebook"],
    desc: "Facebook download",
    category: "download",
    react: "📘",
    filename: __filename,
    use: ".fb [url]"
}, async (conn, mek, m, { from, reply, text }) => {
    await downloadFacebook(conn, mek, m, from, text);
});

cmd({
    pattern: "ig",
    alias: ["instagram"],
    desc: "Instagram download",
    category: "download",
    react: "📷",
    filename: __filename,
    use: ".ig [url]"
}, async (conn, mek, m, { from, reply, text }) => {
    await downloadInstagram(conn, mek, m, from, text);
});

cmd({
    pattern: "mf",
    alias: ["mediafire"],
    desc: "MediaFire download",
    category: "download",
    react: "📦",
    filename: __filename,
    use: ".mf [url]"
}, async (conn, mek, m, { from, reply, text }) => {
    await downloadMediaFire(conn, mek, m, from, text);
});

console.log("📥 ALL-IN-ONE Social Downloader Loaded!");
