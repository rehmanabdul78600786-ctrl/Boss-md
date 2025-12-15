const { cmd } = require("../command"); // Command handler import

cmd({
  pattern: "addmod",             // Command pattern: !addmod
  alias: ["add-mod"],            // Aliases for the command
  desc: "Add a moderator",       // Command description
  category: "owner",             // Category for the command (owner only)
  filename: __filename,          // The file name of the plugin
  owner: true                    // Only the bot owner can use this command
}, async (malvin, mek, m, { reply, mentionedJid, isCreator }) => {
  
  // Owner check: Ensure only the bot creator can use the command
  if (!isCreator) return reply("❗ You are not authorized to use this command.");
  
  // Check if a user is tagged
  if (!mentionedJid[0]) return reply("❗ Tag a user to add as mod.");
  
  // Initialize global mods array if it doesn't exist
  global.mods = global.mods || [];
  
  // Check if the user is already a moderator
  if (global.mods.includes(mentionedJid[0])) {
    return reply("⚠️ User is already a mod.");
  }
  
  // Add the user to global mods list
  global.mods.push(mentionedJid[0]);
  
  // Confirmation message
  reply("✅ User added as moderator.");
});

