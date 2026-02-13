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

    let videoUrl = null;
    let quality = "HD";
    let title = "Facebook Video";
    let error = null;

    // ✅ TRY API 1: Aqul
    try {
      const api1 = `https://aqul.my.id/api/facebook?url=${encodeURIComponent(q)}`;
      const { data } = await axios.get(api1, { timeout: 10000 });
      
      if (data?.status && (data?.result?.hd || data?.result?.sd)) {
        videoUrl = data.result.hd || data.result.sd;
        quality = data.result.hd ? "HD" : "SD";
        title = data.result.title || "Facebook Video";
        console.log("✅ API 1 working");
      }
    } catch (e) {
      error = e;
      console.log("API 1 failed");
    }

    // ✅ TRY API 2: Agatz (if API 1 fails)
    if (!videoUrl) {
      try {
        const api2 = `https://api.agatz.xyz/api/facebook?url=${encodeURIComponent(q)}`;
        const { data } = await axios.get(api2, { timeout: 10000 });
        
        if (data?.status && (data?.data?.video_hd || data?.data?.video_sd)) {
          videoUrl = data.data.video_hd || data.data.video_sd;
          quality = data.data.video_hd ? "HD" : "SD";
          title = data.data.title || "Facebook Video";
          console.log("✅ API 2 working");
        }
      } catch (e) {
        console.log("API 2 failed");
      }
    }

    // ✅ TRY API 3: Ryzendesu (if both APIs fail)
    if (!videoUrl) {
      try {
        const api3 = `https://api.ryzendesu.vip/api/downloader/fb?url=${encodeURIComponent(q)}`;
        const { data } = await axios.get(api3, { timeout: 10000 });
        
        if (data?.status && data?.result) {
          videoUrl = data.result.hd || data.result.sd || data.result.video;
          quality = data.result.hd ? "HD" : "SD";
          title = data.result.title || "Facebook Video";
          console.log("✅ API 3 working");
        }
      } catch (e) {
        console.log("API 3 failed");
      }
    }

    // ✅ TRY API 4: Vihanga (if all APIs fail)
    if (!videoUrl) {
      try {
        const api4 = `https://vihangayt.me/download/fbdl?url=${encodeURIComponent(q)}`;
        const { data } = await axios.get(api4, { timeout: 10000 });
        
        if (data?.status && data?.data?.video) {
          videoUrl = data.data.video;
          quality = data.data.quality || "HD";
          title = data.data.title || "Facebook Video";
          console.log("✅ API 4 working");
        }
      } catch (e) {
        console.log("API 4 failed");
      }
    }

    // If no API worked
    if (!videoUrl) {
      return reply("❌ Video fetch nahi ho saka\n➠ Khud check karo\n➠ https://fbdown.net");
    }

    // Simple caption
    const caption = `📘 *Facebook Video*\n🎬 ${title}\n🎞 ${quality}\n⚡ BOSS-MD`;

    // Send video
    await conn.sendMessage(from, {
      video: { url: videoUrl },
      mimetype: "video/mp4",
      caption: caption
    }, { quoted: mek });

    await conn.sendMessage(from, { react: { text: "✅", key: m.key } });

  } catch (err) {
    console.error("FB-DL ERROR:", err);
    await conn.sendMessage(from, { react: { text: "❌", key: m.key } });
    reply("❌ Error: " + err.message + "\n\n➠ Khud download karo: https://fbdown.net");
  }
});