const { cmd } = require('../command')
const axios = require('axios')
const yts = require('yt-search')
const fs = require('fs')
const path = require('path')
const ffmpeg = require('fluent-ffmpeg')
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path

ffmpeg.setFfmpegPath(ffmpegPath)

cmd({
    pattern: "song",
    alias: ["play"],
    desc: "Play song with FFmpeg fixed audio",
    category: "download",
    react: "🎵",
    filename: __filename
}, async (conn, mek, m, { from, reply, text }) => {
    try {
        if (!text) return reply("❌ Song name likho\nExample: .song pal pal")

        // 🔍 Search
        const search = await yts(text)
        if (!search.videos.length) return reply("❌ Song nahi mila")

        const video = search.videos[0]
        const title = video.title
        const duration = video.timestamp
        const thumb = video.thumbnail
        const ytUrl = video.url

        // 🎧 Info box
        await conn.sendMessage(from, {
            image: { url: thumb },
            caption: `
╭───────────────────
│ 🎧 *SONG FOUND*
│
│ 🎵 *Title:* ${title}
│ ⏱️ *Duration:* ${duration}
│
│ ⏳ *Converting to MP3...*
╰───────────────────
- _Powered by_ 𝘽𝙊𝙎𝙎-𝙈𝘿
`
        }, { quoted: mek })

        // 🎼 API (same wali jo tum use kar rahe ho)
        const api = `https://edith-apis.vercel.app/download/ytmp3?url=${encodeURIComponent(ytUrl)}`
        const res = await axios.get(api)

        if (!res.data || !res.data.result)
            return reply("❌ MP3 link nahi mila")

        const audioUrl = res.data.result

        // 📁 temp paths
        const tempDir = path.join(__dirname, '../temp')
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir)

        const input = path.join(tempDir, `input_${Date.now()}.mp3`)
        const output = path.join(tempDir, `output_${Date.now()}.mp3`)

        // 📥 download audio
        const audioData = await axios.get(audioUrl, { responseType: 'arraybuffer' })
        fs.writeFileSync(input, audioData.data)

        // 🔥 FFmpeg FIX (IMPORTANT PART)
        await new Promise((resolve, reject) => {
            ffmpeg(input)
                .audioCodec('libmp3lame')
                .audioBitrate('128k')
                .audioChannels(2)
                .audioFrequency(44100)
                .format('mp3')
                .on('end', resolve)
                .on('error', reject)
                .save(output)
        })

        // 📤 send audio
        await conn.sendMessage(from, {
            audio: fs.readFileSync(output),
            mimetype: "audio/mpeg",
            fileName: `${title}.mp3`
        }, { quoted: mek })

        // 🧹 cleanup
        fs.unlinkSync(input)
        fs.unlinkSync(output)

    } catch (e) {
        console.log(e)
        reply("❌ Song convert/download error")
    }
})
