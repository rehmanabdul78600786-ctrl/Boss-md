const { cmd } = require("../command");
const axios = require("axios");
const crypto = require("crypto");
const Buffer = require("buffer").Buffer;

// === Encryption / Decryption Keys ===
const KEY_MAP = {
  enc: "GJvE5RZIxrl9SuNrAtgsvCfWha3M7NGC",
  dec: "H3quWdWoHLX5bZSlyCYAnvDFara25FIu",
};

// === Crypto Handler ===
const cryptoProc = (type, data) => {
  const key = Buffer.from(KEY_MAP[type], "utf8");
  const iv = Buffer.from(KEY_MAP[type].slice(0, 16), "utf8");

  const cipherFn =
    type === "enc" ? crypto.createCipheriv : crypto.createDecipheriv;
  const cipher = cipherFn("aes-256-cbc", key, iv);

  let output =
    type === "enc"
      ? cipher.update(data, "utf8", "base64")
      : cipher.update(data, "base64", "utf8");

  output += cipher.final(type === "enc" ? "base64" : "utf8");
  return output;
};

// === Savetik Encrypted TikTok Downloader ===
async function tiktokCrypto(url) {
  if (!/tiktok\.com/.test(url)) throw new Error("Invalid TikTok URL.");

  const encrypted = cryptoProc("enc", url);

  const { data } = await axios.post(
    "https://savetik.app/requests",
    { bdata: encrypted },
    {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130 Safari/537.36",
        "Content-Type": "application/json",
      },
      timeout: 25000,
    }
  );

  if (!data || data.status !== "success")
    throw new Error(data.message || "API Error.");

  const decryptedVideo = cryptoProc("dec", data.data);

  return {
    title: data.title || "Unknown",
    author: data.username || "Unknown",
    thumbnail: data.thumbnailUrl || "",
    video: decryptedVideo,
    audio: data.mp3 || null,
  };
}

// === Reliable video downloader (ALWAYS playable MP4) ===
async function fetchPlayableVideo(url) {
  const res = await axios.get(url, {
    responseType: "arraybuffer",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130 Safari/537.36",
    },
  });
  return Buffer.from(res.data);
}

// === COMMAND HANDLER ===
cmd(
  {
    pattern: "tiktok",
    alias: ["tt", "tttt", "tiktokdl", "ttdl"],
    desc: "Download TikTok videos with encrypted API (Fully Playable)",
    react: "🔐",
    category: "downloader",
    filename: __filename,
  },
  async (conn, m, store, { args, from, reply, sender }) => {
    try {
      if (!args[0] || !/tiktok\.com/.test(args[0])) {
        const helpMsg = 
`╭─────────────────────⭓
│  🎬 *TIKTOK DOWNLOADER*
├─────────────────────
│  ✦ *Usage:* 
│  .tiktok <url>
│  .tt <url>
│  .tttt <url>
├─────────────────────
│  📌 *Example:*
│  .tiktok https://vm.tiktok.com/xxxx
│  .tt https://www.tiktok.com/@user/xxxx
├─────────────────────
│  🔐 *Encrypted API*
│  ✦ *Powered by BOSS-MD*
╰─────────────────────⭓`;
        return reply(helpMsg);
      }

      const url = args[0];

      await store.react("⌛");
      reply("⏳ *🔐 Decrypting and preparing playable video...*");

      const result = await tiktokCrypto(url);

      // 🔥 Download into buffer (WhatsApp compatible)
      const videoBuffer = await fetchPlayableVideo(result.video);

      const caption = 
`╭─────────────────────⭓
│  🎬 *TIKTOK VIDEO*
├─────────────────────
│  ✦ *Title:* ${result.title}
│  ✦ *Author:* @${result.author}
│  ✦ *Status:* ✅ Downloaded
│  ✦ *Type:* 🔐 Encrypted API
├─────────────────────
│  *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʙᴏss-ᴍᴅ*
╰─────────────────────⭓

‎_ᴛɪᴋᴛᴏᴋ ᴠɪᴅᴇᴏ ᴅᴏᴡɴʟᴏᴀᴅᴇᴅ sᴜᴄᴄᴇssғᴜʟʟʏ_`;

      // === SEND VIDEO BUFFER ===
      await conn.sendMessage(
        from,
        {
          video: videoBuffer,
          mimetype: "video/mp4",
          caption: caption,
          contextInfo: {
            externalAdReply: {
              title: result.title,
              body: `By @${result.author}`,
              thumbnailUrl: result.thumbnail,
              sourceUrl: url,
              mediaType: 1,
              renderLargerThumbnail: true
            }
          }
        },
        { quoted: m }
      );

      // === SEND AUDIO ===
      if (result.audio) {
        const audioCaption = 
`╭─────────────────────⭓
│  🎵 *TIKTOK AUDIO*
├─────────────────────
│  ✦ *Title:* ${result.title}
│  ✦ *Author:* @${result.author}
│  ✦ *Type:* 🎧 MP3
├─────────────────────
│  *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʙᴏss-ᴍᴅ*
╰─────────────────────⭓`;

        await conn.sendMessage(
          from,
          {
            audio: { url: result.audio },
            mimetype: "audio/mpeg",
            caption: audioCaption
          },
          { quoted: m }
        );
      }

      await store.react("✅");
      
    } catch (err) {
      console.error("TT Crypto Error:", err.message);
      await store.react("❌");
      
      const errorMsg = 
`╭─────────────────────⭓
│  ❌ *DOWNLOAD FAILED*
├─────────────────────
│  ✦ *Error:* ${err.message}
│  ✦ *Solution:* 
│  • Check URL is valid
│  • Try again later
│  • Use different video
├─────────────────────
│  *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʙᴏss-ᴍᴅ*
╰─────────────────────⭓`;
      
      reply(errorMsg);
    }
  }
);

