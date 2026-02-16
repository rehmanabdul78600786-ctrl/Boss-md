const { cmd } = require('../command');

// 🔥 DHAMAKEDAR LOL STYLE - SABKO HIRAN KARNE WALI

cmd({
    pattern: "lol",
    alias: ["lolbomb", "mazak", "haha", "laugh"],
    react: "😂",
    desc: "Dost ko lol karo",
    category: "fun",
    filename: __filename
}, async (conn, mek, m, { from, quoted, sender, reply }) => {
    try {
        let target = "";
        let targetName = "";
        let targetMention = [];
        
        // Target ko pakdo
        if (m.mentionedJid && m.mentionedJid.length > 0) {
            target = m.mentionedJid[0];
            targetName = "@" + target.split('@')[0];
            targetMention = [target];
        } else if (quoted) {
            target = quoted.sender;
            targetName = "@" + target.split('@')[0];
            targetMention = [target];
        } else {
            targetName = "TERI APNI";
            targetMention = [sender];
        }

        // 10 DHAMAKEDAR DESIGNS
        const lolStyles = [
            `╔════════════════════════════════╗
║     😂 LOL BOMB 💣     😂    ║
╚════════════════════════════════╝

╔════════════════════════════════╗
║                                  ║
║        ░░░░░░░░░░░░░░░░░░        ║
║        ░${targetName}░░        ║
║        ░░░░░░░░░░░░░░░░░░        ║
║                                  ║
║        💥 LOL LAGA 💥            ║
║                                  ║
╚════════════════════════════════╝

😂 ${targetName} KI LOL HO GAI! 😂`,

            `╔════════════════════════════════╗
║     🔥 LOL ZONE 🔥            ║
╚════════════════════════════════╝

┌────────────────────────────────┐
│                                │
│    █▀▀ ▀▄▀ ▀▄▀ ▀█▀ █ █▀▀       │
│    █▄▄ █░█ █░█ ░█░ █ █▄▄       │
│                                │
│    🎯 TARGET: ${targetName}     │
│    💀 STATUS: LOL LAG GAYA     │
│                                │
└────────────────────────────────┘

🤣🤣🤣 MAZA AA GYA! 🤣🤣🤣`,

            `╔════════════════════════════════╗
║     🚀 LOL MISSILE 🚀          ║
╚════════════════════════════════╝

          🚀
         🚀🚀
        🚀🚀🚀
       🚀🚀🚀🚀
      🚀🚀🚀🚀🚀
     🚀🚀🚀🚀🚀🚀
    🚀🚀🚀🚀🚀🚀🚀
   🚀🚀🚀🚀🚀🚀🚀🚀
  🚀🚀🚀🚀🚀🚀🚀🚀🚀
 🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀

🎯 TARGET: ${targetName}
💥 DAMAGE: 100% LOL
😆 RESULT: LAG GAYA!`,

            `╔════════════════════════════════╗
║     🎪 LOL CIRCUS 🎪           ║
╚════════════════════════════════╝

        ╱◥████◣
       │░░█████│
       │░▄█████░│
       │░███████░│
       │░███████░│
       ╲▀█████▀╱
        │  │  │
        │  │  │
     ${targetName}

🎪 WELCOME TO LOL CIRCUS!
🤡 ${targetName} IS MAIN CLOWN!`,

            `╔════════════════════════════════╗
║     📺 LOL NEWS 📺            ║
╚════════════════════════════════╝

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                              ┃
┃   😂 BREAKING NEWS 😂        ┃
┃                              ┃
┃   ${targetName}              ┃
┃   PAR LOL BARSA!             ┃
┃                              ┃
┃   🌧️ LOL LOL LOL LOL         ┃
┃   🌧️ LOL LOL LOL LOL         ┃
┃                              ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

📡 REPORT: ${targetName} BHEEG GAYA!`,

            `╔════════════════════════════════╗
║     🦠 LOL VIRUS 🦠           ║
╚════════════════════════════════╝

╔════════════════════════════════╗
║ ██████████████████████████████ ║
║ ██  ${targetName}  ██ ║
║ ██████████████████████████████ ║
║ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ ║
╚════════════════════════════════╝

🦠 INFECTED: 100%
💊 VIRUS: LOL STRAIN
🏥 STATUS: CRITICAL LOL`,

            `╔════════════════════════════════╗
║     🕳️ LOL PIT 🕳️            ║
╚════════════════════════════════╝

          █
         ██
        ███
       ████
      █████
     ██████
    ███████
   ████████
  █████████
 ██████████
███████████

⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️
${targetName} GIR GAYA!
⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️`,

            `╔════════════════════════════════╗
║     🎯 LOL TARGET 🎯          ║
╚════════════════════════════════╝

     🎯
    🎯🎯
   🎯🎯🎯
  🎯🎯🎯🎯
 🎯🎯🎯🎯🎯
🎯🎯🎯🎯🎯🎯
 🎯🎯🎯🎯🎯
  🎯🎯🎯🎯
   🎯🎯🎯
    🎯🎯
     🎯

🎯 TARGET LOCKED: ${targetName}
🔫 FIRING: LOL MISSILE
💥 RESULT: HIT SUCCESSFUL!`,

            `╔════════════════════════════════╗
║     🏆 LOL CHAMPION 🏆        ║
╚════════════════════════════════╝

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                              ┃
┃    👑 AND THE WINNER IS 👑   ┃
┃                              ┃
┃        ${targetName}         ┃
┃                              ┃
┃    🏆 LOL CHAMPIONSHIP 🏆    ┃
┃                              ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

🎉 MUBARAK HO ${targetName}! 🎉
😂 AAP NE LOL JEET LIYA! 😂`,

            `╔════════════════════════════════╗
║     🌪️ LOL STORM 🌪️          ║
╚════════════════════════════════╝

        🌪️🌪️🌪️
      🌪️🌪️🌪️🌪️🌪️
    🌪️🌪️🌪️🌪️🌪️🌪️🌪️
  🌪️🌪️🌪️🌪️🌪️🌪️🌪️🌪️🌪️
🌪️🌪️🌪️🌪️🌪️🌪️🌪️🌪️🌪️🌪️🌪️
  🌪️🌪️🌪️🌪️🌪️🌪️🌪️🌪️🌪️
    🌪️🌪️🌪️🌪️🌪️🌪️🌪️
      🌪️🌪️🌪️🌪️🌪️
        🌪️🌪️🌪️

🌀 ${targetName} LOL STORM MEIN!
⚡ UD GAYA LOL MEIN!`
        ];

        // Random style select karo
        const selectedStyle = lolStyles[Math.floor(Math.random() * lolStyles.length)];
        
        // Final message with mention
        const finalMsg = {
            text: selectedStyle,
            mentions: targetMention
        };

        await conn.sendMessage(from, finalMsg, { quoted: mek });
        
        // Triple reactions for dhamaka
        const reactions = ["😂", "🤣", "💀"];
        for (let i = 0; i < reactions.length; i++) {
            setTimeout(async () => {
                await conn.sendMessage(from, { 
                    react: { text: reactions[i], key: mek.key } 
                });
            }, i * 800);
        }

    } catch (error) {
        console.log("LOL Error:", error);
        // Simple error message jo chalega
        await reply(`╔════════════════════╗
║   😂 LOL 😂   ║
╚════════════════════╝

LOL HO GAYA! 😂

> BOSS-MD`);
        
        // Error mein bhi reaction
        await conn.sendMessage(from, { 
            react: { text: "😂", key: mek.key } 
        });
    }
});

// Help command
cmd({
    pattern: "lolhelp",
    alias: ["lolinfo"],
    react: "📖",
    desc: "LOL guide",
    category: "fun",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    const helpMsg = `╔════════════════════════════════╗
║   📖 LOL BOMB GUIDE 📖      ║
╚════════════════════════════════╝

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                              ┃
┃  🎯 COMMANDS:                ┃
┃  • .lol @user                ┃
┃  • .lol (reply to message)   ┃
┃                              ┃
┃  🔥 FEATURES:                ┃
┃  • 10+ UNIQUE STYLES         ┃
┃  • RANDOM EVERY TIME         ┃
┃  • TRIPLE REACTIONS          ┃
┃  • MENTION SUPPORT            ┃
┃  • 100% WORKING              ┃
┃                              ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

╔════════════════════════════════╗
║   😂 USE KARO MAZA AAEGA! 😂   ║
╚════════════════════════════════╝

> BOSS-MD`;
    
    await reply(helpMsg);
});