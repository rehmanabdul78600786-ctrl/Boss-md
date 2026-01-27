// plugins/menu.js
const config = require('../config')
const { cmd, commands } = require('../command');
const path = require('path'); 
const fs = require('fs');
const { runtime } = require('../lib/functions');

cmd({
    pattern: "menu",
    alias: ["help","h","start"],
    use: '.menu',
    desc: "Show main interactive menu",
    category: "menu",
    react: "🎨",
    filename: __filename
}, 
async (conn, mek, m, { from, reply, prefix, sender }) => {
    try {
        const totalCommands = Object.keys(commands || {}).length;
        
        // VOICE MESSAGE بھیجیں (اگر ہو تو)
        try {
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
        } catch (voiceError) {
            console.log("Voice not sent:", voiceError);
        }

        // IMAGE کے ساتھ MAIN MENU
        const menuText = `
╭━━━━━━━━━━━━━━━━━━━━━━━╮
┃   ░▒▓█ BOSS-MD v3.0 █▓▒░  
╰━━━━━━━━━━━━━━━━━━━━━━━╯

╔══════════════════════╗
   🔥 PREMIUM EDITION 🔥
╚══════════════════════╝

┌─「 📊 BOT STATUS 」─┐
│ ✦ Owner: ${config.OWNER_NAME}
│ ✦ Prefix: [${config.PREFIX}]
│ ✦ Commands: ${totalCommands}
│ ✦ Runtime: ${runtime(process.uptime())}
│ ✦ Version: VIP 3.0
└─────────────────────┘

▰▰▰▰▰▰▰▰▰▰▰▰▰▰
   🎯 QUICK MENU
▰▰▰▰▰▰▰▰▰▰▰▰▰▰

📥 ${prefix}menu 1 - Download Tools
👥 ${prefix}menu 2 - Group Manager  
😄 ${prefix}menu 3 - Fun & Games
👑 ${prefix}menu 4 - Owner Panel
🤖 ${prefix}menu 5 - AI Assistant
🎌 ${prefix}menu 6 - Anime World
🔄 ${prefix}menu 7 - Converter
🛠️ ${prefix}menu 8 - Utilities
💖 ${prefix}menu 9 - Reactions

▰▰▰▰▰▰▰▰▰▰▰▰▰▰
   💎 VIP FEATURES
▰▰▰▰▰▰▰▰▰▰▰▰▰▰

✦ Voice Integrated
✦ High-Res Graphics  
✦ Interactive System
✦ Premium Styling
✦ Fast Performance

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

        await conn.sendMessage(
            from,
            {
                image: { url: config.MENU_IMAGE_URL || 'https://files.catbox.moe/xla7at.jpg' },
                caption: menuText,
                contextInfo: {
                    mentionedJid: [sender],
                    forwardingScore: 999,
                    isForwarded: true
                }
            },
            { quoted: mek }
        );

        // اگر argument دیا گیا ہو تو sub-menu دکھائیں
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

> Type ${prefix}menu 2 for Group Menu`
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
╰━━━━━━━━━━━━━━━┈⊷
> Type ${prefix}menu 3 for Fun Menu`
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
╰━━━━━━━━━━━━━━━┈⊷
> Type ${prefix}menu 4 for Owner Menu`
                }
            };

            const selectedMenu = menuData[args[0]];
            if (selectedMenu) {
                await conn.sendMessage(
                    from,
                    {
                        text: `*${selectedMenu.title}*\n\n${selectedMenu.content}\n\n▰▰▰▰▰▰▰▰▰▰▰▰▰▰\nType *${prefix}menu* for main menu`,
                        contextInfo: {
                            mentionedJid: [sender]
                        }
                    },
                    { quoted: mek }
                );
                return;
            }
        }

        // FINAL MESSAGE
        await conn.sendMessage(
            from,
            {
                text: `🎉 *VIP MENU ACTIVATED!*\n\n✅ Premium Menu Sent\n✅ Voice Message Sent\n✅ Interactive Ready\n\nType *${prefix}menu2* for all commands\nType *${prefix}owner* for contact\n\n${config.DESCRIPTION}`
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