// === BONUS: TikTok Video Info (Without Download) ===
cmd(
  {
    pattern: "ttinfo",
    alias: ["tiktokinfo", "tiktoki"],
    desc: "Get TikTok video information",
    react: "ℹ️",
    category: "downloader",
    filename: __filename,
  },
  async (conn, m, store, { args, from, reply }) => {
    try {
      if (!args[0] || !/tiktok\.com/.test(args[0])) {
        return reply("❌ *Please provide a valid TikTok URL*\n\nExample: .ttinfo https://tiktok.com/@user/video/xxxx");
      }

      const url = args[0];
      await store.react("⌛");
      
      const result = await tiktokCrypto(url);
      
      const infoMsg = 
`╭─────────────────────⭓
│  ℹ️ *TIKTOK VIDEO INFO*
├─────────────────────
│  🎬 *Title:* ${result.title}
│  👤 *Author:* @${result.author}
│  🖼️ *Thumbnail:* Available
│  🎵 *Audio:* ${result.audio ? "✅ Available" : "❌ Not Available"}
│  📊 *Quality:* High (MP4)
│  🔗 *URL:* ${url.substring(0, 50)}...
├─────────────────────
│  *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʙᴏss-ᴍᴅ*
╰─────────────────────⭓

_ᴜsᴇ .ᴛɪᴋᴛᴏᴋ ᴛᴏ ᴅᴏᴡɴʟᴏᴀᴅ ᴛʜɪs ᴠɪᴅᴇᴏ_`;

      if (result.thumbnail) {
        await conn.sendMessage(
          from,
          {
            image: { url: result.thumbnail },
            caption: infoMsg
          },
          { quoted: m }
        );
      } else {
        reply(infoMsg);
      }
      
      await store.react("✅");
      
    } catch (err) {
      console.error("TT Info Error:", err.message);
      await store.react("❌");
      reply("❌ Error: " + err.message);
    }
  }
);

// === BONUS: TikTok Audio Only ===
cmd(
  {
    pattern: "ttaudio",
    alias: ["tiktoka", "tta"],
    desc: "Download TikTok audio only",
    react: "🎵",
    category: "downloader",
    filename: __filename,
  },
  async (conn, m, store, { args, from, reply }) => {
    try {
      if (!args[0] || !/tiktok\.com/.test(args[0])) {
        return reply("❌ *Please provide a valid TikTok URL*\n\nExample: .ttaudio https://tiktok.com/@user/video/xxxx");
      }

      const url = args[0];
      await store.react("⌛");
      reply("⏳ *Extracting audio from TikTok video...*");
      
      const result = await tiktokCrypto(url);
      
      if (!result.audio) {
        return reply("❌ *No audio available for this video*");
      }
      
      const audioCaption = 
`╭─────────────────────⭓
│  🎵 *TIKTOK AUDIO ONLY*
├─────────────────────
│  ✦ *Title:* ${result.title}
│  ✦ *Author:* @${result.author}
│  ✦ *Format:* MP3
├─────────────────────
│  *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʙᴏss-ᴍᴅ*
╰─────────────────────⭓`;

      await conn.sendMessage(
        from,
        {
          audio: { url: result.audio },
          mimetype: "audio/mpeg",
          caption: audioCaption
        },
        { quoted: m }
      );
      
      await store.react("✅");
      
    } catch (err) {
      console.error("TT Audio Error:", err.message);
      await store.react("❌");
      reply("❌ Error: " + err.message);
    }
  }
);