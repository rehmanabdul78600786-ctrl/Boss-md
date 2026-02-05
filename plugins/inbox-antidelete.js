module.exports = (conn) => {
    // ✅ GLOBAL SETTINGS
    global.ownerAntiDelete = true; // Owner anti-delete ON
    global.ownerMsgStore = global.ownerMsgStore || new Map();

    const ownerNumber = ['923076411099']; // Owner number yaha daal

    // SAVE INCOMING MESSAGES
    conn.ev.on('messages.upsert', async (mekData) => {
        try {
            const msg = mekData.messages?.[0];
            if (!msg || !msg.message || msg.key.remoteJid === 'status@broadcast') return;

            // Save message in memory
            global.ownerMsgStore.set(msg.key.id, {
                jid: msg.key.remoteJid,
                sender: msg.key.participant || msg.key.remoteJid,
                message: msg.message
            });
        } catch (err) {
            console.error("Owner Msg Store Error:", err.message);
        }
    });

    // DETECT DELETED MESSAGES
    conn.ev.on('messages.update', async (updates) => {
        try {
            if (!global.ownerAntiDelete) return;

            for (const u of updates) {
                if (u.update?.message === null) { // Delete for everyone
                    const data = global.ownerMsgStore.get(u.key.id);
                    if (!data) continue;

                    const text = `🗑️ *Message Deleted*\n\n👤 From: ${data.sender}\n📍 Chat: ${data.jid}`;
                    // Send deleted message info to owner inbox
                    await conn.sendMessage(conn.user.id, { text }).catch(() => {});
                    await conn.sendMessage(conn.user.id, data.message).catch(() => {});
                }
            }
        } catch (err) {
            console.error("Owner Anti-Delete Error:", err.message);
        }
    });
};