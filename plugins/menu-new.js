cmd({
    pattern: "menu",
    desc: "Show interactive menu system",
    category: "menu",
    react: "🎨",
    filename: __filename
}, async (conn, mek, m, { from, reply, prefix }) => {
    try {
        const totalCommands = Object.keys(commands).length;
        
        // runtime function define کریں
        const runtime = (seconds) => {
            const days = Math.floor(seconds / (24 * 60 * 60));
            seconds %= 24 * 60 * 60;
            const hours = Math.floor(seconds / (60 * 60));
            seconds %= 60 * 60;
            const minutes = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            
            return `${days}d ${hours}h ${minutes}m ${secs}s`;
        };

        // 1. پہلے VOICE MESSAGE بھیجیں
        const voiceUrl = "https://files.catbox.moe/gzmxdg.mp3";
        
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
                    url: 'https://files.catbox.moe/xla7at.jpg'
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

        // 4. اگر argument دیا گیا ہو تو sub-menu دکھائیں
        const args = m.text ? m.text.split(' ').slice(1) : [];
        if (args[0]) {
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
                    title: "👥 *GROUP MENU* 👥",
                    content: `╭━━━〔 *Group Menu* 〕━━━┈⊷
┃★╭──────────────
┃★│ 🛠️ *Management*
┃★│ • grouplink
┃★│ • add @user
┃★│ • remove @user
┃★│ • kick @user
┃★╰──────────────
┃★╭──────────────
┃★│ ⚡ *Admin Tools*
┃★│ • promote @user
┃★│ • demote @user
┃★│ • mute [time]
┃★│ • unmute
┃★╰──────────────
┃★╭──────────────
┃★│ 🏷️ *Tagging*
┃★│ • tag @user
┃★│ • tagall
┃★│ • tagadmins
┃★╰──────────────
╰━━━━━━━━━━━━━━━┈⊷`
                },
                '3': {
                    title: "😄 *FUN MENU* 😄",
                    content: `╭━━━〔 *Fun Menu* 〕━━━┈⊷
┃★╭──────────────
┃★│ 🎭 *Interactive*
┃★│ • shapar
┃★│ • rate @user
┃★│ • joke
┃★│ • fact
┃★╰──────────────
┃★╭──────────────
┃★│ 😂 *Games*
┃★│ • roll
┃★│ • flip
┃★│ • rcolor
┃★╰──────────────
╰━━━━━━━━━━━━━━━┈⊷`
                }
            };

            const selectedMenu = menuData[args[0]];
            if (selectedMenu) {
                await conn.sendMessage(
                    from,
                    {
                        text: `*${selectedMenu.title}*\n\n${selectedMenu.content}\n\n▰▰▰▰▰▰▰▰▰▰▰▰▰▰\nType *${prefix}menu* for main menu`,
                        contextInfo: {
                            mentionedJid: [m.sender]
                        }
                    },
                    { quoted: mek }
                );
                return;
            }
        }

        // 5. انٹرایکٹو بٹنز (اگر سپورٹ کرتا ہو)
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
            console.log("Buttons not supported");
        }

        // 6. فائنل میسج
        await conn.sendMessage(
            from,
            {
                text: `🎉 *VIP MENU DELIVERED!*\n\n✅ Voice Message Sent\n✅ Premium Image Sent\n✅ Interactive Menu Ready\n\nType *${prefix}help* for more options!\n\n${config.DESCRIPTION}`
            },
            { quoted: mek }
        );

    } catch (error) {
        console.error('Menu error:', error);
        await conn.sendMessage(
            from,
            { text: `❌ Menu Error\n\n${error.message}\n\nPlease try again!` },
            { quoted: mek }
        );
    }
});
