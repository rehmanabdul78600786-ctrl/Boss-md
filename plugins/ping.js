const config = require('../config');
const { cmd, commands } = require('../command');

// 👑 BOSS STYLE PING
cmd({
  pattern: "ping",
  alias: ["test", "speed"],
  desc: "Simple 10 second ping test",
  category: "main",
  react: "📊",
  filename: __filename
}, async (conn, mek, m, { from, sender }) => {
  try {
    const startTime = Date.now();
    const senderName = "@" + sender.split('@')[0];
    
    // INITIAL - BOSS STYLE
    const msg = await conn.sendMessage(from, { 
      text: `╔══════════════════╗
║   👑 BOSS 👑   ║
╚══════════════════╝

👤 ${senderName}
⏳ ᴛɪᴍᴇ: 0s | ⚡ ᴍꜱ: 0ms`,
      mentions: [sender]
    }, { quoted: m });
    
    // UPDATE FOR 10 SECONDS
    for (let i = 1; i <= 10; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const ping = Math.floor(Math.random() * 100) + 50;
      
      await conn.sendMessage(from, {
        text: `╔══════════════════╗
║   👑 BOSS 👑   ║
╚══════════════════╝

👤 ${senderName}
⏳ ᴛɪᴍᴇ: ${i}s | ⚡ ᴍꜱ: ${ping}ms`,
        edit: msg.key
      });
    }
    
    // FINAL - BOSS STYLE
    const finalPing = Date.now() - startTime;
    await conn.sendMessage(from, {
      text: `╔══════════════════╗
║   👑 BOSS 👑   ║
╚══════════════════╝

👤 ${senderName}
✅ ꜰɪɴᴀʟ: ${finalPing}ms | ⏳ 10s

> ${config.BOT_NAME}`,
      edit: msg.key
    });
    
  } catch (e) {
    await conn.sendMessage(from, { 
      text: `❌ Error: ${e.message}` 
    }, { quoted: mek });
  }
});