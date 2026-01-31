const axios = require("axios");
const fs = require("fs");
const path = require("path");

cmd({
  pattern: "mod",
  desc: "Download & send MOD WhatsApp APK with thumbnail",
  category: "downloader",
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  try {
    await reply("⏳ *MOD WhatsApp APK aa rahi hai...*");

    // API (status check)
    const apiUrl = "https://arslan-apis.vercel.app/download/modwhatsappdl?url=https://apkdon.net/fouad-whatsapp/";
    const apiRes = await axios.get(apiUrl);
    if (!apiRes.data || apiRes.data.status !== true) {
      return reply("❌ *API response error*");
    }

    // APK download
    const apkUrl = "https://apkdon.net/fouad-whatsapp/";
    const apkRes = await axios.get(apkUrl, { responseType: "arraybuffer" });

    const filePath = path.join(__dirname, "Fouad_WhatsApp_MOD.apk");
    fs.writeFileSync(filePath, apkRes.data);

    // Thumbnail (safe image)
    const thumbUrl = "https://i.imgur.com/9QZ7K6x.jpg";
    const thumbRes = await axios.get(thumbUrl, { responseType: "arraybuffer" });
    const thumbnail = Buffer.from(thumbRes.data);

    // Send document with thumbnail
    await conn.sendMessage(from, {
      document: fs.readFileSync(filePath),
      mimetype: "application/vnd.android.package-archive",
      fileName: "Fouad_WhatsApp_MOD.apk",
      jpegThumbnail: thumbnail,
      caption:
`📦 *Fouad WhatsApp MOD*
⚡ Fast Document Send
👨‍💻 API: @Arslan-MD

⚠️ Install at your own risk`
    }, { quoted: mek });

    fs.unlinkSync(filePath);

  } catch (e) {
    console.log(e);
    reply("❌ *Error aa gaya, dobara try karo*");
  }
});
