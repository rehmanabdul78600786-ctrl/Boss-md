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

        // === 1. GET JIDs WITH PROPER FORMATTING ===
        const getJid = (jid) => {
            if (!jid) return null;
            
            // Handle different JID formats
            // Format 1: 923012345678@s.whatsapp.net (already correct)
            // Format 2: 923012345678:12@s.whatsapp.net (with device)
            // Format 3: 923012345678:12@c.us (old format)
            
            // Remove device number if present
            let clean = jid.split(':')[0];
            
            // Ensure @s.whatsapp.net suffix
            if (!clean.includes('@')) {
                clean = clean + '@s.whatsapp.net';
            } else if (clean.includes('@c.us')) {
                clean = clean.replace('@c.us', '@s.whatsapp.net');
            } else if (!clean.includes('@s.whatsapp.net')) {
                clean = clean.split('@')[0] + '@s.whatsapp.net';
            }
            
            return clean;
        };

        // Get bot JID - IMPORTANT: Check different possible properties
        let botJid = null;
        if (conn.user && conn.user.jid) {
            botJid = getJid(conn.user.jid);
        } else if (conn.user && conn.user.id) {
            botJid = getJid(conn.user.id);
        }
        
        if (!botJid) {
            console.log("Bot JID Debug:", conn.user);
            return reply("❌ Could not identify bot JID.");
        }

        // Get sender JID
        let senderJid = null;
        if (senderNumber) {
            senderJid = getJid(senderNumber);
        } else if (m && m.sender) {
            senderJid = getJid(m.sender);
        } else if (mek && mek.sender) {
            senderJid = getJid(mek.sender);
        }
        
        if (!senderJid) {
            return reply("❌ Could not identify sender.");
        }

        console.log("DEBUG - Bot JID:", botJid);
        console.log("DEBUG - Sender JID:", senderJid);

        // === 2. GET GROUP METADATA DIRECTLY ===
        let groupInfo, groupName, allParticipants, allAdmins;
        try {
            groupInfo = await conn.groupMetadata(from);
            groupName = groupInfo.subject || "Unknown Group";
            allParticipants = groupInfo.participants || participants || [];
            allAdmins = groupInfo.participants 
                .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
                .map(p => getJid(p.id));
                
            console.log("DEBUG - Group Admins:", allAdmins);
            console.log("DEBUG - Total Admins:", allAdmins.length);
            console.log("DEBUG - Bot in Admins?", allAdmins.includes(botJid));
            console.log("DEBUG - Sender in Admins?", allAdmins.includes(senderJid));
            
        } catch (groupErr) {
            console.error("Group metadata error:", groupErr);
            return reply("❌ Failed to fetch group information.");
        }

        // === 3. CHECK PERMISSIONS ===
        // Use group metadata admins instead of provided groupAdmins
        if (!allAdmins.includes(senderJid)) {
            return reply("❌ Only group admins can use this command.");
        }

        if (!allAdmins.includes(botJid)) {
            // Send a more helpful message
            return reply(`❌ I need to be an admin to tag everyone.\n\n` +
                       `*Bot JID:* ${botJid}\n` +
                       `*Make sure I'm promoted to admin first!*`);
        }

        // === 4. CHECK PARTICIPANTS ===
        if (!allParticipants || allParticipants.length === 0) {
            return reply("❌ No members found in this group.");
        }

        // === 5. PREPARE MESSAGE ===
        const emojis = ['📢', '🔊', '🌐', '🔰', '❤‍🩹', '🤍', '🖤', '🩵', '📝', '💗', '🔖', '🪩', '📦', '🎉', '🛡️', '💸', '⏳', '🗿', '🚀', '🎧', '🪀', '⚡', '🚩', '🍁', '🗣️', '👻', '⚠️', '🔥'];
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

        let message = args.join(" ").trim();
        if (!message) message = "Attention Everyone!";

        // === 6. BUILD TAG TEXT ===
        let teks = `▢ *Group* : ${groupName}\n`;
        teks += `▢ *Members* : ${allParticipants.length}\n`;
        teks += `▢ *Message* : ${message}\n\n`;
        teks += "┌───⊷ *MENTIONS*\n";

        let validParticipants = [];
        
        for (let mem of allParticipants) {
            if (!mem || !mem.id) continue;
            
            const memberJid = getJid(mem.id);
            if (!memberJid) continue;
            
            const numberPart = memberJid.split("@")[0];
            teks += `│ ${randomEmoji} @${numberPart}\n`;
            validParticipants.push(memberJid);
        }

        if (validParticipants.length === 0) {
            return reply("❌ No valid members to tag.");
        }

        teks += "└──✪ BOSS ┃ 𝐌𝐃 ✪──";

        // === 7. SEND MESSAGE ===
        await conn.sendMessage(
            from, 
            { 
                text: teks, 
                mentions: validParticipants 
            }, 
            { quoted: mek }
        );

        // Optional success message
        // await reply(`✅ Tagged ${validParticipants.length} members successfully!`);

    } catch (error) {
        console.error("TagAll Error Details:", error);
        reply(`❌ Error: ${error.message || "Unknown error occurred"}`);
    }
});