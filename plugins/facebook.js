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

    // ✅ Working API - Fast Download
    const api = `https://api.agatz.xyz/api/facebook?url=${encodeURIComponent(q)}`;
    const { data } = await axios.get(api);

    if (!data?.status || !data?.data?.video_hd && !data?.data?.video_sd) {
      return reply("❌ Facebook video fetch nahi ho saka");
    }

    // HD > SD priority
    const videoUrl = data.data.video_hd || data.data.video_sd;
    const quality = data.data.video_hd ? "HD" : "SD";
    const title = data.data.title || "Facebook Video";

    const caption = `📘 *FB VIDEO*\n🎬 ${title}\n🎞 ${quality}\n🤖 BOSS-MD`;

    await conn.sendMessage(from, {
      video: { url: videoUrl },
      mimetype: "video/mp4",
      caption: caption
    }, { quoted: mek });

    await conn.sendMessage(from, { react: { text: "✅", key: m.key } });

  } catch (err) {
    console.error("FB-DL ERROR:", err);
    await conn.sendMessage(from, { react: { text: "❌", key: m.key } });
    reply("❌ Error: " + err.message);
  }
});