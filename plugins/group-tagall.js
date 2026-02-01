const { cmd } = require('../command');

cmd({
    pattern: "tagall",
    react: "🔊",
    alias: ["gc_tagall"],
    desc: "To Tag all Members",
    category: "group",
    use: '.tagall [message]',
    filename: __filename
}, 
async (conn, mek, m, { from, participants, reply, isGroup, senderNumber, args }) => {
    try {
        if (!isGroup) return reply("❌ This command can only be used in groups.");

        // === Helper: Format JID properly ===
        const getJid = (jid) => {
            if (!jid) return null;
            let clean = jid.split(':')[0];
            if (!clean.includes('@')) clean += '@s.whatsapp.net';
            else if (clean.includes('@c.us')) clean = clean.replace('@c.us', '@s.whatsapp.net');
            else if (!clean.includes('@s.whatsapp.net')) clean = clean.split('@')[0] + '@s.whatsapp.net';
            return clean;
        };

        // Bot JID
        const botJid = getJid(conn.user?.jid || conn.user?.id);
        if (!botJid) return reply("❌ Could not identify bot JID.");

        // Sender JID
        const senderJid = getJid(senderNumber || m?.sender || mek?.sender);
        if (!senderJid) return reply("❌ Could not identify sender JID.");

        // === Get group metadata ===
        const groupInfo = await conn.groupMetadata(from);
        const groupName = groupInfo.subject || "Unknown Group";
        const allParticipants = groupInfo.participants || participants || [];

        // Get admins
        const allAdmins = allParticipants
            .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
            .map(p => getJid(p.id));

        // === Permission checks ===
        if (!allAdmins.includes(senderJid)) return reply("❌ Only group admins can use this command.");
        if (!allAdmins.includes(botJid)) return reply(`❌ I need to be an admin to tag everyone.\n*Promote me first!*`);

        if (!allParticipants || allParticipants.length === 0) return reply("❌ No members found in this group.");

        // === Build message ===
        const emojis = ['📢', '🔊', '🌐', '🔰', '❤‍🩹', '🤍', '🖤', '🩵', '📝', '💗', '🔖', '🪩', '📦', '🎉', '🛡️', '💸', '⏳', '🗿', '🚀', '🎧', '🪀', '⚡', '🚩', '🍁', '🗣️', '👻', '⚠️', '🔥'];
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        const message = args.join(" ").trim() || "Attention Everyone!";

        let teks = `▢ *Group* : ${groupName}\n`;
        teks += `▢ *Members* : ${allParticipants.length}\n`;
        teks += `▢ *Message* : ${message}\n\n`;
        teks += "┌───⊷ *MENTIONS*\n";

        const validParticipants = [];
        for (let mem of allParticipants) {
            if (!mem?.id) continue;
            const memberJid = getJid(mem.id);
            if (!memberJid) continue;
            teks += `│ ${randomEmoji} @${memberJid.split("@")[0]}\n`;
            validParticipants.push(memberJid);
        }

        if (validParticipants.length === 0) return reply("❌ No valid members to tag.");
        teks += "└──✪ BOSS ┃ 𝐌𝐃 ✪──";

        // === Send message with mentions ===
        await conn.sendMessage(from, { text: teks, mentions: validParticipants }, { quoted: mek });

    } catch (error) {
        console.error("TagAll Error:", error);
        reply(`❌ Error: ${error.message || "Unknown error occurred"}`);
    }
});