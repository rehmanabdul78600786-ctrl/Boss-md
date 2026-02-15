const { cmd } = require("../command");
const axios = require("axios");

cmd({
  pattern: "fb",
  alias: ["facebook", "fbdl"],
  desc: "Download Facebook video",
  category: "download",
  react: "📘",
  filename: __filename,
  use: ".fb <facebook url>"
}, async (conn, m, store, { from, q, reply }) => {
  try {
    if (!q) {
      return reply(`╔═══❖═══❖═══❖═══╗
    ░B░O░S░S░-░M░D░
╚═══❖═══❖═══❖═══╝

  ╭┅┅┅┅┅┅┅┅┅┅┅┅┅╮
  ┆  ❌ ERROR ❌  ┆
  ╰┅┅┅┅┅┅┅┅┅┅┅┅┅╯

❌ Facebook video link do

Example:
.fb https://facebook.com/xxxx

      💠 𝗕𝗢𝗦𝗦-𝗠𝗗 💠`);
    }

    if (!q.includes("facebook.com") && !q.includes("fb.watch")) {
      return reply(`╔═══❖═══❖═══❖═══╗
    ░B░O░S░S░-░M░D░
╚═══❖═══❖═══❖═══╝

  ╭┅┅┅┅┅┅┅┅┅┅┅┅┅╮
  ┆ ❌ INVALID URL ┆
  ╰┅┅┅┅┅┅┅┅┅┅┅┅┅╯

❌ Valid Facebook URL nahi hai

      💠 𝗕𝗢𝗦𝗦-𝗠𝗗 💠`);
    }

    await conn.sendMessage(from, {
      react: { text: "⏳", key: m.key }
    });

    // 🔥 YOUR OWN WORKING API
    const api = `https://arslan-apis.vercel.app/download/fbdown?url=${encodeURIComponent(q)}`;
    const { data } = await axios.get(api, { timeout: 60000 });

    if (
      !data?.status ||
      !data?.result?.download ||
      (!data.result.download.hd && !data.result.download.sd)
    ) {
      return reply(`╔═══❖═══❖═══❖═══╗
    ░B░O░S░S░-░M░D░
╚═══❖═══❖═══❖═══╝

  ╭┅┅┅┅┅┅┅┅┅┅┅┅┅╮
  ┆  ❌ FAILED ❌  ┆
  ╰┅┅┅┅┅┅┅┅┅┅┅┅┅╯

❌ Facebook video fetch nahi ho saka

      💠 𝗕𝗢𝗦𝗦-𝗠𝗗 💠`);
    }

    const meta = data.result.metadata || {};
    const dl = data.result.download;

    // HD > SD priority
    const videoUrl = dl.hd || dl.sd;
    const quality = dl.hd ? "HD" : "SD";

    await conn.sendMessage(from, {
      video: { url: videoUrl },
      mimetype: "video/mp4",
      caption:
        `╔═══❖═══❖═══❖═══╗
    ░B░O░S░S░-░M░D░
╚═══❖═══❖═══❖═══╝

  ╭┅┅┅┅┅┅┅┅┅┅┅┅┅╮
  ┆  📱 FACEBOOK  ┆
  ╰┅┅┅┅┅┅┅┅┅┅┅┅┅╯

*|*📘 *Facebook Video*
*|🎬 Quality:* ${quality}
*|⏱ Duration:* ${meta.duration}
*╰━━━━━━━━━━━━━━━━━━⊷*

> © created by BOSS-MD

      💠 𝗕𝗢𝗦𝗦-𝗠𝗗 💠`,
      contextInfo: {
        externalAdReply: {
          title: meta.title || "Facebook Video",
          body: "BOSS-MD Facebook Downloader",
          mediaType: 1
        }
      }
    }, { quoted: m });

    await conn.sendMessage(from, {
      react: { text: "✅", key: m.key }
    });

  } catch (err) {
    console.error("FB-DL ERROR:", err);
    reply(`╔═══❖═══❖═══❖═══╗
    ░B░O░S░S░-░M░D░
╚═══❖═══❖═══❖═══╝

  ╭┅┅┅┅┅┅┅┅┅┅┅┅┅╮
  ┆ ⚠️ ERROR ⚠️  ┆
  ╰┅┅┅┅┅┅┅┅┅┅┅┅┅╯

❌ Error aagaya, thori dair baad try karo

      💠 𝗕𝗢𝗦𝗦-𝗠𝗗 💠`);
  }
});