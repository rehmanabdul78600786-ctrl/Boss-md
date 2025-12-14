const { cmd } = require('../command');
const axios = require('axios');
const { channelInfo } = require('../lib/messageConfig');

cmd({
    pattern: "character",
    react: "🔮",
    desc: "Analyze the character of a user",
    category: "fun",
    filename: __filename
}, 
async (conn, mek, m, { from }) => {
    try {
        let userToAnalyze;

        // Check for mentioned users
        if (m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
            userToAnalyze = m.message.extendedTextMessage.contextInfo.mentionedJid[0];
        }
        // Check for replied message
        else if (m.message?.extendedTextMessage?.contextInfo?.participant) {
            userToAnalyze = m.message.extendedTextMessage.contextInfo.participant;
        }

        if (!userToAnalyze) {
            return conn.sendMessage(from, { 
                text: 'Please mention someone or reply to their message to analyze their character!',
                ...channelInfo
            });
        }

        // Get user's profile picture
        let profilePic;
        try {
            profilePic = await conn.profilePictureUrl(userToAnalyze, 'image');
        } catch {
            profilePic = 'https://i.imgur.com/2wzGhpF.jpeg'; // Default image if no profile pic
        }

        const traits = [
            "Intelligent", "Creative", "Determined", "Ambitious", "Caring",
            "Charismatic", "Confident", "Empathetic", "Energetic", "Friendly",
            "Generous", "Honest", "Humorous", "Imaginative", "Independent",
            "Intuitive", "Kind", "Logical", "Loyal", "Optimistic",
            "Passionate", "Patient", "Persistent", "Reliable", "Resourceful",
            "Sincere", "Thoughtful", "Understanding", "Versatile", "Wise"
        ];

        // Get 3-5 random traits
        const numTraits = Math.floor(Math.random() * 3) + 3; // 3 to 5 traits
        const selectedTraits = [];
        for (let i = 0; i < numTraits; i++) {
            const randomTrait = traits[Math.floor(Math.random() * traits.length)];
            if (!selectedTraits.includes(randomTrait)) {
                selectedTraits.push(randomTrait);
            }
        }

        // Calculate random percentages for each trait
        const traitPercentages = selectedTraits.map(trait => {
            const percentage = Math.floor(Math.random() * 41) + 60; // 60-100%
            return `${trait}: ${percentage}%`;
        });

        // Create character analysis message
        const analysis = `🔮 *Character Analysis* 🔮\n\n` +
            `👤 *User:* ${userToAnalyze.split('@')[0]}\n\n` +
            `✨ *Key Traits:*\n${traitPercentages.join('\n')}\n\n` +
            `🎯 *Overall Rating:* ${Math.floor(Math.random() * 21) + 80}%\n\n` +
            `Note: This is a fun analysis and should not be taken seriously!`;

        // Send the analysis with the user's profile picture
        await conn.sendMessage(from, {
            image: { url: profilePic },
            caption: analysis,
            mentions: [userToAnalyze],
            ...channelInfo
        });

    } catch (error) {
        console.error('Error in character command:', error);
        await conn.sendMessage(from, { 
            text: 'Failed to analyze character! Try again later.',
            ...channelInfo 
        });
    }
});

