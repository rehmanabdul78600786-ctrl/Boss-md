const { cmd } = require('../command');
const axios = require('axios');

// ==================== MEME COMMAND ====================
cmd({
    pattern: "meme",
    alias: ["funny", "jokes"],
    desc: "Get random funny memes",
    category: "fun",
    react: "😂",
    filename: __filename,
    use: ".meme [category]"
}, async (conn, mek, m, { from, reply, text }) => {
    try {
        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });
        
        const categories = ['dankmemes', 'wholesomememes', 'memes', 'funny'];
        const category = text || categories[Math.floor(Math.random() * categories.length)];
        
        // Try multiple meme APIs
        const memeAPIs = [
            "https://meme-api.com/gimme/" + category,
            "https://meme-api.herokuapp.com/gimme/" + category,
            "https://api.imgflip.com/get_memes"
        ];
        
        let memeData = null;
        
        for (let api of memeAPIs) {
            try {
                const response = await axios.get(api, { timeout: 10000 });
                
                if (api.includes('imgflip')) {
                    if (response.data?.success) {
                        const memes = response.data.data.memes;
                        const randomMeme = memes[Math.floor(Math.random() * memes.length)];
                        memeData = {
                            image: randomMeme.url,
                            title: randomMeme.name,
                            author: "ImgFlip"
                        };
                        break;
                    }
                } else {
                    if (response.data?.url) {
                        memeData = {
                            image: response.data.url,
                            title: response.data.title || "Random Meme",
                            author: response.data.author || "Reddit"
                        };
                        break;
                    }
                }
            } catch (e) {
                console.log(`Meme API failed: ${api}`);
                continue;
            }
        }
        
        if (memeData) {
            await conn.sendMessage(from, {
                image: { url: memeData.image },
                caption: `😂 *MEME*\n\n📛 *Title:* ${memeData.title}\n👤 *Author:* ${memeData.author}\n📂 *Category:* ${category}\n\n_Enjoy the laugh!_`
            }, { quoted: mek });
            
            await conn.sendMessage(from, { react: { text: "😂", key: mek.key } });
        } else {
            // Fallback to local memes
            const fallbackMemes = [
                "https://i.imgflip.com/1bij.jpg",
                "https://i.imgflip.com/1g8my4.jpg",
                "https://i.imgflip.com/1e1qcs.jpg",
                "https://i.imgflip.com/1c1uej.jpg",
                "https://i.imgflip.com/1h7in3.jpg"
            ];
            
            const randomMeme = fallbackMemes[Math.floor(Math.random() * fallbackMemes.length)];
            
            await conn.sendMessage(from, {
                image: { url: randomMeme },
                caption: "😂 *Random Meme*\n\n_When APIs fail but memes never die!_"
            }, { quoted: mek });
        }
        
    } catch (error) {
        console.error("Meme error:", error);
        await reply("❌ Meme service unavailable. Try again later!");
    }
});

// ==================== HACK COMMAND (FAKE) ====================
cmd({
    pattern: "hack",
    alias: ["hacker", "hacking"],
    desc: "Fake hacking simulation (just for fun)",
    category: "fun",
    react: "👾",
    filename: __filename,
    use: ".hack @user"
}, async (conn, mek, m, { from, reply, mentioned, pushName, text }) => {
    try {
        const target = mentioned?.[0] || m.sender;
        const targetNumber = target.split('@')[0];
        const hackerName = pushName || "Anonymous";
        
        // Start hacking animation
        await reply(`👾 *HACKING INITIATED*\n\nTarget: @${targetNumber}\nHacker: ${hackerName}\nStatus: Starting...`);
        
        const steps = [
            "🔍 Scanning target device...",
            "📡 Connecting to server...",
            "🔓 Bypassing firewall...",
            "📱 Accessing WhatsApp data...",
            "💾 Extracting chat history...",
            "📸 Downloading media files...",
            "📧 Accessing emails...",
            "📱 Getting contacts list...",
            "📍 Tracking location...",
            "💰 Accessing bank details...",
            "📊 Collecting personal data...",
            "🔄 Encrypting data..."
        ];
        
        // Send step by step
        for (let i = 0; i < steps.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const progress = Math.round((i + 1) / steps.length * 100);
            const bar = "█".repeat(Math.round(progress / 10)) + "░".repeat(10 - Math.round(progress / 10));
            
            await conn.sendMessage(from, {
                text: `👾 *HACKING IN PROGRESS* (${progress}%)\n${bar}\n\n${steps[i]}\n\nTarget: @${targetNumber}`
            });
        }
        
        // Final result
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const fakeData = {
            name: ["Ali", "Ahmed", "Sara", "Fatima", "Bilal"][Math.floor(Math.random() * 5)],
            location: ["Karachi", "Lahore", "Islamabad", "London", "Dubai"][Math.floor(Math.random() * 5)],
            lastLogin: new Date(Date.now() - Math.random() * 86400000).toLocaleString(),
            phoneModel: ["iPhone 15", "Samsung S23", "OnePlus 11", "Google Pixel 7", "Xiaomi 13"][Math.floor(Math.random() * 5)],
            ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
            password: ["password123", "admin123", "letmein", "123456", "qwerty"][Math.floor(Math.random() * 5)]
        };
        
        await conn.sendMessage(from, {
            text: `💀 *HACKING COMPLETE!*\n\n✅ *Target Hacked Successfully!*\n\n📛 *Name:* ${fakeData.name}\n📍 *Location:* ${fakeData.location}\n📱 *Device:* ${fakeData.phoneModel}\n🌐 *IP Address:* ${fakeData.ip}\n🔑 *Password:* ||${fakeData.password}||\n🕒 *Last Login:* ${fakeData.lastLogin}\n\n⚠️ *This is just a joke!*\nNo real hacking occurred.`
        }, { quoted: mek });
        
        await conn.sendMessage(from, { react: { text: "💀", key: mek.key } });
        
    } catch (error) {
        console.error("Hack error:", error);
        await reply("❌ Hacking failed! Firewall too strong 💪");
    }
});

// ==================== QUOTE COMMAND ====================
cmd({
    pattern: "quote",
    alias: ["motivation", "inspire"],
    desc: "Get motivational quotes",
    category: "fun",
    react: "💬",
    filename: __filename,
    use: ".quote [category]"
}, async (conn, mek, m, { from, reply, text }) => {
    try {
        await conn.sendMessage(from, { react: { text: "✨", key: mek.key } });
        
        const categories = ['inspire', 'life', 'love', 'success', 'funny'];
        const category = text || categories[Math.floor(Math.random() * categories.length)];
        
        // Try multiple quote APIs
        const quoteAPIs = [
            "https://api.quotable.io/random",
            "https://zenquotes.io/api/random",
            "https://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=en"
        ];
        
        let quoteData = null;
        
        for (let api of quoteAPIs) {
            try {
                const response = await axios.get(api, { timeout: 10000 });
                
                if (api.includes('quotable')) {
                    if (response.data) {
                        quoteData = {
                            text: response.data.content,
                            author: response.data.author || "Unknown",
                            tags: response.data.tags || []
                        };
                        break;
                    }
                } else if (api.includes('zenquotes')) {
                    if (response.data && response.data[0]) {
                        quoteData = {
                            text: response.data[0].q,
                            author: response.data[0].a,
                            tags: []
                        };
                        break;
                    }
                } else if (api.includes('forismatic')) {
                    if (response.data) {
                        quoteData = {
                            text: response.data.quoteText,
                            author: response.data.quoteAuthor || "Unknown",
                            tags: []
                        };
                        break;
                    }
                }
            } catch (e) {
                console.log(`Quote API failed: ${api}`);
                continue;
            }
        }
        
        if (quoteData) {
            const quoteText = `💬 *QUOTE OF THE DAY*\n\n"${quoteData.text}"\n\n— *${quoteData.author}*\n\n📌 Category: ${category}\n✨ Stay motivated!`;
            
            await conn.sendMessage(from, {
                text: quoteText
            }, { quoted: mek });
            
        } else {
            // Fallback quotes
            const fallbackQuotes = [
                {
                    text: "The only way to do great work is to love what you do.",
                    author: "Steve Jobs"
                },
                {
                    text: "Life is what happens to you while you're busy making other plans.",
                    author: "John Lennon"
                },
                {
                    text: "The future belongs to those who believe in the beauty of their dreams.",
                    author: "Eleanor Roosevelt"
                },
                {
                    text: "It is during our darkest moments that we must focus to see the light.",
                    author: "Aristotle"
                },
                {
                    text: "Whoever is happy will make others happy too.",
                    author: "Anne Frank"
                }
            ];
            
            const randomQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
            
            await conn.sendMessage(from, {
                text: `💬 *QUOTE*\n\n"${randomQuote.text}"\n\n— *${randomQuote.author}*\n\n✨ Stay inspired!`
            }, { quoted: mek });
        }
        
        await conn.sendMessage(from, { react: { text: "💬", key: mek.key } });
        
    } catch (error) {
        console.error("Quote error:", error);
        await reply("💬 No quotes found, but here's one: Be yourself!");
    }
});

// ==================== SHIP COMMAND ====================
cmd({
    pattern: "ship",
    alias: ["love", "couple", "match"],
    desc: "Ship two users and calculate love percentage",
    category: "fun",
    react: "💘",
    filename: __filename,
    use: ".ship @user1 @user2"
}, async (conn, mek, m, { from, reply, mentioned, pushName }) => {
    try {
        if (!mentioned || mentioned.length < 2) {
            return reply("💘 *Please mention two users!*\n\nExample: .ship @user1 @user2\nOr: .ship @923001234567 @923009876543");
        }
        
        const user1 = mentioned[0];
        const user2 = mentioned[1];
        
        const user1Name = await getContactName(conn, user1) || "User 1";
        const user2Name = await getContactName(conn, user2) || "User 2";
        
        await conn.sendMessage(from, { 
            react: { text: "💕", key: mek.key } 
        });
        
        // Calculate love percentage (random but seeded with user IDs)
        const seed = parseInt(user1.split('@')[0].slice(-4)) + parseInt(user2.split('@')[0].slice(-4));
        const lovePercent = 50 + (seed % 50); // 50-100%
        
        // Generate ship name
        const shipName = generateShipName(user1Name, user2Name);
        
        // Compatibility analysis
        const compatibility = analyzeCompatibility(lovePercent);
        
        // Create love meter
        const loveBar = createLoveBar(lovePercent);
        
        // Ship message
        const shipMessage = `
💘 *LOVE CALCULATOR*

👫 *Couple:*
• ${user1Name}
• ${user2Name}

💕 *Love Percentage:* ${lovePercent}%
${loveBar}

✨ *Ship Name:* ${shipName}

📊 *Compatibility Analysis:*
${compatibility.analysis}

💬 *Verdict:* ${compatibility.verdict}

🎯 *Advice:* ${compatibility.advice}

❤️ *Note:* This is just for fun! Real love needs time and effort.`;

        await conn.sendMessage(from, {
            text: shipMessage,
            mentions: [user1, user2]
        }, { quoted: mek });
        
        // Send cute sticker if high percentage
        if (lovePercent > 80) {
            try {
                const stickers = [
                    "https://raw.githubusercontent.com/SecktorBot/Botpack/main/love.webp",
                    "https://i.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif",
                    "https://i.giphy.com/media/3o7abAHdYvZdBNnGZq/giphy.gif"
                ];
                
                await conn.sendMessage(from, {
                    sticker: { url: stickers[Math.floor(Math.random() * stickers.length)] }
                });
            } catch (stickerError) {
                console.log("Sticker failed:", stickerError);
            }
        }
        
    } catch (error) {
        console.error("Ship error:", error);
        await reply("❌ Ship sank! Could not calculate love 💔");
    }
});

// ==================== HELPER FUNCTIONS ====================
async function getContactName(conn, jid) {
    try {
        const contact = await conn.contactById(jid);
        return contact?.name || contact?.pushname || jid.split('@')[0];
    } catch (e) {
        return jid.split('@')[0];
    }
}

function generateShipName(name1, name2) {
    const part1 = name1.substring(0, Math.ceil(name1.length / 2));
    const part2 = name2.substring(Math.floor(name2.length / 2));
    return part1 + part2;
}

function createLoveBar(percent) {
    const filled = Math.round(percent / 10);
    const empty = 10 - filled;
    return "❤️".repeat(filled) + "🤍".repeat(empty) + ` ${percent}%`;
}

function analyzeCompatibility(percent) {
    if (percent >= 90) {
        return {
            analysis: "• Communication: Excellent\n• Trust: Perfect\n• Chemistry: Fireworks\n• Future: Bright",
            verdict: "Soulmates! ❤️",
            advice: "Don't let this one go! You're perfect for each other."
        };
    } else if (percent >= 70) {
        return {
            analysis: "• Communication: Good\n• Trust: Strong\n• Chemistry: Great\n• Future: Promising",
            verdict: "Great Match! 💕",
            advice: "With some effort, this could be something special."
        };
    } else if (percent >= 50) {
        return {
            analysis: "• Communication: Average\n• Trust: Needs work\n• Chemistry: Okay\n• Future: Uncertain",
            verdict: "Could work... 🤔",
            advice: "Give it time and see how it develops."
        };
    } else {
        return {
            analysis: "• Communication: Poor\n• Trust: Low\n• Chemistry: Weak\n• Future: Not good",
            verdict: "Not compatible 😢",
            advice: "Maybe stay friends for now."
        };
    }
}

console.log("😂 Meme, Hack, Quote & Ship Plugin Loaded!");
