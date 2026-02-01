const { cmd } = require('../command');
const yts = require('yt-search');
const axios = require('axios');

// 🔑 API KEY (ADD)
const ARSLAN_API_KEY = "PR7jQ4_i6-9E3eJlRiFN92ruEyxeiSBFkk9ta-Ca0bA";

cmd({
    pattern: "play",
    alias: ["song", "audio"],
    react: "🎵",
    desc: "YouTube search & MP3 play",
    category: "download",
    use: ".play <song name>",
    filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
    try {
        const query = args.join(" ");
        if (!query) return reply("❌ Bhai song name likho");

        await conn.sendMessage(from, { react: { text: "⏳", key: m.key } });

        // 🔍 YouTube search
        const search = await yts(query);
        if (!search.videos || !search.videos.length) {
            return reply("❌ Koi result nahi mila");
        }

        const video = search.videos[0];

        // 🎧 YTMP3 API (FIXED ENDPOINT + KEY)
        const apiUrl =
            `https://arslan-apis.vercel.app/more/ytmp3?` +
            `url=${encodeURIComponent(video.url)}` +
            `&apikey=${ARSLAN_API_KEY}`;

        const res = await axios.get(apiUrl, { timeout: 60000 });

        // 🧪 DEBUG (ADD – kuch delete nahi)
        console.log("YTMP3 API RESPONSE:", res.data);

        if (
            !res.data ||
            res.data.status !== true ||
            !res.data.result ||
            !res.data.result.download ||
            !res.data.result.download.url
        ) {
            return reply("❌ DO NOT GENERATED AUDIO");
        }

        const dlUrl = res.data.result.download.url;
        const meta = res.data.result.metadata || {};
        const quality = res.data.result.download.quality || "128kbps";

        // 🖼️ Thumbnail + details PEHLE
        await conn.sendMessage(from, {
            image: { url: meta.thumbnail || video.thumbnail },
            caption:
                `🎵 *${meta.title || video.title}*\n` +
                `⏱️ ${video.timestamp}\n` +
                `🎚️ Quality: ${quality}\n\n` +
                `> © 𝘽𝙊𝙎𝙎-𝙈𝘿`
        }, { quoted: mek });

        // 🎧 AUDIO SEND (NO DELAY)
        await conn.sendMessage(from, {
            audio: { url: dlUrl },
            mimetype: "audio/mpeg",
            ptt: false,
            fileName: `${(meta.title || video.title).replace(/[^\w\s]/gi, '')}.mp3`
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: "✅", key: m.key } });

    } catch (err) {
        console.error("PLAY ERROR:", err);
        reply("❌ Bhai error aa gaya bc, baad me try karo");
        await conn.sendMessage(from, { react: { text: "❌", key: m.key } });
    }
});