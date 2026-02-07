const { cmd } = require('../command');
const fs = require("fs");
const path = require("path");

// ===== File setup =====
const DATA_FILE = path.join(__dirname, "../data/antilink.json");
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({}, null, 2));
}

const loadData = () => JSON.parse(fs.readFileSync(DATA_FILE));
const saveData = (data) =>
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

// ===============================
// 🔒 ANTILINK ON / OFF
// ===============================
cmd({
    pattern: "antilink",
    react: "🔗",
    desc: "Enable or disable antilink in group",
    category: "group",
    use: ".antilink on / off",
    filename: __filename
}, async (conn, m, store, { from, args, isGroup, isAdmins, reply }) => {

    if (!isGroup) return reply("❌ This command is only for groups.");
    if (!isAdmins) return reply("❌ Only admins can toggle antilink.");

    const data = loadData();

    if (args[0] === "on") {
        data[from] = true;
        saveData(data);
        return reply("✅ *Antilink Enabled Successfully*");
    }

    if (args[0] === "off") {
        delete data[from];
        saveData(data);
        return reply("❌ *Antilink Disabled Successfully*");
    }

    reply("⚠️ Usage:\n.antilink on\n.antilink off");
});


// ===============================
// 🚫 ANTILINK AUTO CHECK
// ===============================
cmd({
    on: "body"
}, async (conn, m, store, { from, body, sender, isGroup, isAdmins, isBotAdmins }) => {
    try {
        if (!isGroup) return;
        if (!body) return;

        const data = loadData();
        if (!data[from]) return; // antilink off
        if (isAdmins) return;    // admin bypass
        if (!isBotAdmins) return;

        // init warning storage
        if (!global.warnings) global.warnings = {};
        if (!global.warnings[from]) global.warnings[from] = {};

        // SAFE LINK REGEX (NO g FLAG)
        const linkRegex = /(https?:\/\/|wa\.me\/|chat\.whatsapp\.com\/|t\.me\/|discord\.gg\/)/i;
        if (!linkRegex.test(body)) return;

        // 🗑️ Delete message
        await conn.sendMessage(from, { delete: m.key }).catch(() => {});

        // ⚠️ Warning system
        global.warnings[from][sender] =
            (global.warnings[from][sender] || 0) + 1;

        const warnCount = global.warnings[from][sender];

        if (warnCount < 4) {
            await conn.sendMessage(from, {
                text:
                    `⚠️ *LINKS NOT ALLOWED* ⚠️\n` +
                    `*╭── WARNING ──*\n` +
                    `*├ USER :* @${sender.split("@")[0]}\n` +
                    `*├ COUNT : ${warnCount}\n` +
                    `*├ REASON : Sending links*\n` +
                    `*├ LIMIT : 3*\n` +
                    `*╰────────────*`,
                mentions: [sender]
            });
        } else {
            await conn.sendMessage(from, {
                text: `🚫 @${sender.split("@")[0]} removed (Warn limit exceeded)`,
                mentions: [sender]
            });
            await conn.groupParticipantsUpdate(from, [sender], "remove");
            delete global.warnings[from][sender];
        }

    } catch (err) {
        console.log("❌ Antilink Error:", err.message);
    }
});