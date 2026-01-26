const { cmd } = require('../command');
const axios = require('axios');
const yts = require('yt-search');

cmd({
  pattern: "play",
  alias: ["song"],
  desc: "Play song with thumbnail",
  category: "download",
  react: "🎵",
  filename: __filename,
  use: ".play <song name | youtube link>"
}, async (conn, mek, m, { from, reply, q }) => {
  try {
    if (!q) return reply("❌ Song name ya YouTube link likho\nExample: *.play pal pal*");

    let ytUrl;
    let video;

    // 🔍 Search if not YouTube link
    if (!q.includes("youtube.com") && !q.includes("youtu.be")) {
      const search = await yts(q);
      if (!search.videos.length) return reply("❌ Song nahi mila");

      video = search.videos[0];
      ytUrl = video.url;
    } else {
      ytUrl = q;
      const search = await yts(q);
      video = search.videos[0];
    }

    // 🔗 API CALL
    const apiUrl = `https://arslan-apis.vercel.app/download/ytmp3?url=${encodeURIComponent(ytUrl)}`;
    const res = await axios.get(apiUrl, { timeout: 60000 });

    if (!res.data?.status || !res.data?.result?.download?.url) {
      return reply("❌ Download failed");
    }

    const title = res.data.result.metadata.title;
    const thumbUrl = res.data.result.metadata.thumbnail;
    const dlUrl = res.data.result.download.url;

    // 📥 Download MP3
    const audioRes = await axios.get(dlUrl, {
      responseType: 'arraybuffer',
      timeout: 60000
    });
    const audioBuffer = Buffer.from(audioRes.data);

    // 📏 Size check
    const sizeMB = (audioBuffer.length / (1024 * 1024)).toFixed(2);
    if (audioBuffer.length > 16 * 1024 * 1024) {
      return reply(`❌ File too large (${sizeMB}MB)\nWhatsApp limit 16MB`);
    }

    // 🖼️ Download thumbnail
    const thumbRes = await axios.get(thumbUrl, {
      responseType: 'arraybuffer'
    });
    const thumbBuffer = Buffer.from(thumbRes.data);

    // 📤 Send AUDIO with THUMBNAIL
    await conn.sendMessage(from, {
      audio: audioBuffer,
      mimetype: "audio/mpeg",
      fileName: `${title.substring(0, 50)}.mp3`,
      contextInfo: {
        externalAdReply: {
          title: title,
          body: "BOSS-MD Music Player 🎶",
          thumbnail: thumbBuffer,
          mediaType: 2,
          renderLargerThumbnail: true,
          sourceUrl: ytUrl
        }
      }
    }, { quoted: mek });

  } catch (e) {
    console.error("PLAY ERROR:", e);
    reply("❌ Error: " + e.message);
  }
});
