const config = require('../config');
const { cmd, commands } = require('../command');
const os = require('os');

// ==================== PING COMMAND ====================
cmd({
  pattern: "ping",
  alias: ["qadeer", "legend", "speed"],
  desc: "BOSS style ping test",
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

// ==================== GETINFO COMMAND ====================
cmd({
    pattern: "getinfo",
    alias: ["info", "botinfo", "ginfo", "groupinfo", "serverinfo"],
    desc: "Get user / group / bot / server info",
    category: "tools",
    react: "📊",
    filename: __filename
}, async (conn, mek, m, { from, reply, text, quoted, pushName, mentioned, isGroup, sender }) => {
    try {
        const option = text?.toLowerCase() || "user";

        await conn.sendMessage(from, {
            react: { text: "⏳", key: mek.key }
        });

        /* ================= USER INFO ================= */
        if (option === "user" || option === "me") {

            let target = sender;
            let name = pushName || "User";

            if (mentioned?.length) {
                target = mentioned[0];
                name = "Mentioned User";
            } else if (quoted?.sender) {
                target = quoted.sender;
                name = "Quoted User";
            }

            const id = target.split("@")[0];

            let pp;
            try {
                pp = await conn.profilePictureUrl(target, "image");
            } catch {
                pp = null;
            }

            const msg = `╔══════════════════╗
║   👤 USER INFO   ║
╚══════════════════╝

📛 Name: ${name}
🆔 Number: ${id}
🔗 JID: ${target}
💬 Chat: ${isGroup ? "Group" : "Private"}
🕒 Time: ${new Date().toLocaleString()}

🔐 Profile Pic: ${pp ? "Visible" : "Hidden"}

> ${config.BOT_NAME}`;

            if (pp) {
                await conn.sendMessage(from, {
                    image: { url: pp },
                    caption: msg,
                    mentions: [target]
                }, { quoted: mek });
            } else {
                await reply(msg);
            }
        }

        /* ================= GROUP INFO ================= */
        else if (option === "group" || option === "gc" || option === "ginfo" || option === "groupinfo") {
            if (!isGroup) return reply("❌ Group only command");

            const meta = await conn.groupMetadata(from);
            const admins = meta.participants.filter(p => p.admin).map(p => p.id);
            const owner = meta.owner || (admins.length > 0 ? admins[0] : "unknown");

            let gpp;
            try {
                gpp = await conn.profilePictureUrl(from, "image");
            } catch {
                gpp = null;
            }

            const msg = `╔══════════════════╗
║   👥 GROUP INFO  ║
╚══════════════════╝

📛 Name: ${meta.subject}
👑 Owner: @${owner.split("@")[0]}
👥 Members: ${meta.participants.length}
🛡 Admins: ${admins.length}
📅 Created: ${new Date(meta.creation * 1000).toLocaleDateString()}

⚙️ Announce: ${meta.announce ? "On" : "Off"}
🔒 Restricted: ${meta.restrict ? "Yes" : "No"}

> ${config.BOT_NAME}`;

            if (gpp) {
                await conn.sendMessage(from, {
                    image: { url: gpp },
                    caption: msg,
                    mentions: admins.concat([owner])
                }, { quoted: mek });
            } else {
                await reply(msg);
            }
        }

        /* ================= BOT INFO ================= */
        else if (option === "bot") {

            const up = process.uptime();
            const h = Math.floor(up / 3600);
            const mnt = Math.floor((up % 3600) / 60);
            const sec = Math.floor(up % 60);
            const mem = Math.round(process.memoryUsage().heapUsed / 1024 / 1024);

            const msg = `╔══════════════════╗
║   🤖 BOT INFO   ║
╚══════════════════╝

📛 Name: ${config.BOT_NAME}
👑 Owner: ${config.OWNER_NAME}
⚙ Prefix: ${config.PREFIX || "."}
🌍 Mode: ${config.WORK_TYPE || "Public"}

⏱ Uptime: ${h}h ${mnt}m ${sec}s
🧠 RAM: ${mem} MB
🧩 Platform: Node.js

✅ Status: Online

> ${config.BOT_NAME}`;

            await reply(msg);
        }

        /* ================= SERVER INFO ================= */
        else if (option === "server" || option === "sys") {

            const total = Math.round(os.totalmem() / 1024 / 1024 / 1024);
            const free = Math.round(os.freemem() / 1024 / 1024 / 1024);
            const used = total - free;

            const msg = `╔══════════════════╗
║   🖥️ SERVER INFO ║
╚══════════════════╝

💻 OS: ${os.type()} ${os.release()}
⚙ Arch: ${os.arch()}
🧠 CPU: ${os.cpus().length} Cores
💾 RAM: ${used}GB / ${total}GB
⏱ Uptime: ${Math.floor(os.uptime() / 3600)}h

🌐 Host: ${os.hostname()}

> ${config.BOT_NAME}`;

            await reply(msg);
        }

        /* ================= HELP ================= */
        else {
            await reply(`╔══════════════════╗
║   📊 GETINFO   ║
╚══════════════════╝

Commands:
• .getinfo user
• .getinfo group
• .getinfo bot
• .getinfo server

Aliases:
• .ginfo (group)
• .botinfo
• .serverinfo

> ${config.BOT_NAME}`);
        }

        await conn.sendMessage(from, {
            react: { text: "✅", key: mek.key }
        });

    } catch (e) {
        console.error(e);
        await conn.sendMessage(from, { 
            text: `❌ Error: ${e.message}`,
            mentions: [sender]
        }, { quoted: mek });
        await conn.sendMessage(from, { 
            react: { text: "❌", key: mek.key } 
        });
    }
});