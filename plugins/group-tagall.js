const config = require('../config')
const { cmd, commands } = require('../command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('../lib/functions')

cmd({
    pattern: "tagall",
    react: "🔊",
    alias: ["gc_tagall"],
    desc: "To Tag all Members",
    category: "group",
    use: '.tagall [message]',
    filename: __filename
},
async (conn, mek, m, { from, participants, reply, isGroup, senderNumber, groupAdmins, prefix, command, args, body }) => {
    try {
        if (!isGroup) return reply("❌ This command can only be used in groups.");

        // Bot & sender numbers fixed
        const botNumber = conn.user.jid.split(":")[0] + "@s.whatsapp.net";
        const senderNum = senderNumber.split(":")[0] + "@s.whatsapp.net";

        // Clean admin list
        const cleanGroupAdmins = groupAdmins.map(jid => jid.split(":")[0] + "@s.whatsapp.net");

        // Check if sender is admin
        if (!cleanGroupAdmins.includes(senderNum)) return reply("❌ Only group admins can use this command.");

        // Check if bot is admin
        if (!cleanGroupAdmins.includes(botNumber)) return reply("❌ I need to be an admin to tag everyone.");

        // Fetch group info safely
        let groupInfo = await conn.groupMetadata(from).catch(() => null);
        let groupName = groupInfo?.subject || "Unknown Group";
        let totalMembers = participants?.length || 0;
        if (totalMembers === 0) return reply("❌ No members found in this group.");

        // Random emoji
        let emojis = ['📢', '🔊', '🌐', '🔰', '❤‍🩹', '🤍', '🖤', '🩵', '📝', '💗', '🔖', '🪩', '📦', '🎉', '🛡️', '💸', '⏳', '🗿', '🚀', '🎧', '🪀', '⚡', '🚩', '🍁', '🗣️', '👻', '⚠️', '🔥'];
        let randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

        // Extract message safely
        let message = body ? body.slice(body.indexOf(command) + command.length).trim() : "Attention Everyone";
        if (!message) message = "Attention Everyone";

        // Build tag text
        let teks = `▢ Group : *${groupName}*\n▢ Members : *${totalMembers}*\n▢ Message: *${message}*\n\n┌───⊷ *MENTIONS*\n`;
        for (let mem of participants) {
            if (!mem.id) continue; // Prevent undefined errors
            teks += `${randomEmoji} @${mem.id.split('@')[0]}\n`;
        }
        teks += "└──✪ BOSS ┃ 𝐌𝐃 ✪──";

        // Send message with mentions
        conn.sendMessage(from, { text: teks, mentions: participants.map(a => a.id) }, { quoted: mek });

    } catch (e) {
        console.error("TagAll Error:", e);
        reply(`❌ *Error Occurred !!*\n\n${e.message || e}`);
    }
});