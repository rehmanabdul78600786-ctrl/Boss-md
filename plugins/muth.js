const { cmd } = require('../command');

// =================== .muth Command (Animation Sequence) ===================
cmd({
    pattern: "muth",
    alias: ["muthi", "muthmare", "fap", "handjob"],
    desc: "Muth animation emoji sequence",
    category: "fun",
    react: "✊",
    filename: __filename,
    use: ".muth @user"
}, async (conn, mek, m, { from, isGroup }) => {
    try {
        // Target user
        const mentioned = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : mek.key.participant || mek.key.remoteJid;
        const userNum = mentioned.split('@')[0];
        
        // Start message
        await conn.sendMessage(from, {
            text: `✊ *MUTH MODE ACTIVATED!*\nTarget: @${userNum}\nBoss-MD muth sequence starting...`,
            mentions: [mentioned]
        }, { quoted: mek });

        // MUTH Animation Sequence
        const muthSequence = [
            { text: "🥵 *Garam hona shuru...*", delay: 1000 },
            { text: "🤭 *Hath ready ho raha...*", delay: 1200 },
            { text: "✊ *Muth phase 1...*", delay: 1000 },
            { text: "✊✊ *Muth phase 2...*", delay: 800 },
            { text: "✊✊✊ *Muth phase 3...*", delay: 600 },
            { text: "😵 *Aaahhhh...*", delay: 1000 },
            { text: "💧 *Drop 1...*", delay: 500 },
            { text: "💦 *Drop 2...*", delay: 500 },
            { text: "💦💦💦 *Fountain!*", delay: 800 },
            { text: "😵‍💫 *Khatam...*", delay: 1000 },
            { text: "🤤🤤 *MUTH COMPLETE!*\n@${userNum} ne muth mar li! 👏", delay: 1000 }
        ];

        // Send each message with delay
        for (const step of muthSequence) {
            await new Promise(resolve => setTimeout(resolve, step.delay));
            await conn.sendMessage(from, { 
                text: step.text.replace('${userNum}', userNum),
                mentions: [mentioned]
            });
        }

    } catch (e) {
        console.error("Muth Animation Error:", e);
    }
});

// =================== .ungli Command (Animation Sequence) ===================
cmd({
    pattern: "ungli",
    alias: ["finger", "middlefinger", "fing", "bhenchod"],
    desc: "Ungli animation emoji sequence",
    category: "fun",
    react: "🖕",
    filename: __filename,
    use: ".ungli @user"
}, async (conn, mek, m, { from, isGroup }) => {
    try {
        // Target user
        const mentioned = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : mek.key.participant || mek.key.remoteJid;
        const userNum = mentioned.split('@')[0];
        
        // Start message
        await conn.sendMessage(from, {
            text: `🖕 *UNGLI MODE ACTIVATED!*\nTarget: @${userNum}\nBoss-MD ungli sequence starting...`,
            mentions: [mentioned]
        }, { quoted: mek });

        // UNGLI Animation Sequence
        const ungliSequence = [
            { text: "😠 *Gussa aana shuru...*", delay: 1000 },
            { text: "🤬 *Gaali dimaag mein...*", delay: 1200 },
            { text: "👆 *Ungli uthi...*", delay: 1000 },
            { text: "🖕 *Ungli ready...*", delay: 800 },
            { text: "🖕 *Ungli target lock...* @${userNum}", delay: 1000 },
            { text: "💥 *Ungli fire!* Bhenchod!", delay: 800 },
            { text: "🤯 *Target hit!*", delay: 600 },
            { text: "😵 *Target knocked out!*", delay: 800 },
            { text: "🎯 *Direct hit!*", delay: 600 },
            { text: "🔥 *Ungli complete!*\n@${userNum} ko ungli mil gayi! 🖕", delay: 1000 }
        ];

        // Send each message with delay
        for (const step of ungliSequence) {
            await new Promise(resolve => setTimeout(resolve, step.delay));
            await conn.sendMessage(from, { 
                text: step.text.replace('${userNum}', userNum),
                mentions: [mentioned]
            });
        }

    } catch (e) {
        console.error("Ungli Animation Error:", e);
    }
});

// =================== .sex Command (Optional Extra) ===================
cmd({
    pattern: "sex",
    alias: ["chudai", "fuck", "porn"],
    desc: "Sex animation emoji sequence",
    category: "fun",
    react: "🍆",
    filename: __filename,
    use: ".sex @user"
}, async (conn, mek, m, { from }) => {
    try {
        const mentioned = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : mek.key.remoteJid;
        const userNum = mentioned.split('@')[0];
        
        await conn.sendMessage(from, {
            text: `🍑 *SEX MODE ACTIVATED!*\nTarget: @${userNum}\nBoss-MD sex sequence starting...`,
            mentions: [mentioned]
        }, { quoted: mek });

        const sexSequence = [
            { text: "👙 *Kapde utar rahe...*", delay: 1200 },
            { text: "🍆 *Lund khada...*", delay: 1000 },
            { text: "🍑 *Gaand ready...*", delay: 800 },
            { text: "💦 *Chikni chut...*", delay: 1000 },
            { text: "🔥 *Andar ghusa...* Aahhh!", delay: 800 },
            { text: "💥 *Jhatke lage...* 1...", delay: 600 },
            { text: "💥💥 *Jhatke lage...* 2...", delay: 500 },
            { text: "💥💥💥 *Jhatke lage...* 3...", delay: 400 },
            { text: "😫 *Aaahhh aa raha...*", delay: 800 },
            { text: "💦💦💦 *Nikla!* Splash!", delay: 600 },
            { text: "😵‍💫 *Khatam tashan!*\n@${userNum} ki chudai ho gayi! 🎉", delay: 1000 }
        ];

        for (const step of sexSequence) {
            await new Promise(resolve => setTimeout(resolve, step.delay));
            await conn.sendMessage(from, { 
                text: step.text.replace('${userNum}', userNum),
                mentions: [mentioned]
            });
        }

    } catch (e) {
        console.error("Sex Animation Error:", e);
    }
});

console.log("✅ Muth/Ungli Animation Plugin Loaded!");
