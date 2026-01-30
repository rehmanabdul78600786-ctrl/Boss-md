const { fetchJson } = require("../lib/functions");
const { downloadTiktok } = require("@mrnima/tiktok-downloader");
const { facebook } = require("@mrnima/facebook-downloader");
const cheerio = require("cheerio");
const { igdl } = require("ruhend-scraper");
const axios = require("axios");
const { cmd, commands } = require('../command');

cmd({
  pattern: "ig7",
  alias: ["insta8", "Instagram9"],
  desc: "To download Instagram videos.",
  react: "🎥",
  category: "download",
  filename: __filename
}, async (conn, m, store, { from, q, reply }) => {
  try {
    if (!q || !q.startsWith("http")) {
      return reply("❌ Please provide a valid Instagram link.");
    }

    await conn.sendMessage(from, {
      react: { text: "⏳", key: m.key }
    });

    const response = await axios.get(`https://insta-down.apis-bj-devs.workers.dev/?url=${q}`);
    const data = response.data;

    if (!data || data.status !== 200 || !data.downloadUrl) {
      return reply("⚠️ Failed to fetch Instagram video. Please check the link and try again.");
    }

    await conn.sendMessage(from, {
      video: { url: data.downloadUrl },
      mimetype: "video/mp4",
      caption: "📥 *Instagram Video Downloaded Successfully!*"
    }, { quoted: m });

  } catch (error) {
    console.error("Error:", error);
    reply("❌ An error occurred while processing your request. Please try again.");
  }
});


// twitter-dl

cmd({
  pattern: "twitter",
  alias: ["tweet", "twdl"],
  desc: "Download Twitter videos",
  category: "download",
  filename: __filename
}, async (conn, m, store, {
  from,
  quoted,
  q,
  reply
}) => {
  try {
    if (!q || !q.startsWith("https://")) {
      return conn.sendMessage(from, { text: "❌ Please provide a valid Twitter URL." }, { quoted: m });
    }

    await conn.sendMessage(from, {
      react: { text: '⏳', key: m.key }
    });

    const response = await axios.get(`https://www.dark-yasiya-api.site/download/twitter?url=${q}`);
    const data = response.data;

    if (!data || !data.status || !data.result) {
      return reply("⚠️ Failed to retrieve Twitter video. Please check the link and try again.");
    }

    const { desc, thumb, video_sd, video_hd } = data.result;

    const caption = `╭━━━〔 *TWITTER DOWNLOADER* 〕━━━⊷\n`
      + `┃▸ *Description:* ${desc || "No description"}\n`
      + `╰━━━⪼\n\n`
      + `📹 *Download Options:*\n`
      + `1️⃣  *SD Quality*\n`
      + `2️⃣  *HD Quality*\n`
      + `🎵 *Audio Options:*\n`
      + `3️⃣  *Audio*\n`
      + `4️⃣  *Document*\n`
      + `5️⃣  *Voice*\n\n`
      + `📌 *Reply with the number to download your choice.*`;

    const sentMsg = await conn.sendMessage(from, {
      image: { url: thumb },
      caption: caption
    }, { quoted: m });

    const messageID = sentMsg.key.id;

    conn.ev.on("messages.upsert", async (msgData) => {
      const receivedMsg = msgData.messages[0];
      if (!receivedMsg.message) return;

      const receivedText = receivedMsg.message.conversation || receivedMsg.message.extendedTextMessage?.text;
      const senderID = receivedMsg.key.remoteJid;
      const isReplyToBot = receivedMsg.message.extendedTextMessage?.contextInfo?.stanzaId === messageID;

      if (isReplyToBot) {
        await conn.sendMessage(senderID, {
          react: { text: '⬇️', key: receivedMsg.key }
        });

        switch (receivedText) {
          case "1":
            await conn.sendMessage(senderID, {
              video: { url: video_sd },
              caption: "📥 *Downloaded in SD Quality*"
            }, { quoted: receivedMsg });
            break;

          case "2":
            await conn.sendMessage(senderID, {
              video: { url: video_hd },
              caption: "📥 *Downloaded in HD Quality*"
            }, { quoted: receivedMsg });
            break;

          case "3":
            await conn.sendMessage(senderID, {
              audio: { url: video_sd },
              mimetype: "audio/mpeg"
            }, { quoted: receivedMsg });
            break;

          case "4":
            await conn.sendMessage(senderID, {
              document: { url: video_sd },
              mimetype: "audio/mpeg",
              fileName: "Twitter_Audio.mp3",
              caption: "📥 *Audio Downloaded as Document*"
            }, { quoted: receivedMsg });
            break;

          case "5":
            await conn.sendMessage(senderID, {
              audio: { url: video_sd },
              mimetype: "audio/mp4",
              ptt: true
            }, { quoted: receivedMsg });
            break;

          default:
            reply("❌ Invalid option! Please reply with 1, 2, 3, 4, or 5.");
        }
      }
    });

  } catch (error) {
    console.error("Error:", error);
    reply("❌ An error occurred while processing your request. Please try again.");
  }
});

// MediaFire-dl

cmd({
  pattern: "mediafire",
  alias: ["mfire"],
  desc: "To download MediaFire files.",
  react: "🎥",
  category: "download",
  filename: __filename
}, async (conn, m, store, {
  from,
  quoted,
  q,
  reply
}) => {
  try {
    if (!q) {
      return reply("❌ Please provide a valid MediaFire link.");
    }

    await conn.sendMessage(from, {
      react: { text: "⏳", key: m.key }
    });

    const response = await axios.get(`https://www.dark-yasiya-api.site/download/mfire?url=${q}`);
    const data = response.data;

    if (!data || !data.status || !data.result || !data.result.dl_link) {
      return reply("⚠️ Failed to fetch MediaFire download link. Ensure the link is valid and public.");
    }

    const { dl_link, fileName, fileType } = data.result;
    const file_name = fileName || "mediafire_download";
    const mime_type = fileType || "application/octet-stream";

    await conn.sendMessage(from, {
      react: { text: "⬆️", key: m.key }
    });

    const caption = `╭━━━〔 *MEDIAFIRE DOWNLOADER* 〕━━━⊷\n`
      + `┃▸ *File Name:* ${file_name}\n`
      + `┃▸ *File Type:* ${mime_type}\n`
      + `╰━━━⪼\n\n`
      + `📥 *Downloading your file...*`;

    await conn.sendMessage(from, {
      document: { url: dl_link },
      mimetype: mime_type,
      fileName: file_name,
      caption: caption
    }, { quoted: m });

  } catch (error) {
    console.error("Error:", error);
    reply("❌ An error occurred while processing your request. Please try again.");
  }
});

// apk-dl

cmd({
  pattern: "apk",
  desc: "Download APK from Aptoide.",
  category: "download",
  filename: __filename
}, async (conn, m, store, {
  from,
  quoted,
  q,
  reply
}) => {
  try {
    if (!q) {
      return reply("❌ Please provide an app name to search.");
    }

    await conn.sendMessage(from, { react: { text: "⏳", key: m.key } });

    const apiUrl = `http://ws75.aptoide.com/api/7/apps/search/query=${q}/limit=1`;
    const response = await axios.get(apiUrl);
    const data = response.data;

    if (!data || !data.datalist || !data.datalist.list.length) {
      return reply("⚠️ No results found for the given app name.");
    }

    const app = data.datalist.list[0];
    const appSize = (app.size / 1048576).toFixed(2); // Convert bytes to MB

    const caption = `╭━━━〔 *APK Downloader* 〕━━━┈⊷
┃ 📦 *Name:* ${app.name}
┃ 🏋 *Size:* ${appSize} MB
┃ 📦 *Package:* ${app.package}
┃ 📅 *Updated On:* ${app.updated}
┃ 👨‍💻 *Developer:* ${app.developer.name}
╰━━━━━━━━━━━━━━━┈⊷
🔗 **© 𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 Boss-md мυℓтιρℓє ρσωєяƒυℓ ωнαтѕαρρ вσт ❣️*`;

    await conn.sendMessage(from, { react: { text: "⬆️", key: m.key } });

    await conn.sendMessage(from, {
      document: { url: app.file.path_alt },
      fileName: `${app.name}.apk`,
      mimetype: "application/vnd.android.package-archive",
      caption: caption
    }, { quoted: m });

    await conn.sendMessage(from, { react: { text: "✅", key: m.key } });

  } catch (error) {
    console.error("Error:", error);
    reply("❌ An error occurred while fetching the APK. Please try again.");
  }
});

// G-Drive-DL

cmd({
  pattern: "gdrive",
  desc: "Download Google Drive files.",
  react: "🌐",
  category: "download",
  filename: __filename
}, async (conn, m, store, {
  from,
  quoted,
  q,
  reply
}) => {
  try {
    if (!q) {
      return reply("❌ Please provide a valid Google Drive link.");
    }

    await conn.sendMessage(from, { react: { text: "⬇️", key: m.key } });

    const apiUrl = `https://api.fgmods.xyz/api/downloader/gdrive?url=${q}&apikey=mnp3grlZ`;
    const response = await axios.get(apiUrl);
    const downloadUrl = response.data.result.downloadUrl;

    if (downloadUrl) {
      await conn.sendMessage(from, { react: { text: "⬆️", key: m.key } });

      await conn.sendMessage(from, {
        document: { url: downloadUrl },
        mimetype: response.data.result.mimetype,
        fileName: response.data.result.fileName,
        caption: "*© 𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 Boss-md ❣️*"
      }, { quoted: m });

      await conn.sendMessage(from, { react: { text: "✅", key: m.key } });
    } else {
      return reply("⚠️ No download URL found. Please check the link and try again.");
    }
  } catch (error) {
    console.error("Error:", error);
    reply("❌ An error occurred while fetching the Google Drive file. Please try again.");
  }
}); 
const axios = require("axios");
const { cmd } = require("../command");

// FAIZAN-MD styled titles
const fbTitles = [
  "┌─⭓ *𝘽𝙊𝙎𝙎-𝙈𝘿* ⭓\n│\n│ 📥 *Facebook Video Download*\n│ ✅ *Download Successful*\n└─────────────\n\n*© POWERED BY 𝐵𝒪𝒮𝒮-𝑀𝒟*",
  "┌─⭓ *𝘽𝙊𝙎𝙎-𝙈𝘿* ⭓\n│\n│ 📥 *Facebook Video Download*\n│ 🎬 *HD Video Ready*\n└─────────────\n\n*© POWERED BY 𝘽𝙊𝙎𝙎-𝙈𝘿*",
  "┌─⭓ *𝘽𝙊𝙎𝙎-𝙈𝘿* ⭓\n│\n│ 📥 *Facebook Video Download*\n│ ⚡ *Fast Download*\n└─────────────\n\n*© POWERED BY 𝘽𝙊𝙎𝙎-𝙈𝘿*",
  "┌─⭓ *𝘽𝙊𝙎𝙎-𝙈𝘿* ⭓\n│\n│ 📥 *Facebook Video Download*\n│ 🚀 *Completed*\n└─────────────\n\n*© POWERED BY 𝘽𝙊𝙎𝙎-𝙈𝘿*"
];

let fbTitleIndex = 0;

cmd({
  pattern: "fb",
  alias: ["facebook", "fbvideo"],
  react: "📥",
  desc: "Download Facebook videos",
  category: "download",
  use: ".fb <facebook url>",
  filename: __filename
}, async (conn, mek, m, { from, reply, args }) => {
  try {
    const fbUrl = args[0];

    if (!fbUrl || !fbUrl.includes("facebook.com")) {
      return reply(
        "┌─⭓ *𝘽𝙊𝙎𝙎-𝙈𝘿* ⭓\n│\n│ ❌ *Invalid Facebook URL*\n│ Example:\n│ .fb https://facebook.com/...\n└─────────────"
      );
    }

    await conn.sendMessage(from, { react: { text: "⏳", key: m.key } });

    await conn.sendMessage(from, {
      text:
        "┌─⭓ *𝘽𝙊𝙎𝙎-𝙈𝘿* ⭓\n│\n│ 🔍 *Processing Link...*\n│ 📥 *Fetching Video*\n└─────────────"
    }, { quoted: mek });

    const apiUrl = `https://edith-apis.vercel.app/download/facebook?url=${encodeURIComponent(fbUrl)}`;
    const { data } = await axios.get(apiUrl, { timeout: 20000 });

    if (!data || data.status !== true) {
      return reply(
        "┌─⭓ *𝘽𝙊𝙎𝙎-𝙈𝘿* ⭓\n│\n│ ❌ *Download Failed*\n│ Facebook may be blocking this video\n└─────────────"
      );
    }

    const media = data?.result?.media || {};
    const videoUrl =
      media.video_hd ||
      media.video_sd ||
      media.video ||
      null;

    if (!videoUrl) {
      return reply(
        "┌─⭓ *𝘽𝙊𝙎𝙎-𝙈𝘿* ⭓\n│\n│ ⚠️ *Video URL not found*\n│ Reel may be private or restricted\n└─────────────"
      );
    }

    const caption = fbTitles[fbTitleIndex];
    fbTitleIndex = (fbTitleIndex + 1) % fbTitles.length;

    await conn.sendMessage(from, {
      video: { url: videoUrl },
      caption
    }, { quoted: mek });

    await conn.sendMessage(from, { react: { text: "✅", key: m.key } });

  } catch (err) {
    console.error("𝘽𝙊𝙎𝙎-𝙈𝘿 FB ERROR:", err);
    reply(
      "┌─⭓ *𝘽𝙊𝙎𝙎-𝙈𝘿* ⭓\n│\n│ ❌ *Facebook Download Failed*\n│ Try another video\n└─────────────"
    );
  }
});
const axios = require("axios");
const { cmd } = require('../command');

cmd({
    pattern: "igdl",
    alias: ["instagram", "insta", "ig"],
    react: "⬇️",
    desc: "Download Instagram videos/reels",
    category: "downloader",
    use: ".igdl <Instagram URL>",
    filename: __filename
}, async (conn, mek, m, { from, reply, args, q }) => {
    try {
        const url = q || m.quoted?.text;
        if (!url || !url.includes("instagram.com")) {
            return reply("❌ Please provide/reply to an Instagram link");
        }

        // Show processing reaction
        await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

        // Fetch from API
        const apiUrl = `https://api-aswin-sparky.koyeb.app/api/downloader/igdl?url=${encodeURIComponent(url)}`;
        const response = await axios.get(apiUrl);

        if (!response.data?.status || !response.data.data?.length) {
            await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
            return reply("Failed to fetch media. Invalid link or private content.");
        }

        // Send all media items
        for (const item of response.data.data) {
            await conn.sendMessage(from, {
                [item.type === 'video' ? 'video' : 'image']: { url: item.url },
                caption: `‎*_ɪɴsᴛᴀɢʀᴀᴍ ᴅᴏᴡɴʟᴏᴀᴅᴇʀ_*
‎*╭──────────────━┈⍟*
‎┋ *_𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝐁𝐎𝐒𝐒-𝐌𝐃_* 
‎*╰──────────────━┈⍟*
‎`
            }, { quoted: mek });
        }

        // Success reaction
        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (error) {
        console.error('IGDL Error:', error);
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
        reply("❌ Download failed. Try again later.");
    }
});

cmd({
  pattern: "igdl4",
  alias: ["instagram4", "insta4", "ig4", "igvideo4"],
  react: '📶',
  desc: "Download videos from Instagram (Alternative API)",
  category: "download",
  use: ".igdl2 <Instagram URL>",
  filename: __filename
}, async (conn, mek, m, { from, reply, args }) => {
  try {
    const igUrl = args[0];
    if (!igUrl || !igUrl.includes("instagram.com")) {
      return reply('Please provide a valid Instagram URL. Example: `.igdl2 https://instagram.com/...`');
    }

    await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

    const apiUrl = `https://bk9.fun/download/instagram?url=${encodeURIComponent(igUrl)}`;
    const response = await axios.get(apiUrl);

    if (!response.data?.status || !response.data?.BK9?.[0]?.url) {
      await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
      return reply('❌ Unable to fetch the video. Try .igdl2 for primary download.');
    }

    const videoUrl = response.data.BK9[0].url;
    await conn.sendMessage(from, { react: { text: '📶', key: m.key } });

    const videoResponse = await axios.get(videoUrl, { responseType: 'arraybuffer' });
    if (!videoResponse.data) {
      await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
      return reply('❌ Failed to download the video. Please try again later.');
    }

    const videoBuffer = Buffer.from(videoResponse.data, 'binary');

    await conn.sendMessage(from, {
      video: videoBuffer,
      caption: `*_ɪɴsᴛᴀɢʀᴀᴍ ᴅᴏᴡɴʟᴏᴀᴅᴇʀ_*
‎*╭───────────────━┈⍟*
‎┋ *_𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝐵𝒪𝒮𝒮-𝑀𝒟_* 
‎*╰───────────────━┈⍟*`,
    }, { quoted: mek });

    await conn.sendMessage(from, { react: { text: '✅', key: m.key } });
  } catch (error) {
    console.error('Error downloading video:', error);
    await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
    reply('❌ API 2 failed. Try .igdl for primary download.');
  }
});

cmd({
  pattern: "igdl2",
  alias: ["instagram2", "ig2", "instadl2"],
  react: '📥',
  desc: "Download videos from Instagram (API v5)",
  category: "download",
  use: ".igdl5 <Instagram video URL>",
  filename: __filename
}, async (conn, mek, m, { from, reply, args }) => {
  try {
    const igUrl = args[0];
    if (!igUrl || !igUrl.includes("instagram.com")) {
      return reply('❌ Please provide a valid Instagram video URL.\n\nExample:\n.igdl5 https://instagram.com/reel/...');
    }

    await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

    const apiUrl = `https://jawad-tech.vercel.app/downloader?url=${encodeURIComponent(igUrl)}`;
    const response = await axios.get(apiUrl);

    const data = response.data;

    if (!data.status || !data.result || !Array.isArray(data.result)) {
      return reply('❌ Unable to fetch the video. Please check the URL and try again.');
    }

    const videoUrl = data.result[0];
    if (!videoUrl) return reply("❌ No video found in the response.");

    const metadata = data.metadata || {};
    const author = metadata.author || "Unknown";
    const caption = metadata.caption ? metadata.caption.slice(0, 300) + "..." : "No caption provided.";
    const likes = metadata.like || 0;
    const comments = metadata.comment || 0;

    await reply('ᴜᴘʟᴏᴀᴅɪɴɢ ʏᴏᴜʀ ᴠɪᴅᴇᴏ ᴡᴀɪᴛ...');

    await conn.sendMessage(from, {
      video: { url: videoUrl },
      caption: `📥 *Instagram Reel Downloader*\n👤 *Author:* ${author}\n💬 *Caption:* ${caption}\n❤️ *Likes:* ${likes} | 💭 *Comments:* ${comments}\n\n> 𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝐵𝒪𝒮𝒮-𝑀𝒟`
    }, { quoted: mek });

    await conn.sendMessage(from, { react: { text: '✅', key: m.key } });
  } catch (error) {
    console.error('IGDL5 Error:', error);
    reply('❌ Failed to download the Instagram video. Please try again later.');
    await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
  }
});
cmd({
    pattern: "ig3",
    alias: ["insta3", "instagram3"],
    desc: "Download Instagram video",
    category: "downloader",
    react: "⤵️",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply }) => {
    try {
        if (!q) return reply("Please provide an Instagram video link.");
        if (!q.includes("instagram.com")) return reply("Invalid Instagram link.");
        
        reply("Downloading video, please wait...");
        
        const apiUrl = `https://rest-lily.vercel.app/api/downloader/igdl?url=${q}`;
        const { data } = await axios.get(apiUrl);
        
        if (!data.status || !data.data || !data.data[0]) return reply("Failed to fetch Instagram video.");
        
        const { url } = data.data[0];
        
        const caption = 
`*_ɪɴsᴛᴀɢʀᴀᴍ ᴅᴏᴡɴʟᴏᴀᴅᴇʀ_*
‎*╭───────────────━┈⍟*
‎┋ *_𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝐵𝒪𝒮𝒮-𝑀𝒟_* 
‎*╰───────────────━┈⍟*`;
        
        await conn.sendMessage(from, {
            video: { url: url },
            caption: caption,
            contextInfo: { mentionedJid: [m.sender] }
        }, { quoted: mek });
        
    } catch (e) {
        console.error("Error in Instagram downloader command:", e);
        reply(`An error occurred: ${e.message}`);
    }
});
const { cmd } = require('../command');
const axios = require('axios');
const config = require('../config');

cmd({
    pattern: "tt",
    alias: ["tiktok", "ttdl"],
    react: "🎵",
    desc: "Download TikTok video without watermark",
    category: "download",
    use: ".tt <tiktok url>",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q || !q.includes("tiktok")) {
            return reply("❌ TikTok link do\nExample:\n.tt https://vm.tiktok.com/xxxx");
        }

        await reply("⏳ *𝓑𝓞𝓢𝓢-𝓜𝓓 downloading TikTok...*");

        const apiUrl = `https://arslanmd-api.vercel.app/api/ttdl?url=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);

        if (!data.status || !data.result?.video) {
            return reply("❌ TikTok download failed\nLink private ya expired ho sakta hai.");
        }

        const caption = `
🎵 *TikTok Downloaded*
👤 Author: ${data.result.author || "Unknown"}

⚡ Powered by *𝓑𝓞𝓢𝓢-𝓜𝓓*
        `.trim();

        await conn.sendMessage(from, {
            video: { url: data.result.video },
            caption: caption,
            mimetype: "video/mp4"
        }, { quoted: mek });

    } catch (e) {
        console.error("TikTok Error:", e);
        reply("❌ Error while downloading TikTok");
    }
});
