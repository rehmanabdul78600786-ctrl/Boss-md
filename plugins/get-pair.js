const { cmd } = require('../command');
const axios = require('axios');

// 🎨 DESIGN ELEMENTS ONLY - NO FUNCTIONALITY CHANGES
const DESIGN = {
    header: "╔═══════════════════════════╗\n║     🚀 BOSS-MD PAIRING     ║\n╚═══════════════════════════╝",
    footer: "╔═══════════════════════════╗\n║   🔧 BOSS-MD CLONING SYSTEM   ║\n╚═══════════════════════════╝",
    line: "━━━━━━━━━━━━━━━━━━━━",
    successIcon: "✅",
    errorIcon: "❌",
    phoneIcon: "📱",
    codeIcon: "🔐",
    timeIcon: "⏰"
};

// 📌 ORIGINAL CODE WITH ONLY DESIGN ADDED
cmd({
    pattern: "pair",
    alias: ["getpair", "clonebot"],
    react: "✅",
    desc: "Get pairing code for BOSS-MD_ bot",
    category: "download",
    use: ".pair 923452401XXX",
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, senderNumber, reply }) => {
    try {
        // 🎯 ORIGINAL NUMBER EXTRACTION - NO CHANGES
        const phoneNumber = q ? q.trim().replace(/[^0-9]/g, '') : senderNumber.replace(/[^0-9]/g, '');

        // 🎯 ORIGINAL VALIDATION - NO CHANGES
        if (!phoneNumber || phoneNumber.length < 10 || phoneNumber.length > 15) {
            return await reply(`${DESIGN.header}\n\n${DESIGN.errorIcon} *Please provide a valid phone number without \`+\`*\n\n💡 Example: \`.pair 923452401XXX\`\n${DESIGN.footer}`);
        }

        // 🎯 ORIGINAL API CALL - NO CHANGES
        const response = await axios.get(`https://pairing-site-boss-874t.onrender.com/code?number=${encodeURIComponent(phoneNumber)}`);

        // 🎯 ORIGINAL RESPONSE CHECK - NO CHANGES
        if (!response.data || !response.data.code) {
            return await reply(`${DESIGN.header}\n\n${DESIGN.errorIcon} *Failed to retrieve pairing code. Please try again later.*\n${DESIGN.footer}`);
        }

        const pairingCode = response.data.code;
        const doneMessage = `${DESIGN.header}\n\n${DESIGN.successIcon} *𝘽𝙊𝙎𝙎-𝙈𝘿 PAIRING COMPLETED*`;

        // 🎯 ORIGINAL MESSAGES WITH DESIGN
        await reply(`${doneMessage}\n\n${DESIGN.codeIcon} *Your pairing code is:* ${pairingCode}\n${DESIGN.phoneIcon} *Number:* ${phoneNumber}\n${DESIGN.timeIcon} *Time:* ${new Date().toLocaleTimeString()}\n\n${DESIGN.line}`);

        // 🎯 ORIGINAL DELAY - NO CHANGES
        await new Promise(resolve => setTimeout(resolve, 2000));

        // 🎯 ORIGINAL CLEAN CODE MESSAGE WITH DESIGN
        await reply(`${DESIGN.codeIcon} *Pairing Code:*\n\`\`\`${pairingCode}\`\`\`\n\n💡 *Copy this code to link your device*`);

        // 🎯 ADDITIONAL DESIGN MESSAGE (OPTIONAL)
        await new Promise(resolve => setTimeout(resolve, 1000));
        await reply(`${DESIGN.footer}\n⚡ *BOSS-MD Cloning System Ready*`);

    } catch (error) {
        console.error("Pair command error:", error);
        
        // 🎯 ORIGINAL ERROR MESSAGE WITH DESIGN
        const errorDesign = `${DESIGN.header}\n\n${DESIGN.errorIcon} *An error occurred while getting pairing code.*\n\n🔧 *Details:* ${error.message || "Unknown error"}\n\n⚠️ *Please try again later.*\n${DESIGN.footer}`;
        
        await reply(errorDesign);
    }
});

// 📌 ADDITIONAL DESIGN-ONLY COMMAND (OPTIONAL)
cmd({
    pattern: "pairinfo",
    alias: ["pairhelp"],
    react: "ℹ️",
    desc: "Show pairing system information",
    category: "info",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    const infoMessage = `${DESIGN.header}\n\n📱 *PAIRING SYSTEM INFORMATION*\n\n${DESIGN.line}\n\n🔧 *Command:* .pair <number>\n💡 *Example:* .pair 923452401XXX\n📞 *Format:* Without + sign\n⏱️ *Code Validity:* 15 minutes\n\n${DESIGN.line}\n\n⚠️ *Note:*\n• Code is one-time use\n• Keep it confidential\n• Use within time limit\n\n${DESIGN.footer}`;
    
    await reply(infoMessage);
});