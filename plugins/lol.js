const { cmd } = require('../command');

// 🔄 ANDAR BAHIR WALA SCENE - LOL + GAND + ENTRY + EXIT

cmd({
    pattern: "lol",
    alias: ["l", "gand", "lolbomb"],
    react: "😂",
    desc: "Andar bahir wala scene",
    category: "fun",
    filename: __filename
}, async (conn, mek, m, { from, quoted, sender, reply }) => {
    try {
        let target = "";
        let targetName = "";
        let senderName = "";
        
        // Target check
        if (m.mentionedJid && m.mentionedJid.length > 0) {
            target = m.mentionedJid[0];
            targetName = "@" + target.split('@')[0];
        } else if (quoted && quoted.sender) {
            target = quoted.sender;
            targetName = "@" + target.split('@')[0];
        } else {
            return reply(`❌ .lol @dost`);
        }

        if (sender) {
            senderName = "@" + sender.split('@')[0];
        }

        // ANDAR BAHIR WALA SCENE
        const msg = `╔════════════════════╗
║   🔄 ANDAR BAHIR  🔄  ║
╚════════════════════╝

👤 ${senderName} KA LOL
🎯 ${targetName} KI GAND

╔════════════════════╗
║                    ║
║    🟤 GAND         ║
║    ${targetName}   ║
║    🕳️             ║
║                    ║
║    ⬇️ ENTRY ⬇️     ║
║                    ║
║    🔴 LOL ANDAR    ║
║    💨 GHUS RAHA    ║
║                    ║
║    ⬇️⬇️⬇️⬇️⬇️       ║
║                    ║
║    💥 PHAT GAYA    ║
║    💥 BOOM!        ║
║                    ║
║    ⬆️ EXIT ⬆️      ║
║                    ║
║    🔴 LOL BAHAR    ║
║    💨 NIKAL RAHA   ║
║                    ║
║    ⬆️⬆️⬆️⬆️⬆️       ║
║                    ║
║    💨 FART NIKLA   ║
║    PPRRRRR!        ║
║                    ║
╚════════════════════╝

╔════════════════════╗
║   ✅ SCENE COMPLETE  ║
║   😂 ${targetName} KI GAND PHATI  ║
╚════════════════════╝

> BOSS-MD`;

        let mentions = [];
        if (target) mentions.push(target);
        if (sender) mentions.push(sender);
        
        await conn.sendMessage(from, {
            text: msg,
            mentions: mentions
        }, { quoted: mek });

        // ANDAR BAHIR REACTIONS
        await conn.sendMessage(from, { react: { text: "⬇️", key: mek.key } }); // ANDAR
        setTimeout(() => {
            conn.sendMessage(from, { react: { text: "💥", key: mek.key } }); // PHATA
        }, 2000);
        setTimeout(() => {
            conn.sendMessage(from, { react: { text: "⬆️", key: mek.key } }); // BAHAR
        }, 4000);
        setTimeout(() => {
            conn.sendMessage(from, { react: { text: "💨", key: mek.key } }); // FART
        }, 6000);
        setTimeout(() => {
            conn.sendMessage(from, { react: { text: "😂", key: mek.key } }); // DONE
        }, 8000);

    } catch (error) {
        await reply("😂 ANDAR BAHIR HO GAYA!");
    }
});
const { cmd } = require('../command');

// 👀 LOL ANDAR JATA NAZAR AYE - FULL MOTION

cmd({
    pattern: "lol",
    alias: ["l", "gand", "lolbomb"],
    react: "😂",
    desc: "Lol andar jata nazar aye",
    category: "fun",
    filename: __filename
}, async (conn, mek, m, { from, quoted, sender, reply }) => {
    try {
        let target = "";
        let targetName = "";
        let senderName = "";
        
        // Target check
        if (m.mentionedJid && m.mentionedJid.length > 0) {
            target = m.mentionedJid[0];
            targetName = "@" + target.split('@')[0];
        } else if (quoted && quoted.sender) {
            target = quoted.sender;
            targetName = "@" + target.split('@')[0];
        } else {
            return reply(`❌ .lol @dost`);
        }

        if (sender) {
            senderName = "@" + sender.split('@')[0];
        }

        // LOL ANDAR JATA NAZAR AYE
        const msg = `╔══════════════════════════╗
║   👀 LOL ANDAR JATA NAZAR AYE  👀  ║
╚══════════════════════════╝

👤 LOL MARNE WALA: ${senderName}
🎯 LOL KHANE WALA: ${targetName}
🕳️ TARGET: ${targetName} KI GAND


╔══════════════════════════╗
║    SCENE 1: GAND READY   ║
╚══════════════════════════╝

          ╔══╗
          ║  ║
          ║  ║
       ╔══╝  ╚══╗
       ║  GAND  ║
       ║ ${targetName} ║
       ╚══╗  ╔══╝
          ║  ║
          ║  ║
          ╚══╝


╔══════════════════════════╗
║    SCENE 2: LOL AA RAHA  ║
╚══════════════════════════╝

             🔴
            🔴🔴
           🔴🔴🔴
          🔴🔴🔴🔴
         🔴🔴🔴🔴🔴
        🔴🔴🔴🔴🔴🔴
       🔴🔴🔴🔴🔴🔴🔴
      
      LOL ${senderName} KA
      TARGET: ${targetName} KI GAND


╔══════════════════════════╗
║    SCENE 3: ANDAR JATA   ║
╚══════════════════════════╝

             🔴 LOL
              ↓
             🔴 LOL
              ↓
             🔴 LOL
              ↓
          ╔══════╗
          ║ GAND ║
          ╚══════╝
              ↓
          ╔══════╗
          ║ 💨   ║
          ║ GHUS ║
          ╚══════╝
              ↓
          ╔══════╗
          ║ ✅   ║
          ║ ANDAR║
          ╚══════╝


╔══════════════════════════╗
║    SCENE 4: ANDAR GAYA   ║
╚══════════════════════════╝

        ╔════════════════╗
        ║  GAND KE ANDAR ║
        ║                ║
        ║   🔴🔴🔴🔴🔴    ║
        ║   🔴 LOL 🔴    ║
        ║   🔴🔴🔴🔴🔴    ║
        ║                ║
        ║   💥 PHATA     ║
        ║   💥💥💥       ║
        ╚════════════════╝

${targetName}: "AAAAAAH! ANDAR GAYA!"


╔══════════════════════════╗
║    SCENE 5: BAHAR NIKLA  ║
╚══════════════════════════╝

          ╔══════╗
          ║ 💨   ║
          ║ NIKLA║
          ╚══════╝
              ↑
          ╔══════╗
          ║ GAND ║
          ╚══════╝
              ↑
             🔴 LOL
              ↑
             🔴 LOL
              ↑
             🔴 LOL


╔══════════════════════════╗
║    SCENE 6: FART NIKLA   ║
╚══════════════════════════╝

             💨
            💨💨
           💨💨💨
          💨💨💨💨
         💨💨💨💨💨
        
        PPRRRRRRRRRRR!

${targetName}: "HAYE! FART NIKAL GAYA!"


╔══════════════════════════╗
║       ✅ FINAL RESULT    ║
╚══════════════════════════╝

┏━━━━━━━━━━━━━━━━━━━━━━┓
┃                      ┃
┃   🎯 TARGET: ${targetName}  ┃
┃   🔴 LOL: ANDAR GAYA ┃
┃   💥 PHATA: HAAN     ┃
┃   💨 FART: NIKLA     ┃
┃   😂 ${targetName} RO RAHA  ┃
┃                      ┃
┗━━━━━━━━━━━━━━━━━━━━━━┛


╔══════════════════════════╗
║   🔥 ANDAR JATA NAZAR AYA? 🔥  ║
╚══════════════════════════╝

> BOSS-MD`;

        let mentions = [];
        if (target) mentions.push(target);
        if (sender) mentions.push(sender);
        
        await conn.sendMessage(from, {
            text: msg,
            mentions: mentions
        }, { quoted: mek });

        // MOTION REACTIONS
        await conn.sendMessage(from, { react: { text: "🔴", key: mek.key } }); // LOL
        setTimeout(() => {
            conn.sendMessage(from, { react: { text: "⬇️", key: mek.key } }); // ANDAR
        }, 2000);
        setTimeout(() => {
            conn.sendMessage(from, { react: { text: "💥", key: mek.key } }); // PHATA
        }, 4000);
        setTimeout(() => {
            conn.sendMessage(from, { react: { text: "⬆️", key: mek.key } }); // BAHAR
        }, 6000);
        setTimeout(() => {
            conn.sendMessage(from, { react: { text: "💨", key: mek.key } }); // FART
        }, 8000);
        setTimeout(() => {
            conn.sendMessage(from, { react: { text: "😂", key: mek.key } }); // DONE
        }, 10000);

    } catch (error) {
        await reply("😂 LOL ANDAR GAYA!");
    }
});