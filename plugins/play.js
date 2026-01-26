const { cmd } = require('../command');
const yts = require('yt-search');
const ytdl = require('ytdl-core');

cmd({
  pattern: "play",
  alias: ["song"],
  desc: "Play song with thumbnail",
  category: "download",
  react: "🎵",
  filename: __filename
}, async (conn, mek, m, { from, reply, q }) => {
  try {
    if (!q) return reply("❌ Song name likho chaprio\nExample: *.play pal pal lol*");

    const search = await yts(q);
    if (!search.videos.length) return reply("❌ Song nahi mila");

    const video = search.videos[0];

    const audioStream = ytdl(video.url, {
      filter: "audioonly",
      quality: "highestaudio",
      highWaterMark: 1 << 25
    });

    await conn.sendMessage(from, {
      audio: { stream: audioStream },
      mimetype: "audio/mpeg",
      fileName: `${video.title}.mp3`,
      contextInfo: {
        externalAdReply: {
          title: video.title,
          body: "BOSS-MD Music Player 🎶",
          thumbnailUrl: video.thumbnail,
          mediaType: 1,
          renderLargerThumbnail: true,
          sourceUrl: video.url
        }
      }
    }, { quoted: mek });

  } catch (err) {
    console.log("PLAY ERROR:", err);
    reply("❌ Audio play nahi ho rahi");
  }
});
