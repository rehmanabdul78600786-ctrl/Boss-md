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
    isGroup,
    sender,
    botNumber,
    botNumber2,
    groupAdmins,
    isAdmins,
    reply
}) => {

    // ✅ group check
    if (!isGroup) return reply("❌ This command works only in groups.");

    // ✅ user admin check
    if (!isAdmins) return reply("❌ Only group admins can use this command.");

    // ✅ REAL bot admin check (FIXED)
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

    // ❌ bot self demote block
    if (number === botNumber) {
        return reply("❌ Main khud ko demote nahi kar sakta.");
    }

    const jid = number + "@s.whatsapp.net";

    // ❌ target must be admin
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