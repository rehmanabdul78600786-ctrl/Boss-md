const { cmd } = require('../command');

cmd({
    pattern: "promote",
    alias: ["p", "makeadmin"],
    desc: "Promotes a member to group admin",
    category: "admin",
    react: "⬆️",
    filename: __filename
},
async (Void, citel) => {
    try {
        if (!citel.isGroup)
            return citel.reply("❌ Group only command!");

        // ❌ admin check
        // ❌ NO bot admin check
        // WhatsApp khud handle karega

        let target;
        if (citel.quoted) {
            target = citel.quoted.sender;
        } else if (citel.mentionedJid && citel.mentionedJid[0]) {
            target = citel.mentionedJid[0];
        } else {
            return citel.reply("❌ Reply ya mention karo!");
        }

        await Void.groupParticipantsUpdate(
            citel.chat,
            [target],
            "promote"
        );

        return citel.reply(
            `✅ @${target.split("@")[0]} admin bana diya`,
            { mentions: [target] }
        );

    } catch (e) {
        console.log("PROMOTE ERROR =>", e);
        citel.reply("❌ Promote fail (WhatsApp ne reject kar diya)");
    }
});