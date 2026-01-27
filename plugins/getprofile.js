const { cmd } = require('../command');

cmd({
    pattern: "getprofile",
    alias: ["profile", "dp", "pp"],
    desc: "Get user profile picture",
    category: "tools",
    react: "📸",
    filename: __filename,
    use: ".getprofile [@user]"
}, async (conn, mek, m, { from, reply, text, mentioned, pushName }) => {
    try {
        console.log("📸 getprofile command received");
        
        let userId;
        
        // 1. Check if user mentioned
        if (mentioned && mentioned.length > 0) {
            userId = mentioned[0];
        } 
        // 2. Check if quoted message
        else if (m.quoted && m.quoted.sender) {
            userId = m.quoted.sender;
        }
        // 3. Use sender's own ID
        else {
            userId = m.sender;
        }
        
        console.log("Getting profile for:", userId);
        
        // Try to get profile picture
        let profileUrl;
        try {
            // Method 1: Baileys
            profileUrl = await conn.profilePictureUrl(userId, 'image');
        } catch (picError) {
            console.log("Profile pic error:", picError.message);
            
            // Method 2: Alternative if first fails
            try {
                const chat = await conn.chatById(userId);
                profileUrl = chat?.profilePicUrl;
            } catch (chatError) {
                console.log("Chat fetch error:", chatError.message);
            }
        }
        
        if (profileUrl) {
            // Send profile picture
            await conn.sendMessage(from, {
                image: { url: profileUrl },
                caption: `📸 *Profile Picture*\n\n👤 *User:* @${userId.split('@')[0]}\n📛 *Name:* ${pushName || "Unknown"}\n🆔 *ID:* ${userId.split('@')[0]}\n\n✅ _Powered by BOSS-MD_`,
                mentions: [userId]
            }, { quoted: mek });
            
            // React with ✅
            await conn.sendMessage(from, {
                react: { text: "✅", key: m.key }
            });
            
        } else {
            // Send error message
            await reply(`❌ *Profile picture not available*\n\nUser: @${userId.split('@')[0]}\n\n💡 *Note:* User ne privacy settings mein profile picture hide kiya hua hai.`);
        }
        
    } catch (error) {
        console.error("GETPROFILE ERROR:", error);
        
        // Fallback message
        await reply(`❌ *Error fetching profile*\n\nError: ${error.message || "Unknown"}\n\n💡 Use: .getprofile @user\nOr reply to someone's message with .getprofile`);
    }
});
