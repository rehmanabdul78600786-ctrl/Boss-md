const { cmd } = require('../command');
const fs = require("fs");
const path = require("path");

// ===== File setup =====
const DATA_FILE = path.join(__dirname, "../data/antilink.json");
if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify({}, null, 2));

const loadData = () => JSON.parse(fs.readFileSync(DATA_FILE));
const saveData = (data) => fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

// ===== Toggle Antilink =====
cmd({
    on: "antilink",
    desc: "Enable or disable antilink in group",
    category: "group"
}, async (conn, m, store, { from, args, isGroup, isAdmins, reply }) => {
    if (!isGroup) return reply("❌ This command is only for groups.");
    if (!isAdmins) return reply("❌ Only admins can toggle antilink.");

    const data = loadData();
    if (args[0] === "on") {
        data[from] = true;
        saveData(data);
        return reply("✅ Antilink has been enabled in this group.");
    }
    if (args[0] === "off") {
        delete data[from];
        saveData(data);
        return reply("❌ Antilink has been disabled in this group.");
    }

    reply("Usage:\n.antilink on / off");
});

// ===== Antilink Checker =====
cmd({
    on: "body" // Catch all messages
}, async (conn, m, store, { from, body, sender, isGroup, isAdmins, reply }) => {
    try {
        if (!isGroup) return;
        if (!global.warnings) global.warnings = {};

        const data = loadData();
        if (!data[from]) return; // Antilink not enabled in this group
        if (isAdmins) return; // Admins bypass

        // Fetch group metadata to check bot admin
        const groupMetadata = await conn.groupMetadata(from).catch(() => null);
        const participants = groupMetadata?.participants || [];
        const groupAdmins = participants.filter(p => p.admin !== null).map(p => p.id);
        const botJid = conn.user.id.split(':')[0] + '@s.whatsapp.net';
        const isBotAdmin = groupAdmins.includes(botJid);
        if (!isBotAdmin) return; // Bot must be admin to delete

        // Regex patterns for links
        const linkPatterns = [
            /https?:\/\/(?:chat\.whatsapp\.com|wa\.me)\/\S+/gi,
            /https?:\/\/(?:t\.me|telegram\.me)\/\S+/gi,
            /https?:\/\/(?:www\.)?twitter\.com\/\S+/gi,
            /https?:\/\/(?:www\.)?linkedin\.com\/\S+/gi,
            /https?:\/\/(?:www\.)?reddit\.com\/\S+/gi,
            /https?:\/\/(?:www\.)?discord\.com\/\S+/gi,
            /https?:\/\/(?:www\.)?twitch\.tv\/\S+/gi,
            /https?:\/\/(?:www\.)?vimeo\.com\/\S+/gi,
            /https?:\/\/(?:www\.)?dailymotion\.com\/\S+/gi,
            /https?:\/\/(?:www\.)?medium\.com\/\S+/gi
        ];

        const containsLink = linkPatterns.some(pattern => pattern.test(body));
        if (!containsLink) return;

        // Delete the message
        try {
            await conn.sendMessage(from, { delete: m.key });
        } catch (error) {
            console.error("❌ Failed to delete message:", error);
        }

        // Warn the user
        global.warnings[sender] = (global.warnings[sender] || 0) + 1;
        const warnCount = global.warnings[sender];

        if (warnCount < 4) {
            await conn.sendMessage(from, {
                text: `⚠️ *LINKS ARE NOT ALLOWED* ⚠️\n` +
                      `*╭── WARNING ──*\n` +
                      `*├ USER :* @${sender.split('@')[0]}\n` +
                      `*├ COUNT : ${warnCount}\n` +
                      `*├ REASON : Sending links\n` +
                      `*├ WARN LIMIT : 3*\n` +
                      `*╰────────────*`,
                mentions: [sender]
            });
        } else {
            await conn.sendMessage(from, {
                text: `@${sender.split('@')[0]} has been removed - warn limit exceeded!`,
                mentions: [sender]
            });
            await conn.groupParticipantsUpdate(from, [sender], "remove");
            delete global.warnings[sender];
        }

    } catch (err) {
        console.error("❌ Anti-link error:", err);
        reply("❌ An error occurred while processing the message.");
    }
});