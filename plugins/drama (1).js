const { cmd } = require('../command');
const axios = require('axios');
const yts = require('yt-search');

const AXIOS = axios.create({
    timeout: 60000,
    headers: { 'User-Agent': 'Mozilla/5.0' }
});

// 🔹 WORKING ARSLAN API
async function fetchVideo(url) {
    const api = `https://arslan-apis.vercel.app/download/ytmp4?url=${encodeURIComponent(url)}`;
    const res = await AXIOS.get(api);

    if (
        res.data?.status &&
        res.data?.result?.status &&
        res.data?.result?.download?.url
    ) {
        return {
            url: res.data.result.download.url,
            title: res.data.result.metadata.title,
            thumb: res.data.result.metadata.thumbnail,
            quality: res.data.result.download.quality || "720p"
        };
    }
    throw new Error("API failed");
}

cmd({
    pattern: "drama",
    react: "🎬",
    desc: "Drama / YouTube download (video or document)",
    category: "download",
    filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
    try {
        if (args.length < 2)
            return reply("❌ Use: .drama video <name>  OR  .drama doc <name>");

        const mode = args[0].toLowerCase(); // video | doc
        const query = args.slice(1).join(" ");

        await conn.sendMessage(from, { react: { text: "⏳", key: m.key } });

        let video;
        if (query.startsWith("http")) {
            video = { url: query };
        } else {
            const search = await yts(query);
            if (!search.videos.length) return reply("❌ No result found");
            video = search.videos[0];
        }

        const data = await fetchVideo(video.url);

        const caption =
`┌─⭓ *𝘽𝙊𝙎𝙎-𝙈𝘿* ⭓
│
│ 🎬 *${data.title}*
│ 🎞 Quality: ${data.quality}
│ 📥 Mode: ${mode === "doc" ? "Document" : "Video"}
│
└─────────────
© Powered by Arslan-MD`;

        const messageData = mode === "doc"
            ? {
                document: { url: data.url },
                mimetype: "video/mp4",
                fileName: `${data.title}.mp4`,
                caption
            }
            : {
                video: { url: data.url },
                mimetype: "video/mp4",
                caption
            };

        await conn.sendMessage(from, {
            ...messageData,
            contextInfo: {
                externalAdReply: {
                    title: data.title,
                    body: "YouTube Video",
                    thumbnailUrl: data.thumb,
                    sourceUrl: video.url,
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: "✅", key: m.key } });

    } catch (e) {
        console.log(e);
        reply("❌ Bhai download nahi ho saka");
        await conn.sendMessage(from, { react: { text: "❌", key: m.key } });
    }
});
