const { cmd } = require('../command');

const compliments = [
    "You're amazing just the way you are!",
    "You have a great sense of humor!",
    "You're incredibly thoughtful and kind.",
    "You are more powerful than you know.",
    "You light up the room!",
    "You're a true friend.",
    "You inspire me!",
    "Your creativity knows no bounds!",
    "You have a heart of gold.",
    "You make a difference in the world.",
    "Your positivity is contagious!",
    "You have an incredible work ethic.",
    "You bring out the best in people.",
    "Your smile brightens everyone's day.",
    "You're so talented in everything you do.",
    "Your kindness makes the world a better place.",
    "You have a unique and wonderful perspective.",
    "Your enthusiasm is truly inspiring!",
    "You are capable of achieving great things.",
    "You always know how to make someone feel special.",
    "Your confidence is admirable.",
    "You have a beautiful soul.",
    "Your generosity knows no limits.",
    "You have a great eye for detail.",
    "Your passion is truly motivating!",
    "You are an amazing listener.",
    "You're stronger than you think!",
    "Your laughter is infectious.",
    "You have a natural gift for making others feel valued.",
    "You make the world a better place just by being in it."
];

cmd({
    pattern: "compliment",
    react: "💖",
    desc: "Send a compliment to someone",
    category: "fun",
    filename: __filename
}, 
async (conn, mek, m, { from }) => {
    try {
        let userToCompliment;

        // Check for mentioned users
        if (m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
            userToCompliment = m.message.extendedTextMessage.contextInfo.mentionedJid[0];
        }
        // Check for replied message
        else if (m.message?.extendedTextMessage?.contextInfo?.participant) {
            userToCompliment = m.message.extendedTextMessage.contextInfo.participant;
        }

        if (!userToCompliment) {
            return conn.sendMessage(from, { 
                text: 'Please mention someone or reply to their message to compliment them!'
            });
        }

        const compliment = compliments[Math.floor(Math.random() * compliments.length)];

        // Optional small delay to avoid any rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));

        await conn.sendMessage(from, { 
            text: `Hey @${userToCompliment.split('@')[0]}, ${compliment}`,
            mentions: [userToCompliment]
        });

    } catch (error) {
        console.error('Error in compliment command:', error);
        await conn.sendMessage(from, { 
            text: 'An error occurred while sending the compliment. Try again later!'
        });
    }
});

