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
        let groupInfo = await conn.groupMetadata(m.chat).catch(() => null);
        if (!groupInfo) return m.reply("❌ Failed to fetch group info.");

        // Get group admins
        const groupAdmins = groupInfo.participants
            .filter(p => p.admin || p.admin === 'superadmin') // include owner
            .map(p => p.id);

        // Clean sender number for comparison
        const senderNum = m.sender.split('@')[0];

        if (!groupAdmins.includes(m.sender)) {
            return m.reply("❌ Only admins or the group owner can promote members!");
        }

        // Bot admin check
        const botNumber = conn.user.id.split(":")[0] + "@s.whatsapp.net";
        if (!groupAdmins.includes(botNumber)) {
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

        // Check if target is already admin
        if (groupAdmins.includes(target)) {
            return m.reply("⚠️ This user is already an admin!");
        }

        // Promote the user
        await conn.groupParticipantsUpdate(m.chat, [target], "promote");

        // Success message
        m.reply(`✅ @${target.split('@')[0]} has been promoted to admin!`, { 
            mentions: [target] 
        });

    } catch (error) {
        console.error("Promote Error:", error);
        m.reply("❌ Failed to promote user. Please try again.");
    }
});