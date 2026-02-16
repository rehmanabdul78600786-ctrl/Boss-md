const { cmd } = require('../command');

cmd({
    pattern: "lol",
    alias: ["l", "gand"],
    react: "😂",
    desc: "Dost ki gand me lol",
    category: "fun",
    filename: __filename
}, async (conn, mek, m, { from, quoted, sender, reply }) => {
    try {
        let target = "";
        let targetName = "";
        
        if (m.mentionedJid && m.mentionedJid.length > 0) {
            target = m.mentionedJid[0];
            targetName = "@" + target.split('@')[0];
        } else if (quoted && quoted.sender) {
            target = quoted.sender;
            targetName = "@" + target.split('@')[0];
        } else {
            return reply("❌ .lol @dost");
        }

        // INITIAL MESSAGE
        const msg1 = `🎬 *ANIMATION START* 🎬

🎯 TARGET: ${targetName}
🕳️ GAND: ${targetName} KI

⏳ LOL AA RAHA HAI...`;

        await conn.sendMessage(from, {
            text: msg1,
            mentions: [target]
        }, { quoted: mek });

        // STAGE 1: LOL APPROACHING
        setTimeout(async () => {
            const msg2 = `⬇️ *LOL APPROACHING* ⬇️

${targetName} KI GAND 🕳️
           
           🔴
          🔴🔴
         🔴 LOL 🔴
          🔴🔴
           🔴
           
⏳ ANDAR JA RAHA...`;

            await conn.sendMessage(from, { text: msg2, mentions: [target] });
        }, 2000);

        // STAGE 2: LOL ENTERING
        setTimeout(async () => {
            const msg3 = `🚪 *LOL ENTERING* 🚪

🕳️ GAND KE DARWAZE PAR

           🔴
            ↓
           🔴
            ↓
        ╔══════╗
        ║ GAND ║
        ╚══════╝
            ↓
        ╔══════╗
        ║ 💨   ║
        ║ GHUS ║
        ╚══════╝

⏳ ANDAR GAYA...`;

            await conn.sendMessage(from, { text: msg3, mentions: [target] });
        }, 4000);

        // STAGE 3: INSIDE GAND
        setTimeout(async () => {
            const msg4 = `💥 *LOL INSIDE GAND* 💥

        ╔══════════╗
        ║ GAND MEIN║
        ║          ║
        ║  🔴 LOL ║
        ║  💥💥💥  ║
        ║  PHATA   ║
        ║          ║
        ╚══════════╝

${targetName}: "AAAAAAH! MERI GAND!"`;

            await conn.sendMessage(from, { text: msg4, mentions: [target] });
        }, 6000);

        // STAGE 4: EXITING
        setTimeout(async () => {
            const msg5 = `⬆️ *LOL EXITING* ⬆️

        ╔══════╗
        ║ 💨   ║
        ║ NIKLA║
        ╚══════╝
            ↑
        ╔══════╗
        ║ GAND ║
        ╚══════╝
            ↑
           🔴
            ↑
           🔴

⏳ BAHAR AA RAHA...`;

            await conn.sendMessage(from, { text: msg5, mentions: [target] });
        }, 8000);

        // STAGE 5: FART
        setTimeout(async () => {
            const msg6 = `💨 *FART RELEASED* 💨

           💨
          💨💨
         💨💨💨
        💨💨💨💨
       💨💨💨💨💨
      
      *PPRRRRRRRRRR!*

${targetName}: "HAYE! FART NIKAL GAYA!"`;

            await conn.sendMessage(from, { text: msg6, mentions: [target] });
        }, 10000);

        // STAGE 6: FINAL RESULT
        setTimeout(async () => {
            const msg7 = `✅ *FINAL RESULT* ✅

┏━━━━━━━━━━━━━━━━━━┓
┃                  ┃
┃   🎯 TARGET: ${targetName}  ┃
┃   🔴 LOL: ANDAR  ┃
┃   💥 PHATA: HAAN ┃
┃   💨 FART: NIKLA ┃
┃   😂 ${targetName} RO RAHA ┃
┃                  ┃
┃   🎉 LOL LAG GAYA! 🎉 ┃
┃                  ┃
┗━━━━━━━━━━━━━━━━━━┛

🔥 ${targetName} KI GAND MEIN LOL! 🔥

> BOSS-MD`;

            await conn.sendMessage(from, { 
                text: msg7, 
                mentions: [target] 
            });
        }, 12000);

        // REACTIONS AUTO
        const reactions = ["🎬", "⬇️", "🚪", "💥", "⬆️", "💨", "✅", "😂"];
        for (let i = 0; i < reactions.length; i++) {
            setTimeout(() => {
                conn.sendMessage(from, { 
                    react: { text: reactions[i], key: mek.key } 
                });
            }, i * 1500);
        }

    } catch (error) {
        console.log("Animation Error:", error);
        await reply("😂 ANIMATION LOL!");
    }
});