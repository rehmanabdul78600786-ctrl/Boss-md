const { cmd } = require("../command");
const axios = require("axios");

cmd({
  pattern: "fb",
  alias: ["facebook", "fbdl", "fbvideo"],
  desc: "Download Facebook videos in HD/SD quality",
  category: "download",
  react: "🎯",
  filename: __filename,
  use: ".fb <facebook url>"
}, async (conn, m, store, { from, q, reply, mek }) => {
  try {
    if (!q) {
      const helpMsg = 
`╔══════════════════════════╗
║      📘 *FB DOWNLOADER*    ║
╠══════════════════════════╣
║ ✦ *Usage:*                
║    .fb <facebook url>     
║    .facebook <url>        
║    .fbdl <url>            
╠══════════════════════════╣
║ ✦ *Example:*              
║    .fb https://fb.watch/xxx
║    .fb https://facebook.com/xxx
╠══════════════════════════╣
║ ✦ *Features:*             
║    • HD/SD Quality        
║    • Fast Download        
║    • Original Audio       
╠══════════════════════════╣
║    *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʙᴏss-ᴍᴅ*   
╚══════════════════════════╝`;
      return reply(helpMsg);
    }

    if (!q.includes("facebook.com") && !q.includes("fb.watch")) {
      return reply(
`╔══════════════════════════╗
║        ❌ *ERROR*          ║
╠══════════════════════════╣
║ Invalid Facebook URL!    
║                          
║ ✓ Use links from:        
║   • facebook.com/xxx     
║   • fb.watch/xxx         
╠══════════════════════════╣
║ *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʙᴏss-ᴍᴅ*   
╚══════════════════════════╝`);
    }

    await conn.sendMessage(from, {
      react: { text: "⏳", key: m.key }
    });

    reply(
`╔══════════════════════════╗
║     ⏳ *PROCESSING*       ║
╠══════════════════════════╣
║ • Fetching video data...  
║ • Please wait          
║ • This may take 10-20 sec
╠══════════════════════════╣
║ *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʙᴏss-ᴍᴅ*   
╚══════════════════════════╝`);

    // 🔥 YOUR OWN WORKING API
    const api = `https://arslan-apis.vercel.app/download/fbdown?url=${encodeURIComponent(q)}`;
    const { data } = await axios.get(api, { timeout: 60000 });

    if (
      !data?.status ||
      !data?.result?.download ||
      (!data.result.download.hd && !data.result.download.sd)
    ) {
      return reply(
`╔══════════════════════════╗
║        ❌ *FAILED*         ║
╠══════════════════════════╣
║ Video fetch nahi ho saka!
║                          
║ • Check URL is public    
║ • Try again later        
║ • Use different video    
╠══════════════════════════╣
║ *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʙᴏss-ᴍᴅ*   
╚══════════════════════════╝`);
    }

    const meta = data.result.metadata || {};
    const dl = data.result.download;

    // HD > SD priority
    const videoUrl = dl.hd || dl.sd;
    const quality = dl.hd ? "HD (1080p)" : "SD (480p)";
    
    // Format duration
    const duration = meta.duration ? meta.duration : "Unknown";
    
    // Get video title or use default
    const title = meta.title || "Facebook Video";
    
    // Get thumbnail if available
    const thumbnail = meta.thumbnail || "";

    const caption = 
`╔══════════════════════════╗
║      📘 *FB VIDEO*        ║
╠══════════════════════════╣
║ ✦ *Title:*                
║    ${title.substring(0, 40)}${title.length > 40 ? '...' : ''}
║                          
║ ✦ *Quality:* ${quality}    
║ ✦ *Duration:* ${duration}   
║ ✦ *Size:* ~${(parseInt(dl.size) / (1024*1024)).toFixed(2)} MB
╠══════════════════════════╣
║ ✓ *Downloaded by:*        
║    🇧 🇴 🇸 🇸 - 🇲 🇩
╠══════════════════════════╣
║    *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʙᴏss-ᴍᴅ*   
╚══════════════════════════╝

▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰
❖ *ᴇɴᴊᴏʏ ʏᴏᴜʀ ᴠɪᴅᴇᴏ* ❖
▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰`;

    // Send video with enhanced context
    await conn.sendMessage(from, {
      video: { url: videoUrl },
      mimetype: "video/mp4",
      caption: caption,
      contextInfo: {
        externalAdReply: {
          title: title.substring(0, 30),
          body: `Quality: ${quality} | Duration: ${duration}`,
          thumbnailUrl: thumbnail,
          sourceUrl: q,
          mediaType: 1,
          renderLargerThumbnail: true
        },
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363317350383696@newsletter",
          newsletterName: "BOSS-MD Downloads",
          serverMessageId: 143
        }
      }
    }, { quoted: mek });

    // Send success message with video info
    await conn.sendMessage(from, {
      text: 
`╔══════════════════════════╗
║        ✅ *SUCCESS*       ║
╠══════════════════════════╣
║ ✓ *Video Downloaded!*     
║                          
║ 📊 *Summary:*             
║ • Quality: ${quality}      
║ • Duration: ${duration}    
║ • URL: ${q.substring(0, 30)}...
╠══════════════════════════╣
║ *ᴛʜᴀɴᴋ ʏᴏᴜ ғᴏʀ ᴜsɪɴɢ*     
║    *🇧 🇴 🇸 🇸 - 🇲 🇩*         
╚══════════════════════════╝`
    });

    await conn.sendMessage(from, {
      react: { text: "✅", key: m.key }
    });

  } catch (err) {
    console.error("FB-DL ERROR:", err);
    
    await conn.sendMessage(from, {
      react: { text: "❌", key: m.key }
    });
    
    reply(
`╔══════════════════════════╗
║        ❌ *ERROR*          ║
╠══════════════════════════╣
║ • ${err.message.substring(0, 50)}
║                          
║ 🔧 *Solutions:*           
║ 1. Check URL validity     
║ 2. Try again later        
║ 3. Use different video    
╠══════════════════════════╣
║ *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʙᴏss-ᴍᴅ*   
╚══════════════════════════╝`);
  }
});

// === BONUS: Facebook Video Info Command ===
cmd({
  pattern: "fbinfo",
  alias: ["fbinfo", "fbi"],
  desc: "Get Facebook video information",
  category: "download",
  react: "ℹ️",
  filename: __filename,
}, async (conn, m, store, { from, q, reply }) => {
  try {
    if (!q || (!q.includes("facebook.com") && !q.includes("fb.watch"))) {
      return reply("❌ Valid Facebook URL do");
    }

    await conn.sendMessage(from, { react: { text: "⏳", key: m.key } });

    const api = `https://arslan-apis.vercel.app/download/fbdown?url=${encodeURIComponent(q)}`;
    const { data } = await axios.get(api);

    if (!data?.status || !data?.result) {
      return reply("❌ Info fetch nahi ho saka");
    }

    const meta = data.result.metadata || {};
    const dl = data.result.download;

    const infoMsg = 
`╔══════════════════════════╗
║    ℹ️ *VIDEO INFO*        ║
╠══════════════════════════╣
║ 📌 *Title:*               
║ ${meta.title || "N/A"}
║                          
║ 👤 *Uploader:*            
║ ${meta.uploader || "Unknown"}
║                          
║ ⏱ *Duration:* ${meta.duration || "N/A"}    
║ 🎬 *HD Available:* ${dl.hd ? "✅ Yes" : "❌ No"}
║ 📺 *SD Available:* ${dl.sd ? "✅ Yes" : "❌ No"}
║ 💾 *Size:* ${dl.size || "Unknown"}
╠══════════════════════════╣
║ *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʙᴏss-ᴍᴅ*   
╚══════════════════════════╝`;

    if (meta.thumbnail) {
      await conn.sendMessage(from, {
        image: { url: meta.thumbnail },
        caption: infoMsg
      }, { quoted: m });
    } else {
      reply(infoMsg);
    }

    await conn.sendMessage(from, { react: { text: "✅", key: m.key } });

  } catch (err) {
    console.error("FB Info Error:", err);
    reply("❌ Error: " + err.message);
  }
});