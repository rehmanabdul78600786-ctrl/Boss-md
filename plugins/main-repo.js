const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const config = require('../config');    
const { cmd } = require('../command');

// 🔥 STYLISH BOT NAME SYSTEM
const botNameStyles = [
    "𝓑𝓞𝓢𝓢-𝓜𝓓", "𝐁𝐎𝐒𝐒-𝐌𝐃", "𝘽𝙊𝙎𝙎-𝙈𝘿", "𝗕𝗢𝗦𝗦-𝗠𝗗",
    "ᗷOᔕᔕ-ᗰᗪ", "ＢＯＳＳ－ＭＤ", "🄱🄾🅂🅂-🄼🄳", "B⃟O⃟S⃟S⃟-⃟M⃟D⃟"
];

function getRandomBotName() {
    return botNameStyles[Math.floor(Math.random() * botNameStyles.length)];
}

let isRepoExecuting = false; // Prevent double execution

cmd({
    pattern: "repo",
    alias: ["sc", "script", "source", "github"],
    desc: "Get BOSS-MD repository information with stylish design",
    react: "📂",
    category: "info",
    filename: __filename,
},
async (conn, mek, m, { from, reply, sender, pushname }) => {
    try {
        // 🔥 PREVENT DOUBLE EXECUTION
        if (isRepoExecuting) {
            await conn.sendMessage(from, {
                react: { text: '❌', key: m.key }
            });
            return reply("📌 *Already processing...* Please wait!");
        }
        
        isRepoExecuting = true;
        
        // Random bot name for this execution
        const botName = getRandomBotName();
        
        // Send processing reaction
        await conn.sendMessage(from, {
            react: { text: '⏳', key: m.key }
        });
        
        const githubRepoURL = 'https://github.com/bosstech-collab/Boss-md-';
        
        // Extract username and repo name
        const [, username, repoName] = githubRepoURL.match(/github\.com\/([^/]+)\/([^/]+)/) || ['', 'bosstech-collab', 'Boss-md-'];
        
        // 📊 ULTRA STYLISH FORMAT
        const stylishBorder = "═".repeat(35);
        const stylishHeader = `
╔${stylishBorder}╗
║           📂 ${botName} 📂           ║
╚${stylishBorder}╝`;
        
        // Send stylish header first
        await conn.sendMessage(from, {
            text: stylishHeader
        }, { quoted: mek });
        
        // Fetch repository details
        const response = await fetch(`https://api.github.com/repos/${username}/${repoName}`, {
            timeout: 10000,
            headers: { 'User-Agent': 'BOSS-MD-Bot' }
        });
        
        if (!response.ok) {
            throw new Error(`GitHub API request failed with status ${response.status}`);
        }

        const repoData = await response.json();
        
        // 🎨 ULTRA ENHANCED FORMAT
        const formattedInfo = `
${stylishHeader}

📂 *REPOSITORY INFORMATION*

┌─⭓ *Basic Details* ⭓
│
│ 📛 *Repository:* ${repoData.name}
│ 👑 *Owner:* ${repoData.owner.login}
│ 📝 *Description:* ${repoData.description || 'No description'}
│ 🔗 *URL:* ${repoData.html_url}
│
├─⭓ *Statistics* ⭓
│
│ ⭐ *Stars:* ${repoData.stargazers_count}
│ 🍴 *Forks:* ${repoData.forks_count}
│ 👀 *Watchers:* ${repoData.watchers_count}
│ 🏷️ *Language:* ${repoData.language || 'Not specified'}
│ 📅 *Created:* ${new Date(repoData.created_at).toLocaleDateString()}
│ 🔄 *Updated:* ${new Date(repoData.updated_at).toLocaleDateString()}
│
├─⭓ *Additional Info* ⭓
│
│ 📦 *Size:* ${(repoData.size / 1024).toFixed(2)} MB
│ 📄 *Default Branch:* ${repoData.default_branch}
│ 🔓 *Visibility:* ${repoData.private ? 'Private' : 'Public'}
│ 🏠 *Homepage:* ${repoData.homepage || 'Not specified'}
│
└─⭓ *User Info* ⭓

👤 *Requested by:* ${pushname || 'User'}
🆔 *User ID:* ${sender.split('@')[0]}
📱 *Platform:* WhatsApp
⏰ *Time:* ${new Date().toLocaleTimeString()}

${"═".repeat(35)}

💡 *IMPORTANT NOTES:*
• ⭐ Don't forget to star the repository!
• 🍴 Fork for customization!
• 🐛 Report issues if found!
• 🔄 Keep updated with latest commits!

⚡ *POWERED BY:* ${botName}
🎯 *REPO COMMAND*`;

        // Send image with enhanced caption
        await conn.sendMessage(from, {
            image: { url: `https://files.catbox.moe/wcro3e.jpg` },
            caption: formattedInfo,
            contextInfo: {
                mentionedJid: [sender],
                externalAdReply: {
                    title: `📂 ${botName} Repository`,
                    body: `GitHub • ${repoData.stargazers_count} Stars`,
                    thumbnailUrl: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
                    sourceUrl: repoData.html_url,
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: mek });

        // Send audio (if exists)
        try {
            const audioPath = path.join(__dirname, '../assets/menu.m4a');
            if (fs.existsSync(audioPath)) {
                await conn.sendMessage(from, {
                    audio: fs.readFileSync(audioPath),
                    mimetype: 'audio/mp4',
                    ptt: true
                }, { quoted: mek });
            }
        } catch (audioError) {
            console.log("Audio optional, continuing...");
        }

        // Success reaction
        await conn.sendMessage(from, {
            react: { text: '✅', key: m.key }
        });
        
        // Reset execution flag
        setTimeout(() => { isRepoExecuting = false; }, 3000);
        
    } catch (error) {
        console.error("Repo command error:", error);
        
        // Error reaction
        await conn.sendMessage(from, {
            react: { text: '❌', key: m.key }
        });
        
        const botName = getRandomBotName();
        const errorMessage = `
❌ *${botName} REPO ERROR*

⚠️ *Issue:* Could not fetch repository information

🔧 *Possible Solutions:*
1. Check internet connection
2. GitHub API might be down
3. Repository might be private
4. Try again in a few minutes

📌 *Error Details:*
${error.message}

⚡ *Contact support if issue persists*
        `.trim();
        
        await reply(errorMessage);
        
        // Reset execution flag
        isRepoExecuting = false;
    }
});

// 🔥 EXTRA: SIMPLE REPO COMMAND
cmd({
    pattern: "reposimple",
    alias: ["repo2", "sourcecode"],
    desc: "Simple repository information",
    react: "📄",
    category: "info",
    filename: __filename,
},
async (conn, mek, m, { from, reply }) => {
    const simpleMessage = `
📂 *BOSS-MD Repository*

🔗 *GitHub:* https://github.com/bosstech-collab/Boss-md-

⭐ *Please star the repository!*
🍴 *Fork for customization!*

⚡ *Use .repo for detailed info*
    `.trim();
    
    await reply(simpleMessage);
});
