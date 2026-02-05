const { cmd } = require('../command')

cmd({
  pattern: "antideleteinbox",
  category: "owner",
  filename: __filename
}, async (conn, mek, m, { args, isOwner, reply }) => {

  if (!isOwner) return reply("❌ Owner only")

  if (!args[0]) return reply(".antidelete inbox on / off")

  if (args[0] === 'on') {
    global.ownerAntiDelete = true
    return reply("✅ Owner Anti-Delete inbox ON")
  }

  if (args[0] === 'off') {
    global.ownerAntiDelete = false
    return reply("❌ Owner Anti-Delete inbox OFF")
  }
})