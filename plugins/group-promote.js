const { cmd } = require('../command')

cmd({
    pattern: "promote",
    alias: ["p", "makeadmin"],
    desc: "Promote a member to admin",
    category: "admin",
    react: "⬆️",
    filename: __filename
}, async (conn, mek, m, { isGroup, participants }) => {
    try {
        if (!isGroup) return m.reply("❌ Group only command")

        const metadata = await conn.groupMetadata(m.chat)

        // BOT ADMIN CHECK (REAL)
        const botJid = conn.user.id.split(':')[0] + "@s.whatsapp.net"
        const botIsAdmin = metadata.participants.find(
            p => p.id === botJid && p.admin
        )
        if (!botIsAdmin) return m.reply("❌ Bot admin nahi hai")

        // SENDER ADMIN OR OWNER CHECK
        const senderIsAdmin = metadata.participants.find(
            p => p.id === m.sender && p.admin
        )
        if (!senderIsAdmin && m.sender !== metadata.owner) {
            return m.reply("❌ Sirf admin ya owner promote kar sakta hai")
        }

        // TARGET
        let target
        if (m.quoted) {
            target = m.quoted.sender
        } else if (m.mentionedJid?.[0]) {
            target = m.mentionedJid[0]
        } else {
            return m.reply("❌ Reply ya mention karo")
        }

        // Already admin?
        const alreadyAdmin = metadata.participants.find(
            p => p.id === target && p.admin
        )
        if (alreadyAdmin) return m.reply("⚠️ Ye banda pehle hi admin hai")

        // 🔥 PROMOTE (REAL CALL)
        await conn.groupParticipantsUpdate(
            m.chat,
            [target],
            "promote"
        )

        await m.reply(`✅ @${target.split("@")[0]} promoted`, {
            mentions: [target]
        })

    } catch (err) {
        console.log("PROMOTE ERROR =>", err)
        m.reply("❌ Promote fail — WhatsApp ne reject kar diya")
    }
})