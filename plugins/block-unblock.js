const { cmd } = require('../command');

async function getTargetJid(m, q) {
    // reply
    if (m.quoted && m.quoted.sender) {
        return m.quoted.sender;
    }
    // mention
    if (m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length) {
        return m.message.extendedTextMessage.contextInfo.mentionedJid[0];
    }
    // number
    if (q && q.replace(/\D/g, '').length > 7) {
        return q.replace(/\D/g, '') + "@s.whatsapp.net";
    }
    return null;
}

cmd({
    pattern: "block",
    desc: "Block a user",
    category: "owner",
    react: "🚫",
    filename: __filename
},
async (conn, m, { reply, q, react }) => {

    // ✅ OWNER CHECK (100% SAFE)
    const ownerNum = conn.user.id.split(":")[0];
    if (!m.sender.includes(ownerNum)) {
        await react("❌");
        return reply("❌ Only bot owner can use this command");
    }

    const jid = await getTargetJid(m, q);
    if (!jid) {
        await react("❌");
        return reply("❌ Reply / mention / number do");
    }

    try {
        await conn.updateBlockStatus(jid, "block");
        await react("✅");
        return reply(`🚫 Blocked @${jid.split("@")[0]}`, { mentions: [jid] });
    } catch (e) {
        console.log("BLOCK ERROR:", e);
        await react("❌");
        return reply("❌ Block failed");
    }
});

cmd({
    pattern: "unblock",
    desc: "Unblock a user",
    category: "owner",
    react: "🔓",
    filename: __filename
},
async (conn, m, { reply, q, react }) => {

    const ownerNum = conn.user.id.split(":")[0];
    if (!m.sender.includes(ownerNum)) {
        await react("❌");
        return reply("❌ Only bot owner can use this command");
    }

    const jid = await getTargetJid(m, q);
    if (!jid) {
        await react("❌");
        return reply("❌ Reply / mention / number do");
    }

    try {
        await conn.updateBlockStatus(jid, "unblock");
        await react("✅");
        return reply(`🔓 Unblocked @${jid.split("@")[0]}`, { mentions: [jid] });
    } catch (e) {
        console.log("UNBLOCK ERROR:", e);
        await react("❌");
        return reply("❌ Unblock failed");
    }
});