const { cmd } = require('../command');

cmd({
    pattern: "promote",
    alias: ["p", "makeadmin"],
    desc: "Promotes a member to group admin",
    category: "admin",
    react: "⬆️",
    filename: __filename
},
async (conn, mek, m) => {
    try {
        if (!m.isGroup) return m.reply("❌ This command only works in groups!");

        // Fetch group metadata
        const groupInfo = await conn.groupMetadata(m.chat);
        if (!groupInfo) return m.reply("❌ Failed to fetch group info.");

        // Owner ID
        const ownerId = groupInfo.owner.split(':')[0] + "@s.whatsapp.net";

        // Group admins (number-only format)
        const groupAdmins = groupInfo.participants
            .filter(p => p.admin)
            .map(p => p.id.split(':')[0] + "@s.whatsapp.net");

        // Sender ID (number-only)
        const senderId = m.sender.split(':')[0] + "@s.whatsapp.net";

        // Check if sender is admin or owner
        if (!(groupAdmins.includes(senderId) || senderId === ownerId)) {
            return m.reply("❌ Only admins or the group owner can promote members!");
        }

        // Bot admin check (number-only)
        const botId = conn.user.id.split(':')[0] + "@s.whatsapp.net";
        if (!groupAdmins.includes(botId)) {
            return m.reply("❌ I need to be an admin to promote members!");
        }

        // Get target user
        let target;
        if (m.quoted) {
            target = m.quoted.sender;
        } else if (m.mentionedJid && m.mentionedJid[0]) {
            target = m.mentionedJid[0];
        } else {
            return m.reply("❌ Please reply to a message or mention a user!");
        }

        const targetId = target.split(':')[0] + "@s.whatsapp.net";

        // Check if target is already admin
        if (groupAdmins.includes(targetId) || targetId === ownerId) {
            return m.reply("⚠️ This user is already an admin!");
        }

        // Promote the user
        await conn.groupParticipantsUpdate(m.chat, [targetId], "promote");

        // Success message
        m.reply(`✅ @${targetId.split('@')[0]} has been promoted to admin!`, {
            mentions: [targetId]
        });

    } catch (error) {
        console.error("Promote Error:", error);
        m.reply("❌ Failed to promote user. Please try again.");
    }
});