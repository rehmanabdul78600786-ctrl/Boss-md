const { cmd } = require('../command');
const os = require('os');
const axios = require('axios');

// 🔥 BOSS CONFIG
const BOSS = {
    name: "BOSS",
    realName: "only one Boss",  // اپنا نام یہاں
    id: "923076411099",      // اپنا نمبر
    title: "Lead Developer",
    skills: ["Node.js", "Python", "Hacking", "Bot Development", "API", "Security"],
    level: "PRO"
};

// 🔥 HACKER ASCII ART
const HACKER_ART = `
██████╗░░█████╗░░██████╗░██████╗
██╔══██╗██╔══██╗██╔════╝██╔════╝
██████╦╝██║░░██║╚█████╗░╚█████╗░
██╔══██╗██║░░██║░╚═══██╗░╚═══██╗
██████╦╝╚█████╔╝██████╔╝██████╔╝
╚═════╝░░╚════╝░╚═════╝░╚═════╝░
`;

// 🔥 SYSTEM FUNCTIONS
async function getSystemStatus() {
    const memory = process.memoryUsage();
    const usedMB = (memory.heapUsed / 1024 / 1024).toFixed(2);
    const totalMB = (memory.heapTotal / 1024 / 1024).toFixed(2);
    
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    
    return {
        memory: `${usedMB}MB / ${totalMB}MB`,
        uptime: `${hours}h ${minutes}m`,
        platform: os.platform(),
        cpu: os.cpus().length + " cores",
        node: process.version,
        load: os.loadavg()[0].toFixed(2)
    };
}

// 🔥 GET LIVE DATA
async function getLiveData() {
    try {
        // Crypto prices
        const cryptoRes = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd', {
            timeout: 5000
        });
        
        // Random quote
        const quoteRes = await axios.get('https://api.quotable.io/random', { timeout: 5000 });
        
        return {
            btc: cryptoRes.data?.bitcoin?.usd || 'N/A',
            eth: cryptoRes.data?.ethereum?.usd || 'N/A',
            quote: quoteRes.data?.content || "Code never lies, comments sometimes do.",
            author: quoteRes.data?.author || "Ron Jeffries"
        };
    } catch (e) {
        return {
            btc: 'N/A',
            eth: 'N/A',
            quote: "In programming, the hard part isn't solving problems, but deciding what problems to solve.",
            author: "Paul Graham"
        };
    }
}

// 🔥 COMMAND 1: BOSS MAIN
cmd({
    pattern: "boss",
    react: "👑",
    desc: "Activate BOSS Developer Mode",
    category: "boss",
    filename: __filename
}, async (conn, mek, m, { from, reply, sender, isOwner }) => {
    try {
        await conn.sendMessage(from, { react: { text: "⚡", key: m.key } });
        
        // Get live data
        const sys = await getSystemStatus();
        const live = await getLiveData();
        const time = new Date().toLocaleTimeString('en-PK', { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit'
        });
        
        // 🔥 MAIN RESPONSE
        const response = `
${HACKER_ART}

┌─[ 𝐁𝐎𝐒𝐒 𝐃𝐄𝐕𝐄𝐋𝐎𝐏𝐄𝐑 𝐌𝐎𝐃𝐄 ]─┐
│                                     
│ 👤 𝐍𝐀𝐌𝐄: ${BOSS.realName}
│ 🆔 𝐈𝐃: ${BOSS.id}
│ 💼 𝐓𝐈𝐓𝐋𝐄: ${BOSS.title}
│ ⚡ 𝐋𝐄𝐕𝐄𝐋: ${BOSS.level}
│ 🧠 𝐒𝐊𝐈𝐋𝐋𝐒: ${BOSS.skills.slice(0, 3).join(', ')}
│                                     
├─[ 𝐒𝐘𝐒𝐓𝐄𝐌 𝐒𝐓𝐀𝐓𝐔𝐒 ]─┤
│ 🕐 𝐓𝐈𝐌𝐄: ${time}
│ 💾 𝐌𝐄𝐌𝐎𝐑𝐘: ${sys.memory}
│ ⏱️  𝐔𝐏𝐓𝐈𝐌𝐄: ${sys.uptime}
│ 🖥️  𝐂𝐏𝐔: ${sys.cpu}
│ 📦 𝐍𝐎𝐃𝐄: ${sys.node}
│                                     
├─[ 𝐋𝐈𝐕𝐄 𝐃𝐀𝐓𝐀 ]─┤
│ ₿ 𝐁𝐈𝐓𝐂𝐎𝐈𝐍: $${live.btc}
│ Ξ 𝐄𝐓𝐇𝐄𝐑𝐄𝐔𝐌: $${live.eth}
│ 💬 𝐐𝐔𝐎𝐓𝐄: "${live.quote}"
│ 📝 - ${live.author}
│                                     
└─[ 𝐒𝐓𝐀𝐓𝐔𝐒: 𝐎𝐍𝐋𝐈𝐍𝐄 ✅ ]─┘

📡 _Real-time monitoring active_
🔧 _Developer tools loaded_
⚡ _BOSS mode: ACTIVE_

💻 **Commands:**
.bossinfo - Detailed info
.bosscmd - Available commands
.bosshack - Hacker tools
        `.trim();
        
        await reply(response);
        
        // Auto reaction
        setTimeout(async () => {
            await conn.sendMessage(from, { react: { text: "✅", key: m.key } });
        }, 1000);
        
    } catch (e) {
        console.error(e);
        reply("❌ System error in BOSS mode");
    }
});

// 🔥 COMMAND 2: BOSS INFO DETAILED
cmd({
    pattern: "bossinfo",
    react: "📊",
    desc: "Detailed BOSS information",
    category: "boss",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    const sys = await getSystemStatus();
    
    const response = `
┌─[ 📊 𝐁𝐎𝐒𝐒 𝐒𝐘𝐒𝐓𝐄𝐌 𝐈𝐍𝐅𝐎 ]─┐
│                                     
│ 🔧 𝐏𝐋𝐀𝐓𝐅𝐎𝐑𝐌: ${sys.platform}
│ 🧠 𝐂𝐏𝐔 𝐂𝐎𝐑𝐄𝐒: ${sys.cpu}
│ 💾 𝐌𝐄𝐌𝐎𝐑𝐘: ${sys.memory}
│ ⏱️  𝐔𝐏𝐓𝐈𝐌𝐄: ${sys.uptime}
│ 📦 𝐍𝐎𝐃𝐄 𝐕𝐄𝐑𝐒𝐈𝐎𝐍: ${sys.node}
│ 📶 𝐒𝐘𝐒𝐓𝐄𝐌 𝐋𝐎𝐀𝐃: ${sys.load}
│                                     
│ 🛠️  𝐒𝐊𝐈𝐋𝐋 𝐒𝐄𝐓:
${BOSS.skills.map(skill => `│   • ${skill}`).join('\n')}
│                                     
│ 🌐 𝐋𝐈𝐕𝐄 𝐒𝐓𝐀𝐓𝐔𝐒:
│   • API: ONLINE ✅
│   • Database: ACTIVE
│   • Security: ENABLED
│   • Encryption: AES-256
│                                     
└─[ 🚀 𝐏𝐄𝐑𝐅𝐎𝐑𝐌𝐀𝐍𝐂𝐄: 𝐎𝐏𝐓𝐈𝐌𝐀𝐋 ]─┘
    `.trim();
    
    await reply(response);
});

// 🔥 COMMAND 3: HACKER TOOLS
cmd({
    pattern: "bosshack",
    react: "💀",
    desc: "Hacker tools menu",
    category: "hack",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    const response = `
┌─[ 💀 𝐇𝐀𝐂𝐊𝐄𝐑 𝐓𝐎𝐎𝐋𝐒 ]─┐
│                                     
│ 1. 🔍 IP Lookup
│ 2. 🌐 Port Scanner
│ 3. 📡 DNS Lookup
│ 4. 🔐 Hash Generator
│ 5. 📊 Network Info
│ 6. 🛡️  Security Check
│                                     
│ 💡 _These are simulated tools_
│ ⚠️  _For educational purposes only_
│                                     
│ 📝 Usage: .hack [tool] [target]
│ Example: .hack ip 8.8.8.8
│                                     
└─[ 🔓 𝐀𝐂𝐂𝐄𝐒𝐒: 𝐑𝐎𝐎𝐓 ]─┘
    `.trim();
    
    await reply(response);
});

// 🔥 COMMAND 4: BOSS COMMANDS LIST
cmd({
    pattern: "bosscmd",
    react: "📜",
    desc: "All BOSS commands",
    category: "boss",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    const response = `
┌─[ 📜 𝐁𝐎𝐒𝐒 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒 ]─┐
│                                     
│ 👑 .boss - Activate BOSS mode
│ 📊 .bossinfo - System information
│ 💀 .bosshack - Hacker tools
│ 📜 .bosscmd - This menu
│ 🎮 .bossgame - Mini games
│ 💰 .bosscrypto - Crypto prices
│ 🎯 .bosstarget - Target practice
│                                     
│ 🔧 𝐃𝐄𝐕𝐄𝐋𝐎𝐏𝐄𝐑 𝐓𝐎𝐎𝐋𝐒:
│ .code [lang] - Code examples
│ .api [name] - Test APIs
│ .debug - Debug information
│ .ping - Network test
│                                     
└─[ ⚡ 𝐏𝐎𝐖𝐄𝐑𝐄𝐃 𝐁𝐘: 𝐁𝐎𝐒𝐒 ]─┘
    `.trim();
    
    await reply(response);
});

// 🔥 COMMAND 5: BOSS GAME
cmd({
    pattern: "bossgame",
    react: "🎮",
    desc: "BOSS mini game",
    category: "game",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    const games = [
        { name: "Target Practice", cmd: ".target", desc: "Hit 10 targets" },
        { name: "Code Challenge", cmd: ".codechallenge", desc: "Solve coding problems" },
        { name: "Hack Simulator", cmd: ".hacksim", desc: "Simulated hacking" },
        { name: "Memory Test", cmd: ".memory", desc: "Test your memory" }
    ];
    
    const randomGame = games[Math.floor(Math.random() * games.length)];
    const score = Math.floor(Math.random() * 1000);
    
    const response = `
┌─[ 🎮 𝐁𝐎𝐒𝐒 𝐆𝐀𝐌𝐄 ]─┐
│                                     
│ 🎯 𝐆𝐀𝐌𝐄: ${randomGame.name}
│ 📝 ${randomGame.desc}
│                                     
│ 🏆 𝐘𝐎𝐔𝐑 𝐒𝐂𝐎𝐑𝐄: ${score}
│ ${score > 700 ? "🔥 𝐑𝐄𝐒𝐔𝐋𝐓: PRO HACKER!" : 
   score > 400 ? "✅ 𝐑𝐄𝐒𝐔𝐋𝐓: Good job!" : 
   "💀 𝐑𝐄𝐒𝐔𝐋𝐓: Needs practice"}
│                                     
│ 💡 Play: ${randomGame.cmd}
│ 🎯 Try again: .bossgame
│                                     
└─[ 🚀 𝐆𝐎𝐎𝐃 𝐋𝐔𝐂𝐊! ]─┘
    `.trim();
    
    await reply(response);
});

console.log(`✅ Hacker BOSS Plugin Loaded for ${BOSS.name}`);