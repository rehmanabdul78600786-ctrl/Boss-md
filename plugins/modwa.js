const { cmd } = require('../command');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

cmd({
    pattern: "modwa",
    react: "📦",
    desc: "Download & send MOD WhatsApp APK",
    category: "download",
    use: ".modwa",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        await reply("⏳ *MOD WhatsApp APK tayar ki ja rahi hai bc...*");

        // ✅ Direct APK link (stable)
        const apkUrl = "https://apkdon.net/fouad-whatsapp/";
        const apkRes = await axios.get(apkUrl, {
            responseType: "arraybuffer",
            timeout: 120000
        });

        const filePath = path.join(__dirname, "Fouad_WhatsApp_MOD.apk");
        fs.writeFileSync(filePath, apkRes.data);

        // ✅ Thumbnail
        const thumbUrl = "https://i.imgur.com/9QZ7K6x.jpg";
        const thumb = await axios.get(thumbUrl, { responseType: "arraybuffer" });

        // ✅ Send APK as DOCUMENT
        await conn.sendMessage(from, {
            document: fs.readFileSync(filePath),
            mimetype: "application/vnd.android.package-archive",
            fileName: "Fouad_WhatsApp_MOD.apk",
            jpegThumbnail: thumb.data,
            caption:
`📦 *Fouad WhatsApp MOD*
⚡ Fast Document Send

⚠️ Install at your own risk`
        }, { quoted: mek });

        fs.unlinkSync(filePath);

        await conn.sendMessage(from, { react: { text: "✅", key: m.key } });

    } catch (err) {
        console.log("MODWA ERROR:", err);
        reply("❌ Bhai APK send nahi ho saki, baad mein try karo");
        await conn.sendMessage(from, { react: { text: "❌", key: m.key } });
    }
});
