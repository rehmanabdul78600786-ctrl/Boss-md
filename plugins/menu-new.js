cmd({
    pattern: "menu",
    desc: "Show interactive menu system",
    category: "menu",
    react: "🎨",
    filename: __filename
}, async (conn, mek, m, { from, reply, prefix }) => {
    try {
        const totalCommands = Object.keys(commands).length;
        
        // 1. پہلے VOICE MESSAGE بھیجیں
        const voiceUrl = "https://files.catbox.moe/gzmxdg.mp3"; // آپ کی آواز کا لنک
        
        await conn.sendMessage(
            from,
            { 
                audio: { url: voiceUrl },
                mimetype: 'audio/mpeg',
                ptt: true,
                fileName: 'VIP-Menu-Voice.mp3'
            },
            { quoted: mek }
        );

        // 2. پھر IMAGE بھیجیں
        const menuImage = `
╭━━━━━━━━━━━━━━━━━━━━━━━╮
┃                                        
┃   ░▒▓█ BOSS-MD v3.0 █▓▒░  
┃                                        
╰━━━━━━━━━━━━━━━━━━━━━━━╯

╔══════════════════════╗
   🔥 PREMIUM EDITION 🔥
╚══════════════════════╝

┌─「 📊 BOT STATUS 」─┐
│ ✦ Owner: ${config.OWNER_NAME}
│ ✦ Prefix: ${prefix}
│ ✦ Commands: ${totalCommands}
│ ✦ Runtime: ${runtime(process.uptime())}
│ ✦ Version: VIP 2.0
└─────────────────────┘

▰▰▰▰▰▰▰▰▰▰▰▰▰▰
   🎯 QUICK MENU
▰▰▰▰▰▰▰▰▰▰▰▰▰▰

[1] 📥 Download Tools
[2] 👥 Group Manager  
[3] 😄 Fun & Games
[4] 👑 Owner Panel
[5] 🤖 AI Assistant
[6] 🎌 Anime World
[7] 🔄 Converter
[8] 🛠️ Utilities
[9] 💖 Reactions

▰▰▰▰▰▰▰▰▰▰▰▰▰▰
   💎 VIP FEATURES
▰▰▰▰▰▰▰▰▰▰▰▰▰▰

✦ Voice Integrated
✦ High-Res Graphics  
✦ Interactive System
✦ Premium Styling
✦ Fast Performance
✦ Secure & Stable

▰▰▰▰▰▰▰▰▰▰▰▰▰▰
   🚀 HOW TO USE
▰▰▰▰▰▰▰▰▰▰▰▰▰▰

Type: ${prefix}menu <number>
Example: ${prefix}menu 1

▰▰▰▰▰▰▰▰▰▰▰▰▰▰
   📞 CONTACT
▰▰▰▰▰▰▰▰▰▰▰▰▰▰

For VIP Support:
${config.OWNER_NAME}
@${config.OWNER_NUMBER}

> ${config.DESCRIPTION}`;

        // 3. تصویر کے ساتھ مینو بھیجیں
        await conn.sendMessage(
            from,
            {
                image: { 
                    url: 'https://files.catbox.moe/xla7at.jpg' // آپ کی VIP تصویر
                },
                caption: menuImage,
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 999,
                    isForwarded: true
                }
            },
            { quoted: mek }
        );

        // 4. انٹرایکٹو بٹنز (اگر سپورٹ کرتا ہو)
        try {
            await conn.sendMessage(
                from,
                {
                    text: "📱 *Interactive Menu*\n\nSelect an option:",
                    footer: "VIP Premium Menu v2.0",
                    buttons: [
                        { buttonId: `${prefix}menu 1`, buttonText: { displayText: "📥 Download" }, type: 1 },
                        { buttonId: `${prefix}menu 2`, buttonText: { displayText: "👥 Group" }, type: 1 },
                        { buttonId: `${prefix}menu 3`, buttonText: { displayText: "😄 Fun" }, type: 1 },
                        { buttonId: `${prefix}menu 4`, buttonText: { displayText: "👑 Owner" }, type: 1 }
                    ],
                    headerType: 1
                },
                { quoted: mek }
            );
        } catch (e) {
            // اگر بٹنز سپورٹ نہیں کرتا تو چھوڑ دیں
            console.log("Buttons not supported");
        }

// آپ کا فائنل میسج
await conn.sendMessage(
    from,
    {
        text: `🎉 *VIP MENU DELIVERED!*\n\n✅ Voice Message Sent\n✅ Premium Image Sent\n✅ Interactive Menu Ready\n\nType *${prefix}help* for more options!\n\n${config.DESCRIPTION}`
    },
    { quoted: mek }
);

// ============ یہاں menuData کو اندر منتقل کریں ============
const menuData = {
    '1': {
        title: "📥 *DOWNLOAD MENU* 📥",
        content: `▰▰▰▰▰▰▰▰▰▰▰▰▰▰
   🎵 MUSIC & VIDEO
▰▰▰▰▰▰▰▰▰▰▰▰▰▰

• ${prefix}play [song]
• ${prefix}ytmp3 [url]
• ${prefix}ytmp4 [url]
• ${prefix}spotify [query]
• ${prefix}song [name]

▰▰▰▰▰▰▰▰▰▰▰▰▰▰
   📱 SOCIAL MEDIA
▰▰▰▰▰▰▰▰▰▰▰▰▰▰

• ${prefix}facebook [url]
• ${prefix}tiktok [url]
• ${prefix}instagram [url]
• ${prefix}twitter [url]
• ${prefix}mediafire [url]

> VIP Download Tools Activated!`
    },
    '2': {
        title: "👥 *Group Menu* 👥",
                content: `╭━━━〔 *Group Menu* 〕━━━┈⊷
┃★╭──────────────
┃★│ 🛠️ *Management*
┃★│ • grouplink
┃★│ • kickall
┃★│ • kickall2
┃★│ • kickall3
┃★│ • add @user
┃★│ • remove @user
┃★│ • kick @user
┃★╰──────────────
┃★╭──────────────
┃★│ ⚡ *Admin Tools*
┃★│ • promote @user
┃★│ • demote @user
┃★│ • dismiss 
┃★│ • revoke
┃★│ • mute [time]
┃★│ • unmute
┃★│ • lockgc
┃★│ • unlockgc
┃★╰──────────────
┃★╭──────────────
┃★│ 🏷️ *Tagging*
┃★│ • tag @user
┃★│ • hidetag [msg]
┃★│ • tagall
┃★│ • tagadmins
┃★│ • invite
┃★╰──────────────
╰━━━━━━━━━━━━━━━┈⊷
> ${config.DESCRIPTION}`,
                image: true
            },
            '3': {
                title: "😄 *Fun Menu* 😄",
                content: `╭━━━〔 *Fun Menu* 〕━━━┈⊷
┃★╭──────────────
┃★│ 🎭 *Interactive*
┃★│ • shapar
┃★│ • rate @user
┃★│ • insult @user
┃★│ • hack @user
┃★│ • ship @user1 @user2
┃★│ • character
┃★│ • pickup
┃★│ • joke
┃★╰──────────────
┃★╭──────────────
┃★│ 😂 *Reactions*
┃★│ • hrt
┃★│ • hpy
┃★│ • syd
┃★│ • anger
┃★│ • shy
┃★│ • kiss
┃★│ • mon
┃★│ • cunfuzed
┃★╰──────────────
╰━━━━━━━━━━━━━━━┈⊷
> ${config.DESCRIPTION}`,
                image: true
            },
            '4': {
                title: "👑 *Owner Menu* 👑",
                content: `╭━━━〔 *Owner Menu* 〕━━━┈⊷
┃★╭──────────────
┃★│ ⚠️ *Restricted*
┃★│ • block @user
┃★│ • unblock @user
┃★│ • fullpp [img]
┃★│ • setpp [img]
┃★│ • restart
┃★│ • shutdown
┃★│ • updatecmd
┃★╰──────────────
┃★╭──────────────
┃★│ ℹ️ *Info Tools*
┃★│ • gjid
┃★│ • jid @user
┃★│ • listcmd
┃★│ • allmenu
┃★╰──────────────
╰━━━━━━━━━━━━━━━┈⊷
> ${config.DESCRIPTION}`,
                image: true
            },
            '5': {
                title: "🤖 *AI Menu* 🤖",
                content: `╭━━━〔 *AI Menu* 〕━━━┈⊷
┃★╭──────────────
┃★│ 💬 *Chat AI*
┃★│ • ai [query]
┃★│ • gpt3 [query]
┃★│ • gpt2 [query]
┃★│ • gptmini [query]
┃★│ • gpt [query]
┃★│ • meta [query]
┃★╰──────────────
┃★╭──────────────
┃★│ 🖼️ *Image AI*
┃★│ • imagine [text]
┃★│ • imagine2 [text]
┃★╰──────────────
┃★╭──────────────
┃★│ 🔍 *Specialized*
┃★│ • blackbox [query]
┃★│ • luma [query]
┃★│ • dj [query]
┃★│ • khan [query]
┃★╰──────────────
╰━━━━━━━━━━━━━━━┈⊷
> ${config.DESCRIPTION}`,
                image: true
            },
            '6': {
                title: "🎎 *Anime Menu* 🎎",
                content: `╭━━━〔 *Anime Menu* 〕━━━┈⊷
┃★╭──────────────
┃★│ 🖼️ *Images*
┃★│ • fack
┃★│ • dog
┃★│ • awoo
┃★│ • garl
┃★│ • waifu
┃★│ • neko
┃★│ • megnumin
┃★│ • maid
┃★│ • loli
┃★╰──────────────
┃★╭──────────────
┃★│ 🎭 *Characters*
┃★│ • animegirl
┃★│ • animegirl1-5
┃★│ • anime1-5
┃★│ • foxgirl
┃★│ • naruto
┃★╰──────────────
╰━━━━━━━━━━━━━━━┈⊷
> ${config.DESCRIPTION}`,
                image: true
            },
            '7': {
                title: "🔄 *Convert Menu* 🔄",
                content: `╭━━━〔 *Convert Menu* 〕━━━┈⊷
┃★╭──────────────
┃★│ 🖼️ *Media*
┃★│ • sticker [img]
┃★│ • sticker2 [img]
┃★│ • emojimix 😎+😂
┃★│ • take [name,text]
┃★│ • tomp3 [video]
┃★╰──────────────
┃★╭──────────────
┃★│ 📝 *Text*
┃★│ • fancy [text]
┃★│ • tts [text]
┃★│ • trt [text]
┃★│ • base64 [text]
┃★│ • unbase64 [text]
┃★╰──────────────
╰━━━━━━━━━━━━━━━┈⊷
> ${config.DESCRIPTION}`,
                image: true
            },
            '8': {
                title: "📌 *Other Menu* 📌",
                content: `╭━━━〔 *Other Menu* 〕━━━┈⊷
┃★╭──────────────
┃★│ 🕒 *Utilities*
┃★│ • timenow
┃★│ • date
┃★│ • count [num]
┃★│ • calculate [expr]
┃★│ • countx
┃★╰──────────────
┃★╭──────────────
┃★│ 🎲 *Random*
┃★│ • flip
┃★│ • coinflip
┃★│ • rcolor
┃★│ • roll
┃★│ • fact
┃★╰──────────────
┃★╭──────────────
┃★│ 🔍 *Search*
┃★│ • define [word]
┃★│ • news [query]
┃★│ • movie [name]
┃★│ • weather [loc]
┃★╰──────────────
╰━━━━━━━━━━━━━━━┈⊷
> ${config.DESCRIPTION}`,
                image: true
            },
            '9': {
                title: "💞 *Reactions Menu* 💞",
                content: `╭━━━〔 *Reactions Menu* 〕━━━┈⊷
┃★╭──────────────
┃★│ ❤️ *Affection*
┃★│ • cuddle @user
┃★│ • hug @user
┃★│ • kiss @user
┃★│ • lick @user
┃★│ • pat @user
┃★╰──────────────
┃★╭──────────────
┃★│ 😂 *Funny*
┃★│ • bully @user
┃★│ • bonk @user
┃★│ • yeet @user
┃★│ • slap @user
┃★│ • kill @user
┃★╰──────────────
┃★╭──────────────
┃★│ 😊 *Expressions*
┃★│ • blush @user
┃★│ • smile @user
┃★│ • happy @user
┃★│ • wink @user
┃★│ • poke @user
┃★╰──────────────
╰━━━━━━━━━━━━━━━┈⊷
> ${config.DESCRIPTION}`,
                image: true
            },
            '10': {
                title: "🏠 *Main Menu* 🏠",
                content: `╭━━━〔 *Main Menu* 〕━━━┈⊷
┃★╭──────────────
┃★│ ℹ️ *Bot Info*
┃★│ • ping
┃★│ • live
┃★│ • alive
┃★│ • runtime
┃★│ • uptime
┃★│ • repo
┃★│ • owner
┃★╰──────────────
┃★╭──────────────
┃★│ 🛠️ *Controls*
┃★│ • menu
┃★│ • menu2
┃★│ • restart
┃★╰──────────────
╰━━━━━━━━━━━━━━━┈⊷
> ${config.DESCRIPTION}`,
                image: true
            }
        };

        // Message handler with improved error handling
        const handler = async (msgData) => {
            try {
                const receivedMsg = msgData.messages[0];
                if (!receivedMsg?.message || !receivedMsg.key?.remoteJid) return;

                const isReplyToMenu = receivedMsg.message.extendedTextMessage?.contextInfo?.stanzaId === messageID;
                
                if (isReplyToMenu) {
                    const receivedText = receivedMsg.message.conversation || 
                                      receivedMsg.message.extendedTextMessage?.text;
                    const senderID = receivedMsg.key.remoteJid;

                    if (menuData[receivedText]) {
                        const selectedMenu = menuData[receivedText];
                        
                        try {
                            if (selectedMenu.image) {
                                await conn.sendMessage(
                                    senderID,
                                    {
                                        image: { url: config.MENU_IMAGE_URL || 'https://files.catbox.moe/xla7at.jpg' },
                                        caption: selectedMenu.content,
                                        contextInfo: contextInfo
                                    },
                                    { quoted: receivedMsg }
                                );
                            } else {
                                await conn.sendMessage(
                                    senderID,
                                    { text: selectedMenu.content, contextInfo: contextInfo },
                                    { quoted: receivedMsg }
                                );
                            }

                            await conn.sendMessage(senderID, {
                                react: { text: '✅', key: receivedMsg.key }
                            });

                        } catch (e) {
                            console.log('Menu reply error:', e);
                            await conn.sendMessage(
                                senderID,
                                { text: selectedMenu.content, contextInfo: contextInfo },
                                { quoted: receivedMsg }
                            );
                        }

                    } else {
                        await conn.sendMessage(
                            senderID,
                            {
                                text: `❌ *Invalid Option!* ❌\n\nPlease reply with a number between 1-10 to select a menu.\n\n*Example:* Reply with "1" for Download Menu\n\n> ${config.DESCRIPTION}`,
                                contextInfo: contextInfo
                            },
                            { quoted: receivedMsg }
                        );
                    }
                }
            } catch (e) {
                console.log('Handler error:', e);
            }
        };

        // Add listener
        conn.ev.on("messages.upsert", handler);

        // Remove listener after 5 minutes
        setTimeout(() => {
            conn.ev.off("messages.upsert", handler);
        }, 300000);

    async (conn, mek, m, { from, reply, prefix }) => {
    try {
        // آپ کا پورا کوڈ
        
        // menuData اور handler کا کوڈ بھی یہیں اندر ہونا چاہیے
        
    } catch (e) {  // ✅ یہ catch main function کے اندر ہے
        console.error('Menu Error:', e);
        try {
            await conn.sendMessage(
                from,
                { text: `❌ Menu system is currently busy. Please try again later.\n\n> ${config.DESCRIPTION}` },
                { quoted: mek }
            );
        } catch (finalError) {
            console.log('Final error handling failed:', finalError);
        }
    }
}  // <-- function کا closing brace
