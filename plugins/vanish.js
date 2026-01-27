const { cmd } = require('../command');

cmd({
    pattern: "disappear",
    alias: ["ephemeral", "tempmsg", "ghost", "vanishing"],
    desc: "Send disappearing messages that auto-delete",
    category: "fun",
    react: "👻",
    filename: __filename,
    use: ".disappear [seconds] [message] OR reply to message"
}, async (conn, mek, m, { from, reply, text, quoted, pushName }) => {
    try {
        const args = text.split(' ');
        let seconds = 604800; // Default: 7 days (WhatsApp max)
        let message = '';
        
        // Parse time and message
        if (args.length > 0) {
            // Check if first arg is a number (seconds)
            if (!isNaN(args[0]) && parseInt(args[0]) > 0) {
                seconds = parseInt(args[0]);
                
                // WhatsApp limits: min 24 hours (86400s), max 7 days (604800s)
                if (seconds < 86400) seconds = 86400;
                if (seconds > 604800) seconds = 604800;
                
                message = args.slice(1).join(' ');
            } else {
                message = text;
            }
        }
        
        // Convert seconds to readable time
        const timeText = getTimeText(seconds);
        
        // If quoted message, make it disappear
        if (quoted && quoted.message) {
            try {
                // Create disappearing message
                await conn.sendMessage(from, {
                    text: `👻 *DISAPPEARING MESSAGE*\n\n${quoted.message.conversation || quoted.message.extendedTextMessage?.text || "Message"}\n\n⏰ _This message will disappear in ${timeText}_`,
                    ephemeralMessage: {
                        duration: seconds
                    }
                }, { quoted: mek });
                
                // React with ghost
                await conn.sendMessage(from, {
                    react: { text: "👻", key: mek.key }
                });
                
                return;
            } catch (error) {
                console.error("Disappear error:", error);
            }
        }
        
        // If message provided, send new disappearing message
        if (message) {
            await conn.sendMessage(from, {
                text: `👻 *DISAPPEARING MESSAGE*\n\n${message}\n\n⏰ _This message will disappear in ${timeText}_`,
                ephemeralMessage: {
                    duration: seconds
                }
            }, { quoted: mek });
            
            await conn.sendMessage(from, {
                react: { text: "👻", key: mek.key }
            });
            
        } else {
            // Show help
            await reply(`👻 *Disappear Message*\n\n• Reply to any message with: .disappear\n• Send new: .disappear [seconds] [message]\n\n⏰ *Time options:*\n• 86400s = 24 hours (minimum)\n• 172800s = 2 days\n• 604800s = 7 days (maximum)\n\n📌 *Example:* .disappear 86400 Hello!`);
        }
        
    } catch (error) {
        console.error("Disappear plugin error:", error);
        await reply("❌ Failed to create disappearing message");
    }
});

// ==================== VANISHING IMAGE ====================
cmd({
    pattern: "ghostpic",
    alias: ["vanishpic", "tempimage", "disappearpic"],
    desc: "Send disappearing image",
    category: "fun",
    react: "🖼️👻",
    filename: __filename,
    use: ".ghostpic [seconds] [image-url] OR reply to image"
}, async (conn, mek, m, { from, reply, text, quoted, pushName }) => {
    try {
        const args = text.split(' ');
        let seconds = 86400; // Default: 24 hours
        
        if (args.length > 0 && !isNaN(args[0])) {
            seconds = parseInt(args[0]);
            if (seconds < 86400) seconds = 86400;
            if (seconds > 604800) seconds = 604800;
        }
        
        const timeText = getTimeText(seconds);
        
        // If quoted image, make it disappear
        if (quoted && quoted.message && quoted.message.imageMessage) {
            try {
                const imageBuffer = await conn.downloadMediaMessage(quoted);
                
                await conn.sendMessage(from, {
                    image: imageBuffer,
                    caption: `🖼️👻 *DISAPPEARING IMAGE*\n\nThis image will disappear in ${timeText}`,
                    ephemeralMessage: {
                        duration: seconds
                    }
                }, { quoted: mek });
                
                await conn.sendMessage(from, {
                    react: { text: "👻", key: mek.key }
                });
                
            } catch (error) {
                console.error("Ghostpic error:", error);
                await reply("❌ Failed to create disappearing image");
            }
            return;
        }
        
        // Send help
        await reply(`🖼️👻 *Disappearing Image*\n\n• Reply to any image with: .ghostpic\n• Or: .ghostpic [seconds]\n\n⏰ Image will disappear in ${timeText}`);
        
    } catch (error) {
        console.error("Ghostpic plugin error:", error);
        await reply("❌ Failed to create disappearing image");
    }
});

// ==================== VANISHING VIDEO ====================
cmd({
    pattern: "ghostvideo",
    alias: ["vanishvideo", "tempvideo", "disappearvideo"],
    desc: "Send disappearing video",
    category: "fun",
    react: "🎬👻",
    filename: __filename,
    use: ".ghostvideo [seconds] OR reply to video"
}, async (conn, mek, m, { from, reply, quoted, pushName }) => {
    try {
        const seconds = 86400; // 24 hours
        const timeText = getTimeText(seconds);
        
        if (quoted && quoted.message && quoted.message.videoMessage) {
            const videoBuffer = await conn.downloadMediaMessage(quoted);
            
            await conn.sendMessage(from, {
                video: videoBuffer,
                caption: `🎬👻 *DISAPPEARING VIDEO*\n\nThis video will disappear in ${timeText}`,
                ephemeralMessage: {
                    duration: seconds
                }
            }, { quoted: mek });
            
            await conn.sendMessage(from, {
                react: { text: "👻", key: mek.key }
            });
            
        } else {
            await reply(`🎬👻 *Disappearing Video*\n\n• Reply to any video with: .ghostvideo\n\n⏰ Video will disappear in ${timeText}`);
        }
        
    } catch (error) {
        console.error("Ghostvideo error:", error);
        await reply("❌ Failed to create disappearing video");
    }
});

// ==================== SELF-DESTRUCT NOTE ====================
cmd({
    pattern: "bomb",
    alias: ["selfdestruct", "timer", "timebomb"],
    desc: "Create self-destruct timer message",
    category: "fun",
    react: "💣",
    filename: __filename,
    use: ".bomb [seconds] [message]"
}, async (conn, mek, m, { from, reply, text, pushName }) => {
    try {
        const args = text.split(' ');
        let seconds = 60; // Default: 1 minute
        let message = '';
        
        if (args.length > 0) {
            if (!isNaN(args[0]) && parseInt(args[0]) > 0) {
                seconds = parseInt(args[0]);
                if (seconds > 3600) seconds = 3600; // Max 1 hour
                message = args.slice(1).join(' ');
            } else {
                seconds = 60;
                message = text;
            }
        }
        
        if (!message) {
            return reply(`💣 *Self-Destruct Message*\n\nUsage: .bomb [seconds] [message]\n\n📌 *Example:* .bomb 30 This will explode in 30 seconds!\n⏰ *Max:* 3600 seconds (1 hour)`);
        }
        
        // Send the bomb message
        const bombMsg = await conn.sendMessage(from, {
            text: `💣 *SELF-DESTRUCT ACTIVATED*\n\n${message}\n\n⏳ *Exploding in ${seconds} seconds...*\n🚨 _This message will be deleted automatically_`
        }, { quoted: mek });
        
        // Set timer to delete
        setTimeout(async () => {
            try {
                await conn.sendMessage(from, {
                    delete: {
                        id: bombMsg.key.id,
                        remoteJid: from,
                        fromMe: true
                    }
                });
                
                // Send explosion effect
                await conn.sendMessage(from, {
                    text: `💥💥💥 *BOOM!*\n\nMessage self-destructed after ${seconds} seconds!`
                });
                
            } catch (deleteError) {
                console.error("Delete error:", deleteError);
            }
        }, seconds * 1000);
        
        await conn.sendMessage(from, {
            react: { text: "💣", key: mek.key }
        });
        
    } catch (error) {
        console.error("Bomb plugin error:", error);
        await reply("❌ Failed to create time bomb");
    }
});

// ==================== VANISHING POLL ====================
cmd({
    pattern: "ghostpoll",
    alias: ["vanishpoll", "temppoll", "disappearpoll"],
    desc: "Create disappearing poll",
    category: "fun",
    react: "📊👻",
    filename: __filename,
    use: ".ghostpoll [question] | [option1] | [option2] | [option3]"
}, async (conn, mek, m, { from, reply, text }) => {
    try {
        if (!text || !text.includes('|')) {
            return reply(`📊👻 *Disappearing Poll*\n\nUsage: .ghostpoll [question] | [option1] | [option2] | [option3]\n\n📌 *Example:* .ghostpoll Best fruit? | Apple | Banana | Orange\n⏰ Poll disappears in 24 hours`);
        }
        
        const parts = text.split('|').map(p => p.trim());
        const question = parts[0];
        const options = parts.slice(1, 4); // Max 3 options
        
        if (options.length < 2) {
            return reply("❌ Minimum 2 options required");
        }
        
        await conn.sendMessage(from, {
            poll: {
                name: `👻 ${question}`,
                values: options,
                ephemeralMessage: {
                    duration: 86400 // 24 hours
                }
            }
        }, { quoted: mek });
        
        await conn.sendMessage(from, {
            react: { text: "👻", key: mek.key }
        });
        
    } catch (error) {
        console.error("Ghostpoll error:", error);
        await reply("❌ Failed to create disappearing poll");
    }
});

// ==================== HELPER FUNCTION ====================
function getTimeText(seconds) {
    if (seconds >= 86400) {
        const days = seconds / 86400;
        return `${days} ${days === 1 ? 'day' : 'days'}`;
    } else if (seconds >= 3600) {
        const hours = seconds / 3600;
        return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
    } else {
        const minutes = seconds / 60;
        return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
    }
}

// ==================== HELP COMMAND ====================
cmd({
    pattern: "vanishing",
    alias: ["ghosthelp", "disappearhelp"],
    desc: "Show all vanishing message commands",
    category: "fun",
    react: "👻",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    const helpText = `
👻 *VANISHING MESSAGES COMMANDS*

📝 *Text Messages:*
• .disappear [time] [message]
• .disappear (reply to message)

🖼️ *Images:*
• .ghostpic [time] (reply to image)

🎬 *Videos:*
• .ghostvideo (reply to video)

💣 *Self-Destruct:*
• .bomb [seconds] [message]

📊 *Polls:*
• .ghostpoll [Q] | [A] | [B] | [C]

⏰ *Time Formats:*
• 86400s = 24 hours (min)
• 172800s = 2 days
• 604800s = 7 days (max)

📌 *Note:* Works best with latest WhatsApp
✅ *Requires:* Ephemeral messages enabled`;

    await reply(helpText);
});

console.log("👻 Vanishing Messages Plugin Loaded!");
