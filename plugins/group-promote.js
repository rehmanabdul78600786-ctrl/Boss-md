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

        // ❌ SENDER ADMIN CHECK HATA DIYA (BUGGY HAI)
        // WhatsApp khud handle karega

        // ✅ BOT ADMIN CHECK (YE ZAROORI HAI)
        if (!citel.isBotAdmin)
            return citel.reply("❌ Bot admin nahi hai!");

        // TARGET
        let target;
        if (citel.quoted) {
            target = citel.quoted.sender;
        } else if (citel.mentionedJid && citel.mentionedJid[0]) {
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
            `✅ @${target.split("@")[0]} ko admin bana diya`,
            { mentions: [target] }
        );

    } catch (e) {
        console.log("PROMOTE ERROR =>", e);
        citel.reply("❌ Promote fail (WhatsApp reject)");
    }
});