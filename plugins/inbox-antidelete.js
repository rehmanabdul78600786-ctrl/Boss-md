module.exports = (conn) => {
    // ✅ GLOBAL SETTINGS
    global.ownerAntiDelete = true; // owner-Anti-delete ON
    global.ownerMsgStore = global.ownerMsgStore || new Map();

    const ownerNumber = ['923076411099']; // Apna number yaha daal (country code ke saath)

    // 1️⃣ SAVE ALL INCOMING MESSAGES
    conn.ev.on('messages.upsert', async (mekData) => {
        try {
            const msg = mekData.messages?.[0];
            if (!msg || !msg.message || msg.key.remoteJid === 'status@broadcast') return;

            // Save message in memory by message ID
            global.ownerMsgStore.set(msg.key.id, {
                jid: msg.key.remoteJid,
                sender: msg.key.participant || msg.key.remoteJid,
                message: msg.message
            });
        } catch (err) {
            console.error("Owner Msg Store Error:", err.message);
        }
    });

    // 2️⃣ DETECT DELETED MESSAGES
    conn.ev.on('messages.update', async (updates) => {
        try {
            if (!global.ownerAntiDelete) return;

            for (const u of updates) {
                if (u.update?.message === null) { // Delete for everyone
                    const data = global.ownerMsgStore.get(u.key.id);
                    if (!data) continue;

                    const text = `🗑️ *Message Deleted*\n\n👤 From: ${data.sender}\n📍 Chat: ${data.jid}`;

                    // Send notification + original message to owner
                    await conn.sendMessage(ownerNumber[0] + '@s.whatsapp.net', { text }).catch(() => {});
                    await conn.sendMessage(ownerNumber[0] + '@s.whatsapp.net', data.message).catch(() => {});
                }
            }
        } catch (err) {
            console.error("Owner Anti-Delete Error:", err.message);
        }
    });
};