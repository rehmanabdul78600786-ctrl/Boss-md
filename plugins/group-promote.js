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
        if (!citel.isGroup) return citel.reply("❌ This command only works in groups!");

        // ✅ SENDER ADMIN CHECK (AS-IS)
        if (!citel.isAdmin && !citel.isCreator) {
            return citel.reply("❌ Only admins or owner can promote!");
        }

        // ✅ BOT ADMIN CHECK (FIXED)
        if (!citel.isBotAdmin) {
            return citel.reply("❌ Bot admin nahi hai!");
        }

        // TARGET
        let target;
        if (citel.quoted) {
            target = citel.quoted.sender;
        } else if (citel.mentionedJid?.[0]) {
            target = citel.mentionedJid[0];
        } else {
            return citel.reply("❌ Reply ya mention karo!");
        }

        // PROMOTE
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
        citel.reply("❌ Promote failed");
    }
});