const { cmd } = require('../command');

cmd({
    pattern: "demote",
    alias: ["d", "dismiss", "removeadmin"],
    desc: "Demotes a group admin to a normal member",
    category: "admin",
    react: "⬇️",
    filename: __filename
},
async (Void, citel) => {
    try {
        if (!citel.isGroup)
            return citel.reply("❌ Group only command!");

        const botNumber = Void.user.jid;

        // Get target
        let target;
        if (citel.quoted) target = citel.quoted.sender;
        else if (citel.mentionedJid && citel.mentionedJid[0]) target = citel.mentionedJid[0];
        else return citel.reply("❌ Reply ya mention karo!");

        // Prevent demoting bot itself
        if (target === botNumber)
            return citel.reply("❌ Main khud ko demote nahi kar sakta.");

        await Void.groupParticipantsUpdate(
            citel.chat,
            [target],
            "demote"
        );

        return citel.reply(
            `✅ @${target.split("@")[0]} ko admin se normal member bana diya`,
            { mentions: [target] }
        );

    } catch (e) {
        console.log("DEMOTE ERROR =>", e);
        citel.reply("❌ Demote fail (WhatsApp ne reject kar diya)");
    }
});