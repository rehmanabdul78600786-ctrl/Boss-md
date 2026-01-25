const { cmd, commands } = require('../command');
const axios = require('axios');

// ====================== COMMON FUNCTIONS ======================
async function getGreetingMessage(type) {
    const apiEndpoints = {
        chapri: 'https://shizokeys.onrender.com/api/texts/morning?apikey=shizo',
        afternoon: 'https://shizokeys.onrender.com/api/texts/afternoon?apikey=shizo',
        evening: 'https://shizokeys.onrender.com/api/texts/evening?apikey=shizo',
        night: 'https://shizokeys.onrender.com/api/texts/lovenight?apikey=shizo'
    };

    try {
        const response = await axios.get(apiEndpoints[type] || apiEndpoints.night);
        return response.data?.result || null;
    } catch (error) {
        return null;
    }
}

function getFallbackMessage(type) {
    const messages = {
        chapri: [
            "🌅 *Good Morning!* May this day bring you success and happiness. Have a blessed day! 🌞",
            "☀️ *Shubh Prabhat!* Wishing you peace, love, and a productive day ahead. ✨",
            "🌄 *Suprabhat!* Rise and shine! Make today amazing! 🌟",
            "🌤️ *Good Morning!* A new day, new opportunities. Write a beautiful story today! 📖"
        ],
        afternoon: [
            "🌞 *Good Afternoon!* Hope you're having a productive day so far! Keep going! 💪",
            "🕐 *Shubh Dopahar!* Enjoy your lunch and recharge for the rest of the day! 🍽️",
            "☀️ *Afternoon!* The day is halfway done, you're doing great! 🚀",
            "🌇 *Good Afternoon!* Take a break if needed, but don't stop! 🔥"
        ],
        evening: [
            "🌆 *Good Evening!* Time to relax and unwind after a long day! 😌",
            "🌇 *Shubh Sandhya!* May your evening be peaceful and beautiful! ✨",
            "🌃 *Evening!* Wishing you a calm and joyful evening time! 🌟",
            "🌜 *Good Evening!* The sun sets, but your achievements shine bright! 💫"
        ],
        night: [
            "🌙 *Good Night!* May your dreams be sweet and peaceful. Sleep tight! 💫",
            "💤 *Shabakhair!* May angels watch over you as you sleep. Sweet dreams! ✨",
            "😴 *Night night!* Sleep well and wake up refreshed tomorrow. 🌟",
            "🛌 *Sleep tight!* Don't let the bed bugs bite! Good night! 🌙"
        ]
    };
    
    const list = messages[type] || messages.night;
    return list[Math.floor(Math.random() * list.length)];
}

async function sendGreeting(type, conn, mek, m, { from, quoted, q, isGroup, pushName, reply }) {
    try {
        const config = {
            morning: { emoji: "🌅", text: "Good Morning", hindi: "Shubh Prabhat", urdu: "Subah Bakhair" },
            afternoon: { emoji: "🌞", text: "Good Afternoon", hindi: "Shubh Dopahar", urdu: "Dopehar Bakhair" },
            evening: { emoji: "🌆", text: "Good Evening", hindi: "Shubh Sandhya", urdu: "Shaam Bakhair" },
            night: { emoji: "🌙", text: "Good Night", hindi: "Shubh Ratri", urdu: "Shab Bakhair" }
        };
        
        const cfg = config[type];
        const mentionedUsers = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        const isAll = q && q.toLowerCase().includes('all');
        const push = pushName || "Friend";
        
        // Get message
        let greetingMsg = await getGreetingMessage(type);
        if (!greetingMsg) greetingMsg = getFallbackMessage(type);
        
        // Construct message
        let finalMessage = "";
        let mentions = [];
        
        if (mentionedUsers.length > 0) {
            const mentionedNames = mentionedUsers.map(jid => `@${jid.split('@')[0]}`).join(' ');
            mentions = mentionedUsers;
            finalMessage = `${cfg.emoji} *${cfg.text} ${mentionedNames}!* ${cfg.emoji}\n\n${greetingMsg}\n\n_~ From ${push}_`;
        } 
        else if (isAll && isGroup) {
            const groupMembers = m.groupMetadata?.participants || [];
            mentions = groupMembers.map(m => m.id);
            finalMessage = `${cfg.emoji} *${cfg.text} Everyone!* ${cfg.emoji}\n\n${greetingMsg}\n\n_To all group members_\n_~ From ${push}_`;
        }
        else if (quoted && quoted.sender) {
            const quotedNumber = quoted.sender.split('@')[0];
            mentions = [quoted.sender];
            finalMessage = `${cfg.emoji} *${cfg.text} @${quotedNumber}!* ${cfg.emoji}\n\n${greetingMsg}\n\n_~ From ${push}_`;
        }
        else {
            finalMessage = `${cfg.emoji} *${cfg.text} ${push}!* ${cfg.emoji}\n\n${greetingMsg}\n\n✨ *${type === 'morning' ? 'Have a Wonderful Day!' : type === 'night' ? 'Sleep Well!' : 'Enjoy!'}* 🌟`;
        }
        
        // Send message
        if (mentions.length > 0) {
            await conn.sendMessage(from, { text: finalMessage, mentions }, { quoted: mek });
        } else {
            await reply(finalMessage);
        }
        
        // Send sticker (30% chance)
        if (Math.random() < 0.3) {
            try {
                const stickers = {
                    morning: "https://raw.githubusercontent.com/SecktorBot/Botpack/main/goodmorning.gif",
                    afternoon: "https://i.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif",
                    evening: "https://i.giphy.com/media/3o7abAHdYvZdBNnGZq/giphy.gif",
                    night: "https://raw.githubusercontent.com/SecktorBot/Botpack/main/goodnight.gif"
                };
                
                await conn.sendMessage(from, { sticker: { url: stickers[type] } }, { quoted: mek });
            } catch (e) { /* Ignore sticker error */ }
        }
        
    } catch (error) {
        console.error(`${type} greeting error:`, error);
        await reply(`❌ Failed to send ${type} greeting. Try again!`);
    }
}

// ====================== GOOD MORNING COMMAND ======================
cmd({
    pattern: "goodmorning",
    alias: ["gm", "morning", "suprabhat", "shubhprabhat", "subah"],
    react: "🌅",
    desc: "Send beautiful good morning wishes",
    category: "fun",
    use: ".goodmorning [@user/all]",
    filename: __filename
}, async (conn, mek, m, params) => {
    await sendGreeting('morning', conn, mek, m, params);
});

// ====================== GOOD AFTERNOON COMMAND ======================
cmd({
    pattern: "goodafternoon", 
    alias: ["ga", "afternoon", "dopahar", "shubhdopahar"],
    react: "🌞",
    desc: "Send good afternoon greetings",
    category: "fun", 
    use: ".goodafternoon [@user/all]",
    filename: __filename
}, async (conn, mek, m, params) => {
    await sendGreeting('afternoon', conn, mek, m, params);
});

// ====================== GOOD EVENING COMMAND ======================
cmd({
    pattern: "goodevening",
    alias: ["ge", "evening", "sandhya", "shubhsandhya", "shaam"],
    react: "🌆",
    desc: "Send good evening wishes",
    category: "fun",
    use: ".goodevening [@user/all]",
    filename: __filename
}, async (conn, mek, m, params) => {
    await sendGreeting('evening', conn, mek, m, params);
});

// ====================== GOOD NIGHT COMMAND ======================
cmd({
    pattern: "goodnight",
    alias: ["gn", "night", "shabakhair", "ratri", "shubhratri"],
    react: "🌙",
    desc: "Send sweet goodnight messages",
    category: "fun",
    use: ".goodnight [@user/all]",
    filename: __filename
}, async (conn, mek, m, params) => {
    await sendGreeting('night', conn, mek, m, params);
});

// ====================== ALL IN ONE COMMAND ======================
cmd({
    pattern: "greet",
    alias: ["wish", "greeting"],
    react: "👋",
    desc: "Auto greeting based on time or specify type",
    category: "fun",
    use: ".greet [morning/afternoon/evening/night] [@user/all]",
    filename: __filename
}, async (conn, mek, m, { from, quoted, q, isGroup, pushName, reply }) => {
    try {
        const hour = new Date().getHours();
        let type = 'morning';
        
        // Determine type from command or time
        if (q) {
            const qLower = q.toLowerCase();
            if (qLower.includes('morn')) type = 'morning';
            else if (qLower.includes('after') || qLower.includes('dopahar')) type = 'afternoon';
            else if (qLower.includes('even') || qLower.includes('sandhya') || qLower.includes('shaam')) type = 'evening';
            else if (qLower.includes('night') || qLower.includes('ratri') || qLower.includes('shab')) type = 'night';
        } else {
            // Auto detect by time
            if (hour >= 5 && hour < 12) type = 'morning';
            else if (hour >= 12 && hour < 17) type = 'afternoon';
            else if (hour >= 17 && hour < 21) type = 'evening';
            else type = 'night';
        }
        
        // Remove type from q for user mentions
        const cleanQ = q ? q.replace(/morning|afternoon|evening|night|morn|after|even|night|ratri|shab|sandhya|shaam|dopahar/gi, '').trim() : '';
        
        await sendGreeting(type, conn, mek, m, {
            from, quoted, q: cleanQ, isGroup, pushName, reply
        });
        
    } catch (error) {
        console.error("Greet command error:", error);
        await reply("❌ Failed to send greeting. Try .greet morning @user");
    }
});

console.log("✅ Greetings Plugin Loaded: goodmorning, goodafternoon, goodevening, goodnight, greet");
