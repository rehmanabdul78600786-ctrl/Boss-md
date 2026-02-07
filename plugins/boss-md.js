const { cmd } = require('../command');
const os = require('os');

// 🔥 APNA NAME YAHAN LIKHO
const YOUR_NAME = "BOSS"; // Yahan apna naam likhein
const YOUR_ID = "923076411099"; // Yahan apna number likhein

// Matrix Rain Characters
const RAIN_CHARS = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン01█▓▒░";

function getRainLine() {
    let line = '';
    for (let i = 0; i < 38; i++) {
        line += RAIN_CHARS[Math.floor(Math.random() * RAIN_CHARS.length)];
    }
    return line;
}

function getSystemInfo() {
    const memory = process.memoryUsage();
    const usedMB = Math.round(memory.heapUsed / 1024 / 1024);
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const date = new Date();
    
    return {
        time: date.toLocaleTimeString('en-PK', { hour12: false }),
        date: date.toLocaleDateString('en-PK'),
        uptime: `${hours}h ${minutes}m`,
        memory: `${usedMB}MB`,
        platform: os.platform().toUpperCase(),
        cpuCores: os.cpus().length,
        nodeVersion: process.version,
        botName: "BOSS-MD",
        yourName: YOUR_NAME,
        yourId: YOUR_ID
    };
}

cmd({
    pattern: "boss",
    react: "🌀",
    desc: "BOSS Matrix Rain - Digital rain hacker style",
    category: "boss",
    filename: __filename
}, async (conn, mek, m, { from, args, reply, sender, isGroup, isOwner }) => {
    try {
        await conn.sendMessage(from, { react: { text: "🌧️", key: m.key } });
        
        const sys = getSystemInfo();
        const rainLine1 = getRainLine();
        const rainLine2 = getRainLine();
        const rainLine3 = getRainLine();
        
        const matrixRainResponse = `
${rainLine1}
▞▚▞▚▞▚▞▚▞▚▞▚▞▚▞▚▞▚▞▚
       𝐁𝐎𝐒𝐒   
▚▞▚▞▚▞▚▞▚▞▚▞▚▞▚▞▚▞▚▞

${rainLine2}

╭─⋆⋅☆⋅⋆─╮
   𝐁𝐎𝐒𝐒 𝐒𝐘𝐒𝐓𝐄𝐌
╰─⋆⋅☆⋅⋆─╯

• 👤 𝐎𝐖𝐍𝐄𝐑: ${sys.yourName}
• 🆔 𝐈𝐃: ${sys.yourId}
• ⚡ 𝐒𝐓𝐀𝐓𝐔𝐒: ACTIVE
• 🔓 𝐀𝐂𝐂𝐄𝐒𝐒: UNLIMITED

╭─⋆⋅☆⋅⋆─╮
   𝐒𝐘𝐒𝐓𝐄𝐌 𝐈𝐍𝐅𝐎
╰─⋆⋅☆⋅⋆─╯

• 🕐 𝐓𝐈𝐌𝐄: ${sys.time}
• 📅 𝐃𝐀𝐓𝐄: ${sys.date}
• ⏱️  𝐔𝐏𝐓𝐈𝐌𝐄: ${sys.uptime}
• 💾 𝐌𝐄𝐌𝐎𝐑𝐘: ${sys.memory}
• 🖥️  𝐏𝐋𝐀𝐓𝐅𝐎𝐑𝐌: ${sys.platform}
• 🧠 𝐂𝐏𝐔 𝐂𝐎𝐑𝐄𝐒: ${sys.cpuCores}
• 📦 𝐍𝐎𝐃𝐄: ${sys.nodeVersion}

${rainLine3}

▞▚▞▚▞▚▞▚▞▚▞▚▞▚▞▚▞▚▞▚
    𝐒𝐓𝐀𝐓𝐔𝐒: 𝐀𝐋𝐋 𝐒𝐘𝐒𝐓𝐄𝐌𝐒 𝐆𝐑𝐄𝐄𝐍
▚▞▚▞▚▞▚▞▚▞▚▞▚▞▚▞▚▞▚▞
        `.trim();

        await conn.sendMessage(from, { 
            text: matrixRainResponse,
            contextInfo: {
                mentionedJid: [sender]
            }
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: "✅", key: m.key } });

    } catch (e) {
        console.log(e);
        reply("❌ Error in BOSS Matrix");
        await conn.sendMessage(from, { react: { text: "❌", key: m.key } });
    }
});

// 🔥 AUTO RESPONSE WHEN SOMEONE TYPES "BOSS"
// Ye extra feature hai - agar koi bhi chat mein "boss" likhe to auto reply kare
const bossTriggers = ['boss', 'BOSS', 'Boss', 'بوس', 'مالك'];

// Global message handler check
if (typeof global.handleMessageUltra !== 'undefined') {
    const originalHandler = global.handleMessageUltra;
    global.handleMessageUltra = async (message) => {
        try {
            if (message && message.message) {
                let text = '';
                const msgType = Object.keys(message.message)[0];
                
                if (msgType === 'conversation') text = message.message.conversation || '';
                else if (msgType === 'extendedTextMessage') text = message.message.extendedTextMessage?.text || '';
                
                // Check for boss triggers
                const hasBoss = bossTriggers.some(trigger => 
                    text.toLowerCase().includes(trigger.toLowerCase())
                );
                
                if (hasBoss && global.conn) {
                    const from = message.key.remoteJid;
                    const sys = getSystemInfo();
                    const rainLine = getRainLine();
                    
                    const autoResponse = `
${rainLine}
> 𝐁𝐎𝐒𝐒 𝐃𝐄𝐓𝐄𝐂𝐓𝐄𝐃
> 𝐎𝐖𝐍𝐄𝐑: ${sys.yourName}
> 𝐒𝐓𝐀𝐓𝐔𝐒: 𝐀𝐂𝐓𝐈𝐕𝐄
> 𝐓𝐈𝐌𝐄: ${sys.time}
${rainLine}
                    `.trim();
                    
                    setTimeout(async () => {
                        await global.conn.sendMessage(from, { text: autoResponse });
                    }, 500);
                }
            }
        } catch (e) {
            // Silent error
        }
        
        // Call original handler
        return originalHandler(message);
    };
    console.log('🌀 BOSS Matrix Auto-Response Activated');
}