const { cmd } = require('../command');

cmd({
    pattern: "demote",
    alias: ["d", "dismiss", "removeadmin"],
    desc: "Demotes a group admin to a normal member",
    category: "admin",
    react: "⬇️",
    filename: __filename
},
async (conn, mek, m, {
    from,
    sender,
    botNumber,
    botNumber2,
    groupMetadata,
    reply
}) => {

    // ✅ group check
    if (!m.isGroup) return reply("❌ This command works only in groups.");

    const participants = groupMetadata.participants || [];
    const groupAdmins = participants.filter(p => p.admin).map(p => p.id);

    // ✅ check if sender is admin (fixed)
    const senderJid = sender;
    if (!groupAdmins.includes(senderJid)) {
        return reply("❌ Only group admins can use this command.");
    }

    // ✅ check if bot is admin
    const botJid = botNumber2 || (botNumber + "@s.whatsapp.net");
    if (!groupAdmins.includes(botJid)) {
        return reply("❌ Mujhe pehle admin bnao.");
    }

    // ✅ get target safely
    let number;
    if (m.quoted && m.quoted.sender) {
        number = m.quoted.sender.split("@")[0];
    } 
    else if (m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length) {
        number = m.message.extendedTextMessage.contextInfo.mentionedJid[0].split("@")[0];
    } 
    else if (m.text && m.text.replace(/\D/g, '').length > 7) {
        number = m.text.replace(/\D/g, '');
    } 
    else {
        return reply("❌ Reply, mention ya number do.");
    }

    const jid = number + "@s.whatsapp.net";

    // ❌ prevent demoting bot itself
    if (jid === botJid) {
        return reply("❌ Main khud ko demote nahi kar sakta.");
    }

    // ❌ check target is admin
    if (!groupAdmins.includes(jid)) {
        return reply("❌ Ye banda admin nahi hai.");
    }

    try {
        await conn.groupParticipantsUpdate(from, [jid], "demote");
        reply(`✅ Successfully demoted @${number}`, { mentions: [jid] });
    } catch (e) {
        console.log("DEMOTE ERROR:", e);
        reply("❌ Demote failed.");
    }
});