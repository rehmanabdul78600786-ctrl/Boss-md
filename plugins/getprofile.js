const { cmd } = require('../command');

cmd({
    pattern: "getprofile",
    alias: ["pp", "profilepic", "picture"],
    react: "📷",
    desc: "Get user's profile picture",
    category: "utility",
    filename: __filename
}, async (conn, mek, m, { from, args, reply, sender, text }) => {
    try {
        // Get the user to fetch profile picture for
        let userId;
        
        // If replied to a message, get that user's ID
        if (mek.message?.extendedTextMessage?.contextInfo?.participant) {
            userId = mek.message.extendedTextMessage.contextInfo.participant;
        } 
        // If user mentioned someone with @
        else if (text.includes('@')) {
            userId = text.replace('@', '').split(' ')[0] + '@s.whatsapp.net';
        }
        // If user provided a number
        else if (args[0] && args[0].match(/\d+/)) {
            const number = args[0].replace(/[^0-9]/g, '');
            userId = number + '@s.whatsapp.net';
        }
        // Default: sender's own profile picture
        else {
            userId = sender;
        }

        // Get profile picture
        const ppUrl = await conn.profilePictureUrl(userId, 'image');
        
        if (!ppUrl) {
            return reply("❌ Profile picture not found or user has no profile picture.");
        }

        // Send the profile picture with caption
        const caption = `📷 *Profile Picture*\n\n👤 User: ${userId.split('@')[0]}\n🔗 Download URL: ${ppUrl}`;
        
        await conn.sendMessage(from, {
            image: { url: ppUrl },
            caption: caption,
            quoted: mek
        });

        // Optional: Send success reaction
        await conn.sendMessage(from, { react: { text: "✅", key: m.key } });

    } catch (error) {
        console.error('Profile picture error:', error);
        
        if (error.message?.includes('404') || error.message?.includes('not found')) {
            reply("❌ Profile picture not found. User might have no profile picture or it's private.");
        } else {
            reply("❌ Error fetching profile picture. Please try again.");
        }
        
        await conn.sendMessage(from, { react: { text: "❌", key: m.key } });
    }
});

// Bonus: Group profile picture command
cmd({
    pattern: "grouppp",
    alias: ["groupicon", "gcicon"],
    react: "🏙️",
    desc: "Get group's profile picture",
    category: "group",
    filename: __filename
}, async (conn, mek, m, { from, args, reply, isGroup }) => {
    try {
        if (!isGroup) {
            return reply("❌ This command only works in groups!");
        }

        // Get group profile picture
        const ppUrl = await conn.profilePictureUrl(from, 'image');
        
        if (!ppUrl) {
            return reply("❌ Group has no profile picture!");
        }

        // Get group metadata for caption
        const groupMetadata = await conn.groupMetadata(from);
        
        const caption = `🏙️ *Group Profile Picture*\n\n📛 Group: ${groupMetadata.subject}\n👥 Participants: ${groupMetadata.participants.length}\n🔗 Download URL: ${ppUrl}`;
        
        await conn.sendMessage(from, {
            image: { url: ppUrl },
            caption: caption,
            quoted: mek
        });

        await conn.sendMessage(from, { react: { text: "✅", key: m.key } });

    } catch (error) {
        console.error('Group profile picture error:', error);
        reply("❌ Error fetching group profile picture. The group might have no icon.");
        await conn.sendMessage(from, { react: { text: "❌", key: m.key } });
    }
});