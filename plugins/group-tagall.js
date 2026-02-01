const { cmd } = require('../command');

cmd({
    pattern: "tagall",
    react: "🔊",
    alias: ["gc_tagall"],
    desc: "To Tag all Members",
    category: "group",
    use: '.tagall [message]',
    filename: __filename
},
async (conn, mek, m, { from, participants, reply, isGroup, senderNumber, groupAdmins, prefix, command, args, body }) => {
    try {
        if (!isGroup) return reply("❌ This command can only be used in groups.");

        // === 1. SAFELY GET SENDER AND BOT NUMBERS ===
        let senderJid = null;
        let botJid = null;

        try {
            // Get sender's JID safely - it might be in different formats
            senderJid = senderNumber || m?.sender || mek?.sender;
            // Get bot's JID safely
            botJid = conn.user?.jid || conn.user?.id;
        } catch (e) {
            return reply("❌ Could not identify user or bot.");
        }

        if (!senderJid || !botJid) {
            return reply("❌ User or bot identification failed.");
        }

        // Clean JIDs (ensure proper format)
        const cleanJid = (jid) => {
            if (!jid) return null;
            // Remove any suffixes and ensure proper format
            return jid.split(":")[0]?.split("@")[0] + "@s.whatsapp.net";
        };

        const cleanSenderJid = cleanJid(senderJid);
        const cleanBotJid = cleanJid(botJid);

        if (!cleanSenderJid || !cleanBotJid) {
            return reply("❌ Invalid user or bot JID format.");
        }

        // === 2. GET GROUP INFO SAFELY ===
        let groupInfo, groupName, totalMembers;
        try {
            groupInfo = await conn.groupMetadata(from);
            groupName = groupInfo.subject || "Unknown Group";
            totalMembers = participants?.length || groupInfo.participants?.length || 0;
        } catch (groupErr) {
            return reply("❌ Failed to fetch group information.");
        }

        if (totalMembers === 0 || !participants) {
            return reply("❌ No members found in this group.");
        }

        // === 3. CHECK ADMIN PERMISSIONS ===
        let cleanGroupAdmins = [];
        try {
            // Ensure groupAdmins is an array and clean each JID
            if (Array.isArray(groupAdmins)) {
                cleanGroupAdmins = groupAdmins
                    .map(jid => cleanJid(jid))
                    .filter(jid => jid !== null);
            }
        } catch (adminErr) {
            console.log("Admin parsing error:", adminErr);
        }

        // Check if sender is admin
        if (!cleanGroupAdmins.includes(cleanSenderJid)) {
            return reply("❌ Only group admins can use this command.");
        }

        // Check if bot is admin
        if (!cleanGroupAdmins.includes(cleanBotJid)) {
            return reply("❌ I need to be an admin to tag everyone.");
        }

        // === 4. PREPARE MESSAGE ===
        const emojis = ['📢', '🔊', '🌐', '🔰', '❤‍🩹', '🤍', '🖤', '🩵', '📝', '💗', '🔖', '🪩', '📦', '🎉', '🛡️', '💸', '⏳', '🗿', '🚀', '🎧', '🪀', '⚡', '🚩', '🍁', '🗣️', '👻', '⚠️', '🔥'];
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

        // Extract message from command
        let message = args.join(" ").trim();
        if (!message || message === "") {
            message = "Attention Everyone!";
        }

        // === 5. BUILD TAG TEXT SAFELY ===
        let teks = `▢ *Group* : ${groupName}\n`;
        teks += `▢ *Members* : ${totalMembers}\n`;
        teks += `▢ *Message* : ${message}\n\n`;
        teks += "┌───⊷ *MENTIONS*\n";

        // Collect valid member mentions
        let validParticipants = [];
        
        for (let i = 0; i < participants.length; i++) {
            const mem = participants[i];
            if (!mem || !mem.id) {
                continue; // Skip invalid members
            }

            // Clean member JID
            const memberJid = cleanJid(mem.id);
            if (!memberJid) continue;

            // Get the number part for display
            const numberPart = memberJid.split("@")[0];
            teks += `│ ${randomEmoji} @${numberPart}\n`;
            validParticipants.push(memberJid);
        }

        if (validParticipants.length === 0) {
            return reply("❌ No valid members to tag.");
        }

        teks += "└──✪ BOSS ┃ 𝐌𝐃 ✪──";

        // === 6. SEND MESSAGE ===
        await conn.sendMessage(
            from, 
            { 
                text: teks, 
                mentions: validParticipants 
            }, 
            { quoted: mek }
        );

        // Optional: Send confirmation
        // await reply(`✅ Successfully tagged ${validParticipants.length} members!`);

    } catch (error) {
        console.error("TagAll Full Error:", error);
        // Provide more specific error message
        let errorMsg = `❌ *Error Occurred !!*\n\n`;
        
        if (error.message.includes("split")) {
            errorMsg += `Split error: Check if user IDs are properly formatted.\n`;
        }
        
        errorMsg += `Error: ${error.message || "Unknown error"}\n`;
        errorMsg += `At: ${error.stack ? error.stack.split("\n")[1] : "Unknown location"}`;
        
        reply(errorMsg);
    }
});