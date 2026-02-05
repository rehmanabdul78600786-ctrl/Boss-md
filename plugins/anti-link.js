const { cmd } = require('../command');
const config = require("../config");

cmd({
  on: "body"
}, async (conn, m, store, { from, body, sender, isGroup, isAdmins, isBotAdmins, reply }) => {
  try {
    // Initialize warnings if not exists
    if (!global.warnings) global.warnings = {};

    // Only act in groups
    if (!isGroup) return;

    // ✅ Correct bot admin check
    const botJid = conn.user.id.split(':')[0] + '@s.whatsapp.net';
    const groupMetadata = await conn.groupMetadata(from).catch(() => null);
    const participants = groupMetadata?.participants || [];
    const groupAdmins = participants.filter(u => u.admin !== null).map(u => u.id);
    const botIsAdmin = groupAdmins.includes(botJid);

    if (!botIsAdmin) {
      return reply("❌ Bot must be an admin to use this command.");
    }

    // Only block if sender isn't admin
    if (isAdmins) return;

    // Link detection
    const linkPatterns = [
      /https?:\/\/(?:chat\.whatsapp\.com|wa\.me)\/\S+/gi,
      /https?:\/\/(?:api\.whatsapp\.com|wa\.me)\/\S+/gi,
      /wa\.me\/\S+/gi,
      /https?:\/\/(?:t\.me|telegram\.me)\/\S+/gi
/wa\.me\/\S+/gi,                                    
      /https?:\/\/(?:t\.me|telegram\.me)\/\S+/gi,         
      /https?:\/\/(?:www\.)?\.com\/\S+/gi,                
      /https?:\/\/(?:www\.)?twitter\.com\/\S+/gi,         
      /https?:\/\/(?:www\.)?linkedin\.com\/\S+/gi,        
      /https?:\/\/(?:whatsapp\.com|channel\.me)\/\S+/gi,  
      /https?:\/\/(?:www\.)?reddit\.com\/\S+/gi,          
      /https?:\/\/(?:www\.)?discord\.com\/\S+/gi,         
      /https?:\/\/(?:www\.)?twitch\.tv\/\S+/gi,           
      /https?:\/\/(?:www\.)?vimeo\.com\/\S+/gi,           
      /https?:\/\/(?:www\.)?dailymotion\.com\/\S+/gi,     
      /https?:\/\/(?:www\.)?medium\.com\/\S+/gi           
    ];
    const containsLink = linkPatterns.some(pattern => pattern.test(body));

    if (containsLink && config.ANTI_LINK === 'true') {
      console.log(`Link detected from ${sender}: ${body}`);

      // Delete message
      try {
        await conn.sendMessage(from, { delete: m.key }).catch(() => {});
      } catch (error) {
        console.error("Failed to delete message:", error);
      }

      // Update warning count
      global.warnings[sender] = (global.warnings[sender] || 0) + 1;
      const warningCount = global.warnings[sender];

      if (warningCount < 4) {
        await conn.sendMessage(from, {
          text: `‎*⚠️LINKS ARE NOT ALLOWED⚠️*\n` +
                `*╭────⬡ WARNING ⬡────*\n` +
                `*├▢ USER :* @${sender.split('@')[0]}!\n` +
                `*├▢ COUNT : ${warningCount}*\n` +
                `*├▢ REASON : LINK SENDING*\n` +
                `*├▢ WARN LIMIT : 3*\n` +
                `*╰────────────────*`,
          mentions: [sender]
        });
      } else {
        await conn.sendMessage(from, {
          text: `@${sender.split('@')[0]} *HAS BEEN REMOVED - WARN LIMIT EXCEEDED!*`,
          mentions: [sender]
        });
        await conn.groupParticipantsUpdate(from, [sender], "remove");
        delete global.warnings[sender];
      }
    }
  } catch (error) {
    console.error("Anti-link error:", error);
    reply("❌ An error occurred while processing the message.");
  }
});