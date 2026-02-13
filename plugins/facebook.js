const { cmd } = require("../command");
const axios = require("axios");

cmd({
  pattern: "fb",
  alias: ["facebook", "fbdl"],
  desc: "Download Facebook video",
  category: "download",
  react: "📘",
  filename: __filename,
}, async (conn, mek, m, { from, q, reply }) => {
  try {
    if (!q) {
      return reply("❌ Facebook video link do\n\nExample:\n.fb https://fb.watch/xxxxx");
    }

    if (!q.includes("facebook.com") && !q.includes("fb.watch")) {
      return reply("❌ Valid Facebook URL nahi hai");
    }

    await conn.sendMessage(from, { react: { text: "⏳", key: m.key } });

    // 🔥 Working API
    const api = `https://vihangayt.me/download/fbdl?url=${encodeURIComponent(q)}`;
    const { data } = await axios.get(api);

    if (!data?.status || !data?.data?.video) {
      return reply("❌ Facebook video fetch nahi ho saka");
    }

    const videoUrl = data.data.video;
    const title = data.data.title || "Facebook Video";
    const quality = data.data.quality || "HD";
    const thumbnail = data.data.thumbnail || "";

    const caption = 
`📘 *Facebook Video Downloaded*
╭───────────────⭓
│ 🎬 *Title:* ${title.substring(0, 30)}
│ 🎞 *Quality:* ${quality}
│ 📥 *By:* BOSS-MD
╰───────────────⭓`;

    await conn.sendMessage(from, {
      video: { url: videoUrl },
      mimetype: "video/mp4",
      caption: caption,
      contextInfo: {
        externalAdReply: {
          title: title.substring(0, 20),
          body: "Facebook Downloader",
          thumbnailUrl: thumbnail,
          sourceUrl: q,
          mediaType: 1
        }
      }
    }, { quoted: mek });

    await conn.sendMessage(from, { react: { text: "✅", key: m.key } });

  } catch (err) {
    console.error("FB-DL ERROR:", err);
    await conn.sendMessage(from, { react: { text: "❌", key: m.key } });
    reply("❌ Error: " + err.message);
  }
});