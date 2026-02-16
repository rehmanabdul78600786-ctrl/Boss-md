const { cmd } = require('../command');

// 💀 LOL BOMB - DOST KI BOND MEIN GHUSEY WALI PLUGIN

cmd({
    pattern: "lol",
    alias: ["laugh", "haha", "mazak"],
    react: "😂",
    desc: "Dost ko LOL karo",
    category: "fun",
    filename: __filename,
    use: ".lol @user"
}, async (conn, mek, m, { from, isGroup, quoted, sender, reply }) => {
    try {
        let target = "";
        let targetName = "";
        
        // Check if someone is mentioned or replied
        if (m.mentionedJid && m.mentionedJid.length > 0) {
            target = m.mentionedJid[0];
            targetName = "@" + target.split('@')[0];
        } else if (quoted) {
            target = quoted.sender;
            targetName = "@" + target.split('@')[0];
        } else {
            target = sender;
            targetName = "Khud";
        }

        const lolMessages = [
            `╔══════════════════════════╗
║     😆 LOL BOMB 💣     ║
╚══════════════════════════╝

${targetName} ko laga LOL Bomb!


     💣💣💣
   💣💣💣💣💣
 💣💣💣💣💣💣💣
💣💣💣💣💣💣💣💣💣
 💣💣💣💣💣💣💣
   💣💣💣💣💣
     💣💣💣

░░░░░░░░░░░░░░░░░░░░
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
████████████████████

🎯 TARGET HIT: ${targetName}
💥 DAMAGE: 100% LOL
😆 STATUS: CRACKING...`,

            `╔══════════════════════════╗
║   🔥 LOL ZONE 🔥        ║
╚══════════════════════════╝

${targetName} ENTERED THE LOL ZONE!

╔══════════════╗
║              ║
║   😆😆😆😆😆   ║
║   😆${targetName}😆   ║
║   😆😆😆😆😆   ║
║              ║
╚══════════════╝

😂😂😂😂😂😂😂😂😂😂😂😂
😂                  😂
😂   ${targetName} INSIDE  😂
😂                  😂
😂😂😂😂😂😂😂😂😂😂😂😂

🤣 SYSTEM OVERLOAD: LOL DETECTED`,

            `╔══════════════════════════╗
║    🎯 TARGET LOCKED 🎯    ║
╚══════════════════════════╝

██╗░░░░░░█████╗░██╗░░░░░
██║░░░░░██╔══██╗██║░░░░░
██║░░░░░██║░░██║██║░░░░░
██║░░░░░██║░░██║██║░░░░░
███████╗╚█████╔╝███████╗
╚══════╝░╚════╝░╚══════╝

░░░░░░░░░░░░░░░░░░░░░░░░
░░${targetName}░░
░░░░░░░░░░░░░░░░░░░░░░░░

🎉 ${targetName} KI LOL HO GAYI! 🎉
💀 BOND MEIN GHUS GAYA LOL!`,

            `╔══════════════════════════╗
║    🚨 LOL ALERT 🚨       ║
╚══════════════════════════╝

▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
█░░░░░░░░░░░░░░░░░░░░░░░░░█
█░ ${targetName} IS GETTING LOL ░█
█░░░░░░░░░░░░░░░░░░░░░░░░░█
▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀

     😂😂😂😂😂😂😂
     😂  LOL  😂
     😂😂😂😂😂😂😂

📢 ANNOUNCEMENT: ${targetName} AB OFFICIALLY LOL HAI!`,

            `╔══════════════════════════╗
║    🕳️ LOL PIT 🕳️        ║
╚══════════════════════════╝

${targetName} GIR GAYA LOL PIT MEIN!

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
${targetName} = LOL
⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️

🤣 HELP! ${targetName} CAN'T STOP LAUGHING!`,

            `╔══════════════════════════╗
║    🧠 LOL VIRUS 🦠      ║
╚══════════════════════════╝

${targetName} KE DIMAAG MEIN LOL VIRUS!

╔══════════╗
║ ████████ ║  INFECTED: 100%
║ ██${targetName}██ ║  VIRUS: LOL
║ ████████ ║  STATUS: CRITICAL
╚══════════╝

🦠🦠🦠🦠🦠🦠🦠🦠🦠🦠
🦠  LOL LOL LOL LOL  🦠
🦠  LOL ${targetName} LOL  🦠
🦠  LOL LOL LOL LOL  🦠
🦠🦠🦠🦠🦠🦠🦠🦠🦠🦠

💊 DAWA: EK AUR LOL!`,

            `╔══════════════════════════╗
║    🎪 LOL CIRCUS 🎪      ║
╚══════════════════════════╝

${targetName} CIRCUS MEIN ENTRY!

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
🤡 ${targetName} IS THE MAIN CLOWN!`,

            `╔══════════════════════════╗
║    📺 LOL TV 📺         ║
╚══════════════════════════╝

┏━━━━━━━━━━━━━━━━━━┓
┃                  ┃
┃   😂 LOL NEWS 😂  ┃
┃                  ┃
┃   ${targetName}    ┃
┃   NE LIYA LOL    ┃
┃                  ┃
┗━━━━━━━━━━━━━━━━━━┛

📡 BREAKING NEWS!
🎤 ${targetName} PAR LOL BARSHA!`
        ];

        const randomLol = lolMessages[Math.floor(Math.random() * lolMessages.length)];
        
        await reply(randomLol);
        
        // Send multiple reactions for fun
        await conn.sendMessage(from, {
            react: { text: "😂", key: mek.key }
        });
        
        setTimeout(async () => {
            await conn.sendMessage(from, {
                react: { text: "🤣", key: mek.key }
            });
        }, 1000);
        
        setTimeout(async () => {
            await conn.sendMessage(from, {
                react: { text: "💀", key: mek.key }
            });
        }, 2000);

    } catch (error) {
        console.error("LOL command error:", error);
        reply(`╔════════════════════╗
║    ❌ ERROR ❌    ║
╚════════════════════╝
LOL bomb phut gaya! 💣`);
    }
});

cmd({
    pattern: "lolhelp",
    alias: ["lolinfo", "lolguide"],
    react: "📖",
    desc: "LOL bomb guide",
    category: "fun",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    const helpMsg = `╔══════════════════════════╗
║   💣 LOL BOMB GUIDE 💣  ║
╚══════════════════════════╝

┏━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  📌 COMMANDS:          ┃
┃  • .lol @user          ┃
┃  • .lol (reply to msg) ┃
┃                        ┃
┃  🎯 FEATURES:          ┃
┃  • 8+ LOL DESIGNS      ┃
┃  • RANDOM EVERY TIME   ┃
┃  • BOND MEIN GHUSEY    ┃
┃  • FULL MAZA           ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━┛

╔══════════════════════════╗
║   🔥 USE KARO DOSTO PAR! 🔥  ║
╚══════════════════════════╝`;

    await reply(helpMsg);
});