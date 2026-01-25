const { cmd } = require('../command')
const axios = require('axios')
const yts = require('yt-search')
const fs = require('fs')
const path = require('path')
const FormData = require('form-data')

cmd({
    pattern: "song",
    alias: ["play"],
    desc: "Play song with audd.io recognition feature",
    category: "download",
    react: "🎵",
    filename: __filename,
    use: '<song name> or reply to audio with .song'
}, async (conn, mek, m, { from, reply, text, isQuoted, quoted }) => {
    try {
        // ================== MODE 1: AUDIO RECOGNITION (Shazam Style) ==================
        if (isQuoted && quoted.message && quoted.message.audioMessage) {
            await reply("🎵 *Recognizing song... Please wait!*");
            
            try {
                // Download the audio
                const audioBuffer = await conn.downloadMediaMessage(quoted);
                const tempDir = path.join(__dirname, '../temp');
                if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
                
                const tempFile = path.join(tempDir, `recog_${Date.now()}.mp3`);
                fs.writeFileSync(tempFile, audioBuffer);
                
                // Upload to temporary URL (using anonymous file sharing)
                const form = new FormData();
                form.append('files[]', fs.createReadStream(tempFile));
                
                const uploadRes = await axios.post('https://uguu.se/upload.php', form, {
                    headers: form.getHeaders()
                });
                
                const audioUrl = uploadRes.data.files[0].url;
                
                // Call audd.io API
                const auddForm = new FormData();
                auddForm.append('url', audioUrl);
                auddForm.append('return', 'apple_music,spotify,deezer');
                auddForm.append('api_token', 'your_api_token_here'); // Replace with your token
                
                const auddRes = await axios.post('https://api.audd.io/', auddForm, {
                    headers: auddForm.getHeaders()
                });
                
                // Clean temp file
                fs.unlinkSync(tempFile);
                
                if (auddRes.data.status === 'success' && auddRes.data.result) {
                    const song = auddRes.data.result;
                    
                    let caption = `
╭─❖ *🎵 SONG RECOGNIZED* ❖─╮
│
│ *🎶 Title:* ${song.title}
│ *👨‍🎤 Artist:* ${song.artist}
│ *💽 Album:* ${song.album || 'Unknown'}
│ *📅 Release:* ${song.release_date || 'Unknown'}
│ *⏱️ Duration:* ${song.timecode || 'Unknown'}
│
╰─❖─────────────❖─╯

`;
                    
                    // Add links if available
                    if (song.apple_music) {
                        caption += `*🍎 Apple Music:* ${song.apple_music.url}\n`;
                    }
                    if (song.spotify) {
                        caption += `*🎧 Spotify:* ${song.spotify.external_urls.spotify}\n`;
                    }
                    
                    caption += `\n🔍 _Powered by BOSS-MD + audd.io_`;
                    
                    // Send song info
                    await conn.sendMessage(from, {
                        text: caption,
                        contextInfo: {
                            externalAdReply: {
                                title: song.title.length > 25 ? `${song.title.substring(0, 22)}...` : song.title,
                                body: `By ${song.artist}`,
                                thumbnailUrl: song.spotify?.album?.images?.[0]?.url || song.apple_music?.artwork?.url || 'https://i.ibb.co/0jqBQ8W/music.jpg',
                                sourceUrl: song.spotify?.external_urls?.spotify || song.apple_music?.url || '',
                                mediaType: 1,
                                showAdAttribution: false
                            }
                        }
                    }, { quoted: mek });
                    
                    // Ask if user wants to download this song
                    await conn.sendMessage(from, {
                        text: `🎯 *Want to download this song?*\nType: *.song ${song.title} ${song.artist}*`
                    }, { quoted: mek });
                    
                    return;
                    
                } else {
                    return reply("❌ *Could not recognize the song!*\nMake sure the audio is clear and has vocals.");
                }
                
            } catch (recogError) {
                console.error("Recognition Error:", recogError);
                return reply("❌ *Recognition failed!* Trying normal song download...");
            }
        }
        
        // ================== MODE 2: NORMAL SONG DOWNLOAD ==================
        if (!text) return reply("❌ *Song name likho*\nExample: *.song pal pal*\nOr reply to audio for recognition");
        
        // 🔍 Search
        const search = await yts(text);
        if (!search.videos.length) return reply("❌ *Song nahi mila*");
        
        const video = search.videos[0];
        const title = video.title;
        const duration = video.timestamp;
        const thumb = video.thumbnail;
        const ytUrl = video.url;
        
        // 🎧 Info box
        await conn.sendMessage(from, {
            image: { url: thumb },
            caption: `
╭─❖ *🎵 SONG FOUND* ❖─╮
│
│ *🎶 Title:* ${title}
│ *⏱️ Duration:* ${duration}
│ *👤 Channel:* ${video.author.name}
│ *👁️ Views:* ${video.views}
│
│ *⬇️ Downloading MP3...*
│
╰─❖─────────────❖─╯
🔍 _Powered by BOSS-MD_
`
        }, { quoted: mek });
        
        // 🎼 Try multiple APIs (fallback system)
        let audioUrl = null;
        let apiUsed = "";
        
        const apis = [
            {
                name: "API 1",
                url: `https://api.dhamzxploit.my.id/api/ytplay?query=${encodeURIComponent(text)}`
            },
            {
                name: "API 2",
                url: `https://api.erdwpe.com/api/download/ytplay?query=${encodeURIComponent(text)}`
            },
            {
                name: "Direct",
                url: `https://yt-api.cyclic.app/audio?id=${video.videoId}`
            }
        ];
        
        for (let api of apis) {
            try {
                const res = await axios.get(api.url, { timeout: 10000 });
                if (api.name === "API 1" && res.data?.result?.url) {
                    audioUrl = res.data.result.url;
                    apiUsed = api.name;
                    break;
                } else if (api.name === "API 2" && res.data?.result?.audio) {
                    audioUrl = res.data.result.audio;
                    apiUsed = api.name;
                    break;
                } else if (api.name === "Direct" && res.data) {
                    // Direct audio buffer
                    const tempDir = path.join(__dirname, '../temp');
                    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
                    
                    const tempFile = path.join(tempDir, `song_${Date.now()}.mp3`);
                    fs.writeFileSync(tempFile, Buffer.from(res.data));
                    
                    // Send audio
                    await conn.sendMessage(from, {
                        audio: fs.readFileSync(tempFile),
                        mimetype: "audio/mpeg",
                        fileName: `${title.substring(0, 50)}.mp3`,
                        caption: `🎵 *${title}*\n⏱️ ${duration}\n🔧 Direct API\n\n🎯 _BOSS-MD_`
                    }, { quoted: mek });
                    
                    // Cleanup
                    fs.unlinkSync(tempFile);
                    return;
                }
            } catch (apiError) {
                console.log(`${api.name} failed:`, apiError.message);
                continue;
            }
        }
        
        if (!audioUrl) {
            // Last resort: Send YouTube link
            return conn.sendMessage(from, {
                text: `🎵 *${title}*\n\n📥 *Download Links:*\n• https://youtubepp.com/watch?v=${video.videoId}\n• https://ytmp3.nu/${video.videoId}/\n\n🎯 _Use these sites to download_`
            }, { quoted: mek });
        }
        
        // 📥 Download and send audio
        await reply("⬇️ *Downloading audio...*");
        
        const audioRes = await axios.get(audioUrl, { 
            responseType: 'arraybuffer',
            timeout: 60000 
        });
        
        const audioBuffer = Buffer.from(audioRes.data);
        const fileSize = (audioBuffer.length / (1024 * 1024)).toFixed(2);
        
        if (audioBuffer.length > 16 * 1024 * 1024) {
            return reply(`❌ *File too large!* (${fileSize}MB)\nWhatsApp limit: 16MB`);
        }
        
        // 📤 Send audio
        await conn.sendMessage(from, {
            audio: audioBuffer,
            mimetype: "audio/mpeg",
            fileName: `${title.substring(0, 50)}.mp3`,
            caption: `🎵 *${title}*\n⏱️ ${duration}\n📦 ${fileSize}MB\n🔧 ${apiUsed}\n\n🎯 _BOSS-MD_`
        }, { quoted: mek });
        
    } catch (e) {
        console.error("Song Plugin Error:", e);
        reply("❌ *Error!* " + (e.message || "Something went wrong"));
    }
});
