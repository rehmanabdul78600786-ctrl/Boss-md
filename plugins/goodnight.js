const { cmd, commands } = require('../command');
const axios = require('axios');

cmd({
    pattern: "goodnight",
    alias: ["gn", "night", "shabakhair", "ratri", "shubhratri"],
    react: "😴",
    desc: "Send beautiful goodnight wishes",
    category: "fun",
    use: ".goodnight [@user or 'all']",
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, senderNumber, reply }) => {
    try {
        // Check if user mentioned someone or said "all"
        const mentionedUsers = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        const isAll = q && q.toLowerCase().includes('all');
        
        // Get push name (user's display name)
        const pushName = m.pushName || "Friend";
        
        // Try to get goodnight message from API
        let goodnightMessage = "";
        
        try {
            const apiResponse = await axios.get('https://shizokeys.onrender.com/api/texts/lovenight?apikey=shizo');
            
            if (apiResponse.data && apiResponse.data.result) {
                goodnightMessage = apiResponse.data.result;
            } else {
                throw new Error("Invalid API response");
            }
        } catch (apiError) {
            console.log("API failed, using fallback messages");
            // Fallback messages
            const fallbackMessages = [
                "🌙 *Good night!* May your dreams be filled with joy and peace. Wishing you a restful sleep! 💫",
                "💤 *Shabakhair!* May angels watch over you as you sleep. Have sweet dreams! ✨",
                "😴 *Night night!* Sleep tight and wake up refreshed tomorrow. Sweet dreams! 🌟",
                "🛌 *Sleep well!* May your night be peaceful and your dreams beautiful. Good night! 💖",
                "🌜 *Shubhratri!* Have a peaceful sleep and wake up with new energy. 🌄",
                "🌟 *Good night!* Counting stars for you to have sweet dreams. Sleep tight! ✨",
                "💫 *Nighty night!* Dream of wonderful things and wake up smiling. 😊",
                "🌃 *Rest well!* Tomorrow is a new day full of possibilities. Good night! 🎯"
            ];
            
            goodnightMessage = fallbackMessages[Math.floor(Math.random() * fallbackMessages.length)];
        }
        
        // Construct final message based on conditions
        let finalMessage = "";
        let mentions = [];
        
        if (mentionedUsers.length > 0) {
            // Mention specific users
            const mentionedNames = mentionedUsers.map(jid => {
                const number = jid.split('@')[0];
                return `@${number}`;
            }).join(' ');
            
            mentions = mentionedUsers;
            finalMessage = `💤 *Good Night ${mentionedNames}!* 🌙\n\n${goodnightMessage}\n\n_~ From ${pushName}_`;
            
        } else if (isAll && isGroup) {
            // Wish everyone in group
            const groupMembers = m.groupMetadata?.participants || [];
            const memberMentions = groupMembers.map(member => `@${member.id.split('@')[0]}`).join(' ');
            
            mentions = groupMembers.map(m => m.id);
            finalMessage = `💤 *Good Night Everyone!* 🌙\n\n${goodnightMessage}\n\n_To all members of this group_\n_~ From ${pushName}_`;
            
        } else if (quoted && quoted.sender) {
            // Reply to quoted message
            const quotedNumber = quoted.sender.split('@')[0];
            mentions = [quoted.sender];
            finalMessage = `💤 *Good Night @${quotedNumber}!* 🌙\n\n${goodnightMessage}\n\n_~ From ${pushName}_`;
            
        } else {
            // Personal goodnight
            finalMessage = `💤 *Good Night ${pushName}!* 🌙\n\n${goodnightMessage}\n\n😴 *Sleep Well & Sweet Dreams!* 🌟`;
        }
        
        // Send the message
        if (mentions.length > 0) {
            await conn.sendMessage(from, {
                text: finalMessage,
                mentions: mentions
            }, { quoted: mek });
        } else {
            await reply(finalMessage);
        }
        
        // Optional: Send a goodnight sticker (60% chance)
        if (Math.random() < 0.6) {
            try {
                const stickerUrls = [
                    "https://raw.githubusercontent.com/SecktorBot/Botpack/main/goodnight.gif",
                    "https://i.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif",
                    "https://i.giphy.com/media/3o7abAHdYvZdBNnGZq/giphy.gif"
                ];
                
                const randomSticker = stickerUrls[Math.floor(Math.random() * stickerUrls.length)];
                
                await conn.sendMessage(from, {
                    sticker: { url: randomSticker }
                }, { quoted: mek });
            } catch (stickerError) {
                console.log("Sticker send failed, continuing...");
            }
        }
        
    } catch (error) {
        console.error("Goodnight command error:", error);
        await reply("❌ *Oops!* Failed to send goodnight wishes. Please try again later!");
    }
});
