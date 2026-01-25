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
        const videoId = video.videoId;
        
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
        
        // 🎼 FIXED PART: Now it will send MP3 file, not link
        let audioBuffer = null;
        let fileSizeMB = "0";
        
        // Try multiple methods to get MP3
        const methods = [
            // Method 1: Direct MP3 URL
            async () => {
                try {
                    const mp3Url = `https://ytmp3.andriyantoday.repl.co/ytmp3?url=https://www.youtube.com/watch?v=${videoId}`;
                    const response = await axios.get(mp3Url, {
                        responseType: 'arraybuffer',
                        timeout: 60000
                    });
                    return Buffer.from(response.data);
                } catch (e) {
                    console.log("Method 1 failed:", e.message);
                    return null;
                }
            },
            
            // Method 2: API 1
            async () => {
                try {
                    const apiRes = await axios.get(`https://api.dhamzxploit.my.id/api/ytplay?query=${encodeURIComponent(text)}`, {
                        timeout: 15000
                    });
                    if (apiRes.data?.result?.url) {
                        const audioRes = await axios.get(apiRes.data.result.url, {
                            responseType: 'arraybuffer',
                            timeout: 60000
                        });
                        return Buffer.from(audioRes.data);
                    }
                } catch (e) {
                    console.log("Method 2 failed:", e.message);
                }
                return null;
            },
            
            // Method 3: Direct API
            async () => {
                try {
                    const audioRes = await axios.get(`https://yt-api.cyclic.app/audio?id=${videoId}`, {
                        responseType: 'arraybuffer',
                        timeout: 60000
                    });
                    return Buffer.from(audioRes.data);
                } catch (e) {
                    console.log("Method 3 failed:", e.message);
                    return null;
                }
            },
            
            // Method 4: YouTube MP3 Converter
            async () => {
                try {
                    const apiRes = await axios.get(`https://api.agriyan.lol/ytaudio?url=https://youtube.com/watch?v=${videoId}`);
                    if (apiRes.data?.result?.url) {
                        const audioRes = await axios.get(apiRes.data.result.url, {
                            responseType: 'arraybuffer',
                            timeout: 60000
                        });
                        return Buffer.from(audioRes.data);
                    }
                } catch (e) {
                    console.log("Method 4 failed:", e.message);
                }
                return null;
            }
        ];
        
        // Try all methods
        for (let method of methods) {
            try {
                audioBuffer = await method();
                if (audioBuffer) {
                    fileSizeMB = (audioBuffer.length / (1024 * 1024)).toFixed(2);
                    console.log("✅ MP3 downloaded successfully!");
                    break;
                }
            } catch (error) {
                console.log("Method failed:", error.message);
                continue;
            }
        }
        
        // If we got MP3 buffer, send it
        if (audioBuffer) {
            // Check file size limit
            if (audioBuffer.length > 16 * 1024 * 1024) {
                return reply(`❌ *File too large!* (${fileSizeMB}MB)\nWhatsApp limit: 16MB`);
            }
            
            // 📤 Send MP3 file
            await conn.sendMessage(from, {
                audio: audioBuffer,
                mimetype: "audio/mpeg",
                fileName: `${title.substring(0, 50)}.mp3`,
                caption: `🎵 *${title}*\n⏱️ ${duration}\n📦 ${fileSizeMB}MB\n\n✅ _BOSS-MD_`
            }, { quoted: mek });
            
            return;
        }
        
        // If all methods failed, use direct URL method (WhatsApp will download)
        await reply("🔄 *Using direct download method...*");
        
        await conn.sendMessage(from, {
            audio: { url: `https://www.youtubepp.com/watch?v=${videoId}` },
            mimetype: 'audio/mpeg',
            fileName: `${title}.mp3`,
            caption: `🎵 *${title}*\n⏱️ ${duration}\n\n✅ *Direct download via BOSS-MD*`
        }, { quoted: mek });
        
    } catch (e) {
        console.error("Song Plugin Error:", e);
        reply("❌ *Error!* " + (e.message || "Something went wrong"));
    }
});
