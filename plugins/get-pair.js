const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "pair",
    alias: ["getpair", "clonebot", "linkbot", "paircode"],
    react: "🔗",
    desc: "Generate pairing code for BOSS-MD bot cloning",
    category: "tools",
    use: ".pair <number> or just .pair",
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, senderNumber, reply, sender }) => {
    try {
        // Extract phone number (with better handling)
        let phoneNumber = "";
        
        if (q && q.trim() !== "") {
            // If user provided number in command
            phoneNumber = q.trim().replace(/[^0-9]/g, '');
        } else if (senderNumber) {
            // Use sender's number if no number provided
            phoneNumber = senderNumber.replace(/[^0-9]/g, '');
        } else {
            // Fallback to sender ID
            phoneNumber = sender.replace(/[^0-9]/g, '');
        }

        // Validate phone number
        if (!phoneNumber || phoneNumber.length < 10) {
            return await reply(`📱 *PAIRING SYSTEM*\n\n❌ *Invalid Phone Number*\nPlease provide a valid 10+ digit number\n\n💡 *Example:* \`.pair 923452401XXX\`\n💡 *Example:* \`.pair\` (uses your number)`);
        }

        // Show processing message
        const processingMsg = await reply(`🔍 *Generating Pairing Code...*\n📞 Number: +${phoneNumber}\n⏳ Please wait...`);

        // Make API request
        const response = await axios.get(
            `https://pairing-site-boss-874t.onrender.com/code?number=${encodeURIComponent(phoneNumber)}`,
            { timeout: 10000 }
        );

        if (!response.data || !response.data.code) {
            await conn.sendMessage(from, { delete: processingMsg.key });
            return await reply(`❌ *API Error*\nFailed to retrieve pairing code.\n\n🔧 *Possible reasons:*\n1. Server is down\n2. Invalid number format\n3. Try again in 2 minutes`);
        }

        const pairingCode = response.data.code;
        
        // Delete processing message
        await conn.sendMessage(from, { delete: processingMsg.key });

        // Send success message with styling
        await reply(`✅ *PAIRING CODE GENERATED*\n\n🔐 *Code:* \`${pairingCode}\`\n📱 *Number:* +${phoneNumber}\n⏰ *Generated:* ${new Date().toLocaleTimeString()}\n\n💡 *How to use:*\n1. Open WhatsApp > Linked Devices\n2. Tap "Link a Device"\n3. Enter this 6-digit code\n4. Wait for verification\n\n⚠️ *Note:* Code expires in 15 minutes`);

        // Optional: Send code separately after 1 second
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        await reply(`📋 *Copy this code:*\n\`\`\`${pairingCode}\`\`\``);

    } catch (error) {
        console.error("Pair command error:", error);
        
        // Handle different types of errors
        let errorMessage = "❌ An error occurred while getting pairing code.";
        
        if (error.code === 'ECONNABORTED') {
            errorMessage = "❌ Request timeout. Server might be busy. Try again in 1 minute.";
        } else if (error.response) {
            errorMessage = `❌ Server error: ${error.response.status}`;
        } else if (error.request) {
            errorMessage = "❌ No response from server. Check your internet connection.";
        }
        
        await reply(errorMessage);
    }
});

// Optional: Add a simple help command for pairing
cmd({
    pattern: "pairhelp",
    alias: ["pairinghelp"],
    react: "❓",
    desc: "Show pairing system help",
    category: "help",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    await reply(`📱 *PAIRING SYSTEM HELP*\n\n🎯 *Commands:*\n• .pair <number> - Get pairing code for specific number\n• .pair - Get code for your own number\n• .pairhelp - Show this help\n\n💡 *Examples:*\n\`.pair 923452401XXX\`\n\`.pair 918123456789\`\n\`.pair\` (auto-detect your number)\n\n⚠️ *Important:*\n• Number must be 10-15 digits\n• No + sign needed\n• Code expires in 15 minutes\n• One-time use only\n\n🔧 *BOSS-MD Cloning System*`);
});