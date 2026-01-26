const axios = require("axios");
const config = require("../config");
const { cmd } = require("../command");

cmd({
  pattern: "play",
  alias: ["mp3", "song", "ytmp3"],
  react: "🎧",
  desc: "Download YouTube MP3",
  category: "download",
  use: ".play3 <YT URL>",
  filename: __filename
}, async (conn, m, msg, { from, q, reply }) => {
  try {
    if (!q) return reply("❌ YouTube link do bhai chaprio waly kam nai kro!");

    // API URL
    const apiUrl = `https://arslan-apis.vercel.app/download/ytmp3?url=${encodeURIComponent(q)}`;

    // Fetch Data
    const { data } = await axios.get(apiUrl);

    if (!data.status || !data.result?.download?.url) {
      return reply("❌ MP3 generate nahi ho saki!");
    }

    const meta = data.result.metadata;
    const audioUrl = data.result.download.url;

    // Caption
    const caption = `
*BOSS-MD WHATSAPP BOT*

🎵 *Title:* ${meta.title}
🎧 *Quality:* 128kbps
📁 *Type:* MP3

${config.FOOTER || "> © *Powered By Boss-MD*"}
`;

    // Thumbnail + info
    await conn.sendMessage(from, {
      image: { url: meta.thumbnail },
      caption
    }, { quoted: m });

    // Sending Audio
    await conn.sendMessage(from, {
      audio: { url: audioUrl },
      mimetype: "audio/mpeg",
      fileName: `${meta.title}.mp3`,
caption: `🎵 *${firstSong.title}*\n⏱️ Duration: ${firstSong.duration}s\n🎚️ Quality: ${firstSong.quality.toUpperCase()}\n\n> © Boss-MD`,
            contextInfo: {
                externalAdReply: {
                    title: firstSong.title.length > 50 ? `${firstSong.title.substring(0, 22)}...` : firstSong.title,
                    body: `🎶 ${firstSong.quality.toUpperCase()} | Duration: ${firstSong.duration}s\nBoss-MD`,
                    mediaType: 1,
                    thumbnailUrl: firstSong.thumbnail,
                    sourceUrl: firstSong.videoUrl,
                    showAdAttribution: false,
                    renderLargerThumbnail: true
                }
            }
    }, { quoted: m });

    reply("✅ Audio successfully sent!");

  } catch (err) {
    console.error(err);
    reply("❌ Error a gaya bhai, thori dair baad try karo!");
  }
});
