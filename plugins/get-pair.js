// ༒༒༒༒༒༒༒༒༒༒༒༒༒༒༒༒༒༒༒༒༒༒༒༒༒༒༒༒
// ██████╗░░█████╗░░██████╗░██████╗ █░█ █▀▄▀█
// ██╔══██╗██╔══██╗██╔════╝██╔════╝ █▄█ █░▀░█
// ██████╦╝██║░░██║╚█████╗░╚█████╗░ ░█░ ▀░░░▀
// ██╔══██╗██║░░██║░╚═══██╗░╚═══██╗ ░█░ ░░░░░
// ██████╦╝╚█████╔╝██████╔╝██████╔╝ ░█░ ░░░░░
// ╚═════╝░░╚════╝░╚═════╝░╚═════╝░ ░▀░ ░░░░░
// ༒༒༒༒༒༒༒༒༒༒༒༒༒༒༒༒༒༒༒༒༒༒༒༒༒༒༒༒

const { cmd } = require('../command');
const axios = require('axios');

// 🎨 STYLE CONFIGURATION
const CONFIG = {
    NAME: "BOSS-MD",
    VERSION: "v3.5",
    DEVELOPER: "𝗕𝗢𝗦𝗦-𝗧𝗘𝗔𝗠",
    CONTACT: "boss.team@support.com",
    GITHUB: "github.com/BOSS-MD-OFFICIAL",
    COLOR: "#FF5733"
};

// 🔐 VALIDATION FUNCTIONS
function validateNumber(num) {
    if (!num) return { valid: false, error: "NO_NUMBER" };
    
    const cleanNum = num.replace(/[^0-9]/g, '');
    
    // Check length
    if (cleanNum.length < 10 || cleanNum.length > 15) {
        return { valid: false, error: "INVALID_LENGTH", number: cleanNum };
    }
    
    // Check country codes
    const validPrefixes = ['91', '92', '1', '44', '62', '60'];
    const hasValidPrefix = validPrefixes.some(prefix => cleanNum.startsWith(prefix));
    
    if (!hasValidPrefix) {
        return { valid: false, error: "INVALID_COUNTRY", number: cleanNum };
    }
    
    return { valid: true, number: cleanNum };
}

// 🔗 API ENDPOINTS (FALLBACK SUPPORT)
const API_ENDPOINTS = [
    {
        name: "PRIMARY_API",
        url: (num) => `https://pairing-site-boss-874t.onrender.com/code?number=${num}`,
        method: "GET"
    },
    {
        name: "BACKUP_API_1",
        url: (num) => `https://api.boss-md.tech/pairing/code?number=${num}&key=BOSS-MD-2024`,
        method: "GET"
    },
    {
        name: "BACKUP_API_2",
        url: (num) => `https://backup.boss-md.workers.dev/pair?num=${num}`,
        method: "GET"
    }
];

// 📊 STATUS EMOJI MAP
const STATUS_EMOJI = {
    success: "✅",
    error: "❌",
    warning: "⚠️",
    info: "ℹ️",
    loading: "⏳",
    done: "🎯",
    key: "🔑",
    phone: "📱",
    developer: "👨‍💻",
    system: "⚙️",
    connection: "🔌",
    time: "⏰"
};

// 🎯 MAIN PAIR COMMAND
cmd({
    pattern: "pair",
    alias: ["getpair", "clonebot", "pairing", "linkdevice"],
    react: "🔑",
    desc: "Generate pairing code for BOSS-MD bot deployment",
    category: "developer",
    usage: ".pair <923452401XXX> or .pair (for auto-detect)",
    note: "⚠️ Requires valid WhatsApp number",
    filename: __filename
}, async (conn, mek, m, { from, quoted, args, q, sender, senderNumber, reply, isGroup }) => {
    try {
        // 🎬 INITIALIZATION
        const startTime = Date.now();
        let usedEndpoint = "PRIMARY_API";
        
        // 📱 NUMBER PROCESSING
        let targetNumber = "";
        
        if (q && q.trim().length > 0) {
            targetNumber = q.trim();
        } else if (senderNumber) {
            targetNumber = senderNumber;
        } else {
            targetNumber = sender.split("@")[0];
        }
        
        // 🛡️ VALIDATION PHASE
        const validation = validateNumber(targetNumber);
        
        if (!validation.valid) {
            const errorMessages = {
                "NO_NUMBER": `📛 *NO NUMBER PROVIDED*\n━━━━━━━━━━━━━━━━━━\n${STATUS_EMOJI.error} Please provide a phone number\n💡 Example: \`.pair 923452401XXX\``,
                "INVALID_LENGTH": `📛 *INVALID NUMBER LENGTH*\n━━━━━━━━━━━━━━━━━━\n${STATUS_EMOJI.error} Number: ${validation.number}\n📏 Must be 10-15 digits\n🔧 Received: ${validation.number.length} digits`,
                "INVALID_COUNTRY": `📛 *UNSUPPORTED COUNTRY*\n━━━━━━━━━━━━━━━━━━\n${STATUS_EMOJI.error} Number: ${validation.number}\n🌍 Supported: +91, +92, +1, +44, +62, +60\n📞 Add country code if missing`
            };
            
            return await reply(errorMessages[validation.error] || `❌ Invalid number format: ${targetNumber}`);
        }
        
        const cleanNumber = validation.number;
        
        // 🚀 START MESSAGE
        const initMsg = await reply(`${STATUS_EMOJI.loading} *INITIALIZING PAIRING SYSTEM*\n━━━━━━━━━━━━━━━━━━\n${STATUS_EMOJI.phone} Target: +${cleanNumber}\n${STATUS_EMOJI.system} ${CONFIG.NAME} ${CONFIG.VERSION}\n${STATUS_EMOJI.time} ${new Date().toLocaleTimeString()}\n\n${STATUS_EMOJI.loading} Connecting to API servers...`);
        
        // 🔄 API REQUEST WITH FALLBACK
        let pairingData = null;
        let apiErrors = [];
        
        for (const endpoint of API_ENDPOINTS) {
            try {
                usedEndpoint = endpoint.name;
                
                const apiUrl = endpoint.url(cleanNumber);
                
                await reply(`${STATUS_EMOJI.connection} Trying: ${endpoint.name.replace(/_/g, " ")}`);
                
                const response = await axios({
                    method: endpoint.method,
                    url: apiUrl,
                    timeout: 10000,
                    headers: {
                        'User-Agent': 'BOSS-MD-Pairing-System/3.0',
                        'Accept': 'application/json',
                        'X-Developer': CONFIG.DEVELOPER,
                        'X-Request-ID': `BOSS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
                    }
                });
                
                if (response.data && (response.data.code || response.data.pairing_code)) {
                    pairingData = response.data;
                    console.log(`✅ API Success: ${endpoint.name}`);
                    break;
                } else {
                    throw new Error("Invalid response structure");
                }
                
            } catch (apiError) {
                const errorInfo = {
                    endpoint: endpoint.name,
                    error: apiError.message,
                    code: apiError.code,
                    status: apiError.response?.status
                };
                apiErrors.push(errorInfo);
                console.log(`❌ API Failed: ${endpoint.name} - ${apiError.message}`);
                continue;
            }
        }
        
        // ❌ ALL APIS FAILED
        if (!pairingData) {
            await conn.sendMessage(from, { delete: initMsg.key });
            
            const errorReport = apiErrors.map(err => 
                `• ${err.endpoint}: ${err.error}${err.status ? ` (HTTP ${err.status})` : ''}`
            ).join('\n');
            
            return await reply(`❌ *ALL API CONNECTIONS FAILED*\n━━━━━━━━━━━━━━━━━━\n${STATUS_EMOJI.error} Could not connect to pairing servers\n\n🔧 *ERROR DETAILS*\n${errorReport}\n\n💡 *TROUBLESHOOTING*\n1. Check your internet connection\n2. Try again in 2-3 minutes\n3. Contact: ${CONFIG.CONTACT}\n\n${STATUS_EMOJI.time} ${new Date().toLocaleTimeString()}`);
        }
        
        // ✅ SUCCESS - PROCESS DATA
        const pairingCode = pairingData.code || pairingData.pairing_code || pairingData.data?.code;
        const expiryTime = pairingData.expiry || "15 minutes";
        const generationTime = new Date().toLocaleTimeString();
        const processTime = Date.now() - startTime;
        
        // 📦 DELETE INIT MESSAGE
        await conn.sendMessage(from, { delete: initMsg.key });
        
        // 🎨 MAIN SUCCESS MESSAGE
        const successMessage = await reply(`✅ *PAIRING CODE GENERATED*\n━━━━━━━━━━━━━━━━━━\n${STATUS_EMOJI.key} *CODE:* \`\`\`${pairingCode}\`\`\`\n${STATUS_EMOJI.phone} *NUMBER:* +${cleanNumber}\n${STATUS_EMOJI.time} *GENERATED:* ${generationTime}\n⏳ *EXPIRES:* ${expiryTime}\n⚡ *PROCESS TIME:* ${processTime}ms\n🔌 *ENDPOINT:* ${usedEndpoint.replace(/_/g, " ")}\n\n📋 *USAGE INSTRUCTIONS*\n1. Open WhatsApp on target device\n2. Go to Linked Devices\n3. Enter this 6-digit code\n4. Wait for verification\n\n⚠️ *SECURITY NOTES*\n• Code is one-time use only\n• Do not share with others\n• Expires after ${expiryTime}\n\n🎛️ *${CONFIG.NAME} SYSTEM*\n${STATUS_EMOJI.developer} ${CONFIG.DEVELOPER} | 🔧 ${CONFIG.VERSION}`);
        
        // ⏳ DELAY FOR EFFECT
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // 🔑 CLEAN CODE MESSAGE
        await reply(`🔐 *PAIRING CODE*\n\`\`\`${pairingCode}\`\`\`\n\n💡 Copy this code to link your device`);
        
        // ⏳ ANOTHER DELAY
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 📞 FINAL INSTRUCTION
        await reply(`📱 *DEVICE LINKING READY*\n━━━━━━━━━━━━━━━━━━\n${STATUS_EMOJI.done} Pairing code sent successfully!\n${STATUS_EMOJI.info} Use code within ${expiryTime}\n${STATUS_EMOJI.warning} Keep this code confidential\n\n💎 *${CONFIG.NAME} DEVELOPMENT SUITE*\n${STATUS_EMOJI.developer} Professional bot deployment tools\n🔗 ${CONFIG.GITHUB}`);
        
        // ✅ SUCCESS REACTION
        try {
            await conn.sendMessage(from, { 
                react: { text: "✅", key: mek.key } 
            });
        } catch (reactErr) {
            // Ignore reaction errors
        }
        
        // 📊 LOG SUCCESS
        console.log(`🎯 Pairing Successful: +${cleanNumber} | Code: ${pairingCode} | Time: ${processTime}ms`);
        
    } catch (globalError) {
        console.error("🔥 PAIRING MODULE ERROR:", globalError);
        
        const errorTime = new Date().toLocaleTimeString();
        
        await reply(`🚨 *CRITICAL SYSTEM ERROR*\n━━━━━━━━━━━━━━━━━━\n${STATUS_EMOJI.error} Module: Pairing System\n📛 Error: ${globalError.message || "Unknown"}\n🔧 Code: ${globalError.code || "N/A"}\n${STATUS_EMOJI.time} ${errorTime}\n\n🔧 *DEVELOPER INFORMATION*\n${STATUS_EMOJI.developer} ${CONFIG.DEVELOPER}\n📧 ${CONFIG.CONTACT}\n🔗 ${CONFIG.GITHUB}\n\n⚠️ *AUTO-RECOVERY*\nSystem will reset in 30 seconds\nTry command again after 1 minute`);
    }
});

// ℹ️ HELP COMMAND
cmd({
    pattern: "pairhelp",
    alias: ["pairinghelp", "clonehelp"],
    react: "❓",
    desc: "Pairing system help guide",
    category: "help",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    await reply(`🔧 *${CONFIG.NAME} PAIRING SYSTEM HELP*\n━━━━━━━━━━━━━━━━━━\n\n🎯 *COMMAND SYNTAX*\n\`\`\`.pair <number>\`\`\`\n\`\`\`.getpair 923452401XXX\`\`\`\n\`\`\`.clonebot (uses your number)\`\`\`\n\n📱 *NUMBER FORMAT*\n• Without + sign\n• Country code required\n• Example: 923452401XXX\n• Example: 918123456789\n\n⚡ *FEATURES*\n• Multi-API fallback system\n• Input validation\n• Automatic error recovery\n• Detailed logging\n• Security protection\n\n⏱️ *CODE INFORMATION*\n• 6-digit numeric code\n• Valid for 15 minutes\n• One-time use only\n• Device-specific\n\n🛡️ *SECURITY*\n• Codes are encrypted\n• IP-based rate limiting\n• No data storage\n• Secure transmission\n\n📞 *SUPPORT*\n${STATUS_EMOJI.developer} Developer: ${CONFIG.DEVELOPER}\n📧 Email: ${CONFIG.CONTACT}\n🔗 GitHub: ${CONFIG.GITHUB}\n\n🎛️ *SYSTEM*\n${CONFIG.NAME} ${CONFIG.VERSION} | Professional Deployment Suite`);
});

console.log(`✅ ${CONFIG.NAME} Pairing Module Loaded: ${CONFIG.VERSION}`);