const axios = require("axios");
const { cmd } = require('../command');

// ================== PRIMARY INSTAGRAM DOWNLOADER (IGDL) ==================
cmd({
    pattern: "igdl",
    alias: ["instagram", "insta", "ig"],
    react: "📥",
    desc: "Download Instagram videos/reels (Primary)",
    category: "downloader",
    use: ".igdl <Instagram URL>",
    filename: __filename
}, async (conn, mek, m, { from, reply, args, q }) => {
    try {
        const url = q || m.quoted?.text;
        if (!url || !url.includes("instagram.com")) {
            return reply("❌ *Please provide/reply to an Instagram link*");
        }

        await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

        const apiUrl = `https://api-aswin-sparky.koyeb.app/api/downloader/igdl?url=${encodeURIComponent(url)}`;
        const response = await axios.get(apiUrl);

        if (!response.data?.status || !response.data.data?.length) {
            await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
            return reply("❌ *Failed to fetch media. Invalid link or private content.*");
        }

        for (const item of response.data.data) {
            const caption = 
`╭─────────────────⭓
│  📥 *INSTAGRAM DOWNLOADER*
├─────────────────
│  ✦ *Type:* ${item.type === 'video' ? '🎬 Video' : '📷 Image'}
│  ✦ *Downloaded by:* BOSS-MD
│  ✦ *Quality:* High
├─────────────────
│  *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʙᴏss-ᴍᴅ*
╰─────────────────⭓`;

            await conn.sendMessage(from, {
                [item.type === 'video' ? 'video' : 'image']: { url: item.url },
                caption: caption
            }, { quoted: mek });
        }

        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (error) {
        console.error('IGDL Error:', error);
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
        reply("❌ *Download failed. Try again later.*");
    }
});

// ================== SECONDARY INSTAGRAM DOWNLOADER (IGDL4) ==================
cmd({
    pattern: "igdl4",
    alias: ["instagram4", "insta4", "ig4", "igvideo4"],
    react: '📶',
    desc: "Download Instagram videos (Secondary)",
    category: "download",
    use: ".igdl4 <Instagram URL>",
    filename: __filename
}, async (conn, mek, m, { from, reply, args }) => {
    try {
        const igUrl = args[0];
        if (!igUrl || !igUrl.includes("instagram.com")) {
            return reply('❌ *Please provide a valid Instagram URL.*\n\n📌 *Example:* `.igdl4 https://instagram.com/...`');
        }

        await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

        const apiUrl = `https://bk9.fun/download/instagram?url=${encodeURIComponent(igUrl)}`;
        const response = await axios.get(apiUrl);

        if (!response.data?.status || !response.data?.BK9?.[0]?.url) {
            await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
            return reply('❌ *Unable to fetch the video. Try .igdl for primary download.*');
        }

        const videoUrl = response.data.BK9[0].url;
        await conn.sendMessage(from, { react: { text: '📶', key: m.key } });

        const videoResponse = await axios.get(videoUrl, { responseType: 'arraybuffer' });
        if (!videoResponse.data) {
            await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
            return reply('❌ *Failed to download the video. Please try again later.*');
        }

        const videoBuffer = Buffer.from(videoResponse.data, 'binary');
        
        const caption = 
`╭─────────────────⭓
│  📥 *INSTAGRAM VIDEO*
├─────────────────
│  ✦ *Status:* ✅ Downloaded
│  ✦ *Server:* BK9 API
│  ✦ *By:* BOSS-MD
├─────────────────
│  *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʙᴏss-ᴍᴅ*
╰─────────────────⭓`;

        await conn.sendMessage(from, {
            video: videoBuffer,
            caption: caption
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });
        
    } catch (error) {
        console.error('Error downloading video:', error);
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
        reply('❌ *API 2 failed. Try .igdl for primary download.*');
    }
});

// ================== TERTIARY INSTAGRAM DOWNLOADER (IGDL2) ==================
cmd({
    pattern: "igdl2",
    alias: ["instagram2", "ig2", "instadl2"],
    react: '⬇️',
    desc: "Download Instagram videos (Tertiary)",
    category: "download",
    use: ".igdl2 <Instagram video URL>",
    filename: __filename
}, async (conn, mek, m, { from, reply, args }) => {
    try {
        const igUrl = args[0];
        if (!igUrl || !igUrl.includes("instagram.com")) {
            return reply('❌ *Please provide a valid Instagram video URL.*\n\n📌 *Example:*\n.igdl2 https://instagram.com/reel/...');
        }

        await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

        const apiUrl = `https://jawad-tech.vercel.app/downloader?url=${encodeURIComponent(igUrl)}`;
        const response = await axios.get(apiUrl);
        const data = response.data;

        if (!data.status || !data.result || !Array.isArray(data.result)) {
            return reply('❌ *Unable to fetch the video. Please check the URL and try again.*');
        }

        const videoUrl = data.result[0];
        if (!videoUrl) return reply("❌ *No video found in the response.*");

        const metadata = data.metadata || {};
        const author = metadata.author || "Unknown";
        const captionText = metadata.caption ? metadata.caption.slice(0, 300) + "..." : "No caption provided.";
        const likes = metadata.like || 0;
        const comments = metadata.comment || 0;

        await reply('📤 *ᴜᴘʟᴏᴀᴅɪɴɢ ʏᴏᴜʀ ᴠɪᴅᴇᴏ ᴡᴀɪᴛ...*');

        const caption = 
`╭─────────────────⭓
│  📥 *INSTAGRAM REEL*
├─────────────────
│  👤 *Author:* ${author}
│  💬 *Caption:* ${captionText}
│  ❤️ *Likes:* ${likes} | 💭 *Comments:* ${comments}
│  ⚡ *Downloaded by:* BOSS-MD
├─────────────────
│  *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʙᴏss-ᴍᴅ*
╰─────────────────⭓`;

        await conn.sendMessage(from, {
            video: { url: videoUrl },
            caption: caption
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });
        
    } catch (error) {
        console.error('IGDL5 Error:', error);
        reply('❌ *Failed to download the Instagram video. Please try again later.*');
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
    }
});

// ================== QUATERNARY INSTAGRAM DOWNLOADER (IG3) ==================
cmd({
    pattern: "ig3",
    alias: ["insta3", "instagram3"],
    desc: "Download Instagram video (Alternative)",
    category: "downloader",
    react: "⏬",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply }) => {
    try {
        if (!q) return reply("❌ *Please provide an Instagram video link.*");
        if (!q.includes("instagram.com")) return reply("❌ *Invalid Instagram link.*");
        
        await reply("⏳ *Downloading video, please wait...*");
        
        const apiUrl = `https://rest-lily.vercel.app/api/downloader/igdl?url=${q}`;
        const { data } = await axios.get(apiUrl);
        
        if (!data.status || !data.data || !data.data[0]) return reply("❌ *Failed to fetch Instagram video.*");
        
        const { url } = data.data[0];
        
        const caption = 
`╭─────────────────⭓
│  📥 *INSTAGRAM DOWNLOADER*
├─────────────────
│  ✦ *Status:* ✅ Ready
│  ✦ *Server:* Lily API
│  ✦ *Downloaded by:* BOSS-MD
├─────────────────
│  *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʙᴏss-ᴍᴅ*
╰─────────────────⭓`;
        
        await conn.sendMessage(from, {
            video: { url: url },
            caption: caption,
            contextInfo: { mentionedJid: [m.sender] }
        }, { quoted: mek });
        
        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });
        
    } catch (e) {
        console.error("Error in Instagram downloader command:", e);
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
        reply(`❌ *An error occurred:* ${e.message}`);
    }
});

