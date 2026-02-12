const { cmd } = require('../command');
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

cmd({
    pattern: "kickall",
    alias: ["removeall", "endgc"],
    desc: "Remove all members from group except bot and owner.",
    react: "🔥",
    category: "group",
    filename: __filename,
},
async (conn, mek, m, {
    from, isGroup, senderNumber, isBotAdmins, reply
}) => {
    try {

        if (!isGroup)
            return reply("This command can only be used in groups.");

        const botOwner = conn.user.id.split(":")[0];
        const botJid = conn.user.id;

        if (senderNumber !== botOwner)
            return reply("Only the bot owner can use this command.");

        if (!isBotAdmins)
            return reply("I need to be an admin to execute this command.");

        // 🔥 Fresh metadata
        const metadata = await conn.groupMetadata(from);
        const participants = metadata.participants;

        // Skip bot & owner
        const usersToRemove = participants.filter(user =>
            user.id !== botJid &&
            user.id !== `${botOwner}@s.whatsapp.net`
        );

        if (usersToRemove.length === 0)
            return reply("No members to remove.");

        reply(`Starting to remove ${usersToRemove.length} members...`);

        for (let user of usersToRemove) {
            try {
                await conn.groupParticipantsUpdate(from, [user.id], "remove");
                await sleep(1500); // safe delay
            } catch (err) {
                console.log("Failed to remove:", user.id);
            }
        }

        reply("✅ KickAll completed successfully.");

    } catch (err) {
        console.error("KickAll Error:", err);
        reply("An error occurred while executing KickAll.");
    }
});