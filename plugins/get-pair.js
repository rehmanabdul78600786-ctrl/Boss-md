const { cmd } = require('../command');
const axios = require('axios');

// Backup API endpoints
const API_ENDPOINTS = [
    "https://pairing-site-boss-874t.onrender.com/code?number=",
    "https://api.lolhuman.xyz/api/pairing?apikey=GataDios&number=",
    "https://api.botcahx.live/api/pairing?number="
];

cmd({
    pattern: "pair",
    alias: ["getpair", "clonebot"],
    react: "🔗",
    desc: "Get pairing code for BOSS-MD bot",
    category: "tools",
    use: ".pair 923452401XXX",
    filename: __filename
}, async (conn, mek, m, { from, q, senderNumber, reply }) => {
    try {
        // Extract phone number
        const phoneNumber = q ? q.trim().replace(/[^0-9]/g, '') : senderNumber.replace(/[^0-9]/g, '');
        
        if (!phoneNumber || phoneNumber.length < 10) {
            return await reply("❌ *Valid number likho*\nExample: `.pair 923452401XXX`\nExample: `.pair` (apna number)");
        }
        
        // Trying message
        const tryingMsg = await reply(`🔍 *Trying to get code...*\n📱 Number: ${phoneNumber}\n⏳ Please wait...`);
        
        let pairingCode = null;
        let usedAPI = "Primary";
        
        // Try multiple APIs one by one
        for (let apiUrl of API_ENDPOINTS) {
            try {
                const fullUrl = apiUrl + encodeURIComponent(phoneNumber);
                console.log(`Trying API: ${apiUrl.substring(0, 50)}...`);
                
                // Try with shorter timeout
                const response = await axios.get(fullUrl, { 
                    timeout: 5000 // 5 seconds timeout
                });
                
                if (response.data && response.data.code) {
                    pairingCode = response.data.code;
                    usedAPI = apiUrl.includes("lolhuman") ? "Backup 1" : 
                              apiUrl.includes("botcahx") ? "Backup 2" : "Main";
                    break;
                }
            } catch (apiError) {
                console.log(`API failed: ${apiError.message}`);
                continue; // Try next API
            }
        }
        
        // Delete trying message
        if (tryingMsg.key) {
            try {
                await conn.sendMessage(from, { delete: tryingMsg.key });
            } catch (e) {}
        }
        
        if (!pairingCode) {
            return await reply(`❌ *Sab APIs fail ho gayi!*\n\n📱 *Number:* ${phoneNumber}\n\n💡 *Try these:*\n1. 2-3 minute wait karo\n2. Different number try karo\n3. Baad mein try karo\n\n⚠️ Servers busy hain`);
        }
        
        // Send success messages (original style)
        await reply(`> *𝘽𝙊𝙎𝙎-𝙈𝘿 PAIRING COMPLETED*\n\n*Your pairing code is:* ${pairingCode}`);
        
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        await reply(`${pairingCode}`);
        
        // Optional: Send usage instructions
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        await reply(`💡 *How to use:*\n1. WhatsApp > Settings > Linked Devices\n2. "Link a Device" par click karo\n3. Ye code enter karo: ${pairingCode}\n4. 15 minute tak valid hai`);
        
    } catch (error) {
        console.error("Final pair error:", error);
        await reply("❌ System error! Thori der baad try karo.");
    }
});

// Simple working version (no API calls - manual method)
cmd({
    pattern: "pair2",
    alias: ["manualpair", "pairmanual"],
    react: "📱",
    desc: "Manual pairing method",
    category: "tools",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    await reply(`📱 *MANUAL PAIRING METHOD*\n\n1. *WhatsApp Web kholo*\n2. *QR code dikhega*\n3. *Ye link use karo:*\nhttps://web.whatsapp.com/\n4. *Phone se scan karo*\n\n🔧 *BOSS-MD Setup:*\n• Bot ko phone pe install karo\n• WhatsApp link karo\n• Ready ho jayega!\n\n💡 Auto pairing abhi available nahi hai`);
});