const { cmd } = require('../command');
const os = require('os');
const config = require('../config');

cmd({
    pattern: "getinfo",
    alias: ["info", "botinfo"],
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

            const msg = `
👤 *USER INFORMATION*

📛 Name: ${name}
🆔 Number: ${id}
🔗 JID: ${target}
💬 Chat: ${isGroup ? "Group" : "Private"}
📱 WhatsApp: Active
🕒 Time: ${new Date().toLocaleString()}

🔐 Privacy:
• Profile Pic: ${pp ? "Visible" : "Hidden"}
• Status: Protected

⚠️ Note: Limited by privacy settings
`;

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
        else if (option === "group" || option === "gc") {
            if (!isGroup) return reply("❌ Group only command");

            const meta = await conn.groupMetadata(from);
            const admins = meta.participants.filter(p => p.admin).map(p => p.id);

            let gpp;
            try {
                gpp = await conn.profilePictureUrl(from, "image");
            } catch {
                gpp = null;
            }

            const msg = `
👥 *GROUP INFORMATION*

📛 Name: ${meta.subject}
👤 Owner: @${meta.owner?.split("@")[0] || "Unknown"}
👥 Members: ${meta.participants.length}
🛡 Admins: ${admins.length}
📅 Created: ${new Date(meta.creation * 1000).toLocaleDateString()}

⚙️ Settings:
• Announce: ${meta.announce ? "On" : "Off"}
• Restricted: ${meta.restrict ? "Yes" : "No"}

🤖 Bot: ${config.BOT_NAME}
`;

            if (gpp) {
                await conn.sendMessage(from, {
                    image: { url: gpp },
                    caption: msg,
                    mentions: admins
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

            const mem = Math.round(process.memoryUsage().heapUsed / 1024 / 1024);

            const msg = `
🤖 *BOT INFORMATION*

📛 Name: ${config.BOT_NAME}
👑 Owner: ${config.OWNER_NAME}
⚙ Prefix: ${config.PREFIX}
🌍 Mode: ${config.WORK_TYPE}

⏱ Uptime: ${h}h ${mnt}m
🧠 RAM: ${mem} MB
🧩 Platform: Node.js
📦 Library: Baileys

✅ Status: Online
`;

            await reply(msg);
        }

        /* ================= SERVER INFO ================= */
        else if (option === "server" || option === "sys") {

            const total = Math.round(os.totalmem() / 1024 / 1024 / 1024);
            const free = Math.round(os.freemem() / 1024 / 1024 / 1024);

            const msg = `
🖥 *SERVER INFO*

💻 OS: ${os.type()} ${os.release()}
⚙ Arch: ${os.arch()}
🧠 RAM: ${total - free}GB / ${total}GB
🖥 CPU: ${os.cpus().length} Cores
⏱ Uptime: ${Math.floor(os.uptime() / 3600)}h

🌐 Host: ${os.hostname()}
`;

            await reply(msg);
        }

        else {
            await reply(`
📊 *GETINFO HELP*

• .getinfo
• .getinfo user
• .getinfo group
• .getinfo bot
• .getinfo server
`);
        }

        await conn.sendMessage(from, {
            react: { text: "✅", key: mek.key }
        });

    } catch (e) {
        console.log(e);
        reply("❌ Error: " + e.message);
    }
});

/* ========== QUICK STATUS ========== */
cmd({
    pattern: "ping",
    desc: "Bot speed",
    react: "🏓",
    category: "tools",
    filename: __filename
}, async (conn, mek, m, { reply }) => {
    const start = Date.now();
    //await reply("🏓 Pinging...");
    const speed = Date.now() - start;
    reply(`⚡ Speed: ${speed}ms`);
});

console.log("✅ GetInfo Plugin Loaded Successfully");