const { cmd, commands } = require('../command');
const config = require('../config');
const { runtime } = require('../lib/functions');

cmd({
    pattern: "menu",
    alias: ["help","h","start"],
    use: ".menu",
    desc: "Show main interactive menu",
    category: "menu",
    react: "🎨",
    filename: __filename
}, async (conn, mek, m, { from, prefix, sender, isOwner, isPremium }) => {
    try {
        let status = "User";
        if(isOwner) status = "Owner";
        else if(isPremium) status = "Premium";

        const totalCommands = Object.keys(commands || {}).length;

        // ===================== 1. Voice message =====================
        try {
            const audioUrl = "https://image2url.com/r2/default/audio/1769566776748-b31cdb1b-c1fa-413e-86b3-0c0e7b405e45.mp3";
            await conn.sendMessage(from, {
                audio: { url: audioUrl },
                mimetype: 'audio/mpeg',
                ptt: true,
                fileName: 'BOSS-MD-Welcome.mp3'
            }, { quoted: mek });
        } catch(err){
            console.log("Audio Error (ignored):", err.message);
        }

        // ===================== 2. Main menu =====================
        const menuText = `
╭━━━━━━━━━━━━━━━━━━━━━━━╮
┃   ░▒▓█ BOSS-MD v5.0 █▓▒░  
╰━━━━━━━━━━━━━━━━━━━━━━━╯

┌─「 📊 BOT STATUS 」─┐
│ 👑 Owner: ${config.OWNER_NAME}
│ 🔣 Prefix: [${prefix}]
│ 📚 Commands: ${totalCommands}
│ 🏃 Runtime: ${runtime(process.uptime())}
│ ⚡ Status: ${status}
└─────────────────────┘

▰▰▰▰▰▰▰▰▰▰
🎯 QUICK MENU
▰▰▰▰▰▰▰▰▰▰

📥 ${prefix}menu 1 - Download Tools
👥 ${prefix}menu 2 - Group Manager  
😄 ${prefix}menu 3 - Fun & Games
👑 ${prefix}menu 4 - Owner Panel
🤖 ${prefix}menu 5 - AI Assistant
🎌 ${prefix}menu 6 - Anime World
🔄 ${prefix}menu 7 - Converter
🛠️ ${prefix}menu 8 - Utilities
💖 ${prefix}menu 9 - Reactions

▰▰▰▰▰▰▰▰▰▰
💎 VIP FEATURES
▰▰▰▰▰▰▰▰▰▰

✦ Voice Integrated ✓
✦ High-Res Graphics  
✦ Interactive System
✦ Premium Styling
✦ Fast Performance

▰▰▰▰▰▰▰▰▰▰
📞 CONTACT
▰▰▰▰▰▰▰▰▰▰

For VIP Support:
${config.OWNER_NAME}
@${config.OWNER_NUMBER}

> ${config.DESCRIPTION}`;

        await conn.sendMessage(from, {
            image: { url: config.MENU_IMAGE_URL || 'https://files.catbox.moe/xla7at.jpg' },
            caption: menuText,
            contextInfo: { mentionedJid: [sender] }
        }, { quoted: mek });

        // ===================== 3. Sub-menu system =====================
        const args = m.text ? m.text.split(' ').slice(1) : [];
        if(args[0]){
            const menuData = {
                '1': { title: "📥 DOWNLOAD MENU 📥", content: `
• ${prefix}play [song]
• ${prefix}ytmp3 [url]
• ${prefix}ytmp4 [url]
• ${prefix}spotify [query]
• ${prefix}song [name]` },
                '2': { title: "👥 GROUP MENU 👥", content: `
• ${prefix}add @user
• ${prefix}remove @user
• ${prefix}kick @user
• ${prefix}promote @user
• ${prefix}demote @user
• ${prefix}mute [time]
• ${prefix}unmute` },
                '3': { title: "😄 FUN MENU 😄", content: `
• ${prefix}shapar
• ${prefix}rate @user
• ${prefix}joke
• ${prefix}fact
• ${prefix}roll
• ${prefix}flip
• ${prefix}rcolor` },
                '4': { title: "👑 OWNER PANEL 👑", content: `
• ${prefix}public / ${prefix}self
• ${prefix}addprem / ${prefix}delprem
• ${prefix}ban
• ${prefix}unban
• ${prefix}antilink
• ${prefix}kickall` },
                '5': { title: "🤖 AI ASSISTANT 🤖", content: `
• ${prefix}chatgpt
• ${prefix}age
• ${prefix}nowm` },
                '6': { title: "🎌 ANIME WORLD 🎌", content: `
• ${prefix}anime
• ${prefix}animewall
• ${prefix}manga` }
            };

            const selected = menuData[args[0]];
            if(selected){
                await conn.sendMessage(from, { text: `*${selected.title}*\n\n${selected.content}\n\nType ${prefix}menu for main menu` }, { quoted: mek });
                return;
            }
        }

    } catch(error){
        console.error("Menu CMD Error:", error);
        await conn.sendMessage(from, { text: `❌ Menu Error: ${error.message}` }, { quoted: mek });
    }
});
