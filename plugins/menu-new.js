const { cmd, commands } = require('../command');
const { runtime } = require('../lib/functions');
const { generateWAMessageContent, proto } = require('@adiwajshing/baileys'); // ensure baileys v5
const fs = require('fs');

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

        const singleImageUrl = global.thumbnail || 'https://files.catbox.moe/xla7at.jpg';
        const totalCommands = Object.keys(commands || {}).length;

        async function createImage(url) {
            const { imageMessage } = await generateWAMessageContent({
                image: { url }
            }, { upload: conn.waUploadToServer });
            return imageMessage;
        }

        // Menu sections
        const menuSections = [
`╭┈〘 🔥 BOSS-MD v5.0 🔥 〙┈➤
┆ 👑 Owner: ${config.OWNER_NAME}
┆ 🔣 Prefix: [${prefix}]
┆ 📚 Commands: ${totalCommands}
┆ 🏃 Runtime: ${runtime(process.uptime())}
┆ ⚡ Status: ${status}
╰┈➤ 🎯 QUICK MENU
> Type ${prefix}menu <number>`,
`╭┈〘 📥 DOWNLOAD MENU 〙┈➤
┆ .play [song]
┆ .ytmp3 [url]
┆ .ytmp4 [url]
┆ .spotify [query]
┆ .song [name]
╰┈➤ Type ${prefix}menu 2 for Group Menu`,
`╭┈〘 👥 GROUP MENU 〙┈➤
┆ .add @user
┆ .remove @user
┆ .kick @user
┆ .promote @user
┆ .demote @user
┆ .mute [time]
┆ .unmute
╰┈➤ Type ${prefix}menu 3 for Fun Menu`,
`╭┈〘 😄 FUN & GAMES 〙┈➤
┆ .shapar
┆ .rate @user
┆ .joke
┆ .fact
┆ .roll
┆ .flip
┆ .rcolor
╰┈➤ Type ${prefix}menu 4 for Owner Panel`,
`╭┈〘 👑 OWNER PANEL 〙┈➤
┆ .public / .self
┆ .addprem / .delprem
┆ .ban
┆ .unban
┆ .antilink
┆ .kickall
╰┈➤ Type ${prefix}menu 5 for AI Assistant`,
`╭┈〘 🤖 AI ASSISTANT 〙┈➤
┆ .chatgpt
┆ .age
┆ .nowm
╰┈➤ Type ${prefix}menu 6 for Anime World`,
`╭┈〘 🎌 ANIME WORLD 〙┈➤
┆ .anime
┆ .animewall
┆ .manga
╰┈➤ Type ${prefix}menu 7 for Converter`
        ];

        const customTitles = [
            "˖ ࣪╰─ ♡ 𝐁𝐎𝐒𝐒 𝐌𝐃 MENU 1˙🫐",
            "˖ ࣪╰─ ♡ 𝐁𝐎𝐒𝐒 𝐌𝐃 MENU 2˙❤️‍🩹",
            "˖ ࣪╰─ ♡ 𝐁𝐎𝐒𝐒 𝐌𝐃 MENU 3˙📝",
            "˖ ࣪╰─ ♡ 𝐁𝐎𝐒𝐒 𝐌𝐃 MENU 4˙🎀",
            "˖ ࣪╰─ ♡ 𝐁𝐎𝐒𝐒 𝐌𝐃 MENU 5˙🧿",
            "˖ ࣪╰─ ♡ 𝐁𝐎𝐒𝐒 𝐌𝐃 MENU 6˙🌸",
            "˖ ࣪╰─ ♡ 𝐁𝐎𝐒𝐒 𝐌𝐃 MENU 7˙🌝"
        ];

        let push = [];

        for(let i=0; i<menuSections.length; i++){
            const section = menuSections[i];
            const title = customTitles[i];

            push.push({
                body: proto.Message.InteractiveMessage.Body.fromObject({ text: section }),
                footer: proto.Message.InteractiveMessage.Footer.fromObject({ text: config.BOT_NAME || "BOSS-MD" }),
                header: proto.Message.InteractiveMessage.Header.fromObject({
                    title: title,
                    hasMediaAttachment: true,
                    imageMessage: await createImage(singleImageUrl)
                }),
                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                    buttons: [
                        {
                            name: "quick_reply",
                            buttonParamsJson: JSON.stringify({
                                display_text: "🚀 MAIN MENU",
                                id: ".menu"
                            })
                        }
                    ]
                })
            });
        }

        for(const msg of push){
            await conn.sendMessage(from, msg, { quoted: mek });
        }

    } catch(error){
        console.error('Menu CMD Error:', error);
        await conn.sendMessage(from, { text: `❌ Error: ${error.message}` }, { quoted: mek });
    }
}