// ================== BONUS: INSTAGRAM STORY DOWNLOADER ==================
cmd({
    pattern: "story",
    alias: ["igstory", "instagramstory"],
    react: "📱",
    desc: "Download Instagram stories",
    category: "downloader",
    use: ".story <username>",
    filename: __filename
}, async (conn, mek, m, { from, reply, args }) => {
    try {
        const username = args[0];
        if (!username) {
            return reply("❌ *Please provide an Instagram username.*\n\n📌 *Example:* `.story cristiano`");
        }

        await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

        // Remove @ if present
        const cleanUsername = username.replace('@', '');
        
        const apiUrl = `https://api.ryzendesu.vip/api/downloader/igstory?username=${cleanUsername}`;
        const response = await axios.get(apiUrl);
        
        if (!response.data?.storyData || response.data.storyData.length === 0) {
            return reply("❌ *No stories found for this user or account is private.*");
        }

        const storyData = response.data.storyData;
        let sentCount = 0;

        for (const story of storyData) {
            const mediaType = story.isVideo ? 'video' : 'image';
            const caption = 
`╭─────────────────⭓
│  📱 *INSTAGRAM STORY*
├─────────────────
│  👤 *Username:* @${cleanUsername}
│  🎬 *Type:* ${story.isVideo ? 'Video' : 'Image'}
│  📥 *Downloaded by:* BOSS-MD
├─────────────────
│  *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʙᴏss-ᴍᴅ*
╰─────────────────⭓`;

            await conn.sendMessage(from, {
                [mediaType]: { url: story.url },
                caption: caption
            }, { quoted: mek });
            
            sentCount++;
            
            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        await conn.sendMessage(from, { 
            text: `✅ *Successfully downloaded ${sentCount} story/stories from @${cleanUsername}*`,
            contextInfo: { mentionedJid: [m.sender] }
        });
        
        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (error) {
        console.error('Story downloader error:', error);
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
        reply("❌ *Failed to download stories. Make sure the username is correct and account is public.*");
    }
});

// ================== BONUS: INSTAGRAM HIGHLIGHT DOWNLOADER ==================
cmd({
    pattern: "highlights",
    alias: ["ighighlight", "ighl"],
    react: "✨",
    desc: "Download Instagram highlights",
    category: "downloader",
    use: ".highlights <username>",
    filename: __filename
}, async (conn, mek, m, { from, reply, args }) => {
    try {
        const username = args[0];
        if (!username) {
            return reply("❌ *Please provide an Instagram username.*\n\n📌 *Example:* `.highlights cristiano`");
        }

        await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

        const cleanUsername = username.replace('@', '');
        
        // Note: You might need to change this API endpoint
        const apiUrl = `https://api.ryzendesu.vip/api/downloader/ighighlight?username=${cleanUsername}`;
        const response = await axios.get(apiUrl);
        
        if (!response.data?.highlightData || response.data.highlightData.length === 0) {
            return reply("❌ *No highlights found for this user or account is private.*");
        }

        const highlightData = response.data.highlightData;
        let totalMedia = 0;

        for (const highlight of highlightData) {
            const title = highlight.title || "Untitled";
            const media = highlight.media || [];
            
            for (const item of media) {
                const mediaType = item.isVideo ? 'video' : 'image';
                const caption = 
`╭─────────────────⭓
│  ✨ *INSTAGRAM HIGHLIGHT*
├─────────────────
│  👤 *Username:* @${cleanUsername}
│  📁 *Highlight:* ${title}
│  🎬 *Type:* ${item.isVideo ? 'Video' : 'Image'}
│  📥 *Downloaded by:* BOSS-MD
├─────────────────
│  *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʙᴏss-ᴍᴅ*
╰─────────────────⭓`;

                await conn.sendMessage(from, {
                    [mediaType]: { url: item.url },
                    caption: caption
                }, { quoted: mek });
                
                totalMedia++;
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        await conn.sendMessage(from, { 
            text: `✅ *Successfully downloaded ${totalMedia} items from highlights of @${cleanUsername}*`,
            contextInfo: { mentionedJid: [m.sender] }
        });
        
        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (error) {
        console.error('Highlight downloader error:', error);
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
        reply("❌ *Failed to download highlights. Make sure the username is correct and account is public.*");
    }
});