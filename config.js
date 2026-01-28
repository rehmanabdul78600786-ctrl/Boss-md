const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {
SESSION_ID: process.env.SESSION_ID || "BOSS-MD~eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiR0grcC9kdnIrV21xdDFmTjM1STd2ZDVrZTBhV3RkWkNkMHdUMW1lRnZtRT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiTkh0Sy9zREJLMEhlTHRVNzJnVzFROCtTYnFXK1N2bEMycDZvdlRyWFlSRT0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJFTk5uWGNmMytoOXpFNmF3MXVSV2JwbE50MjkrcHU0NUJpTVBGVFVtQkVNPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJuQVFWb1JiMnNQZXJIRmUwWHVrNnVqSDNUeElHWFdnNHk0clRpSGZBc3drPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InVCOWtqazhPOVBOZGZOQnVZbjRiQXQzOU4zOEpycGpBVUtvckxoWGR1Rm89In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImczK0FOYlNmcDgzOUxUa3VKTVRyVnVraUU3UTJvNjQ1YU9sODNZU3p1VFU9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiT0N6WFNISVJMRnYrK0pZeW1UckNORlpiQXIvTEM4aCtDcVJVdXRUangwMD0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiL1Bhb2RvcEJ4dWFzMHJ3WkVJOVdyUndRZ0Z6d0hyYzRSLzQyRGNRMjVuaz0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Img3VituSlVDbzlwRUZpbXVXMlE1c1AvRlBpTnJtelBscG50dXdlcVRRdEluSFdFRDNvdlNFZWhwUlVxQ2pBbnZQWVM0bG8xQmcwVFQ3TVhSWmRTa0JRPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MjMyLCJhZHZTZWNyZXRLZXkiOiJ0TGh4dXNreFNHYzRqSThQSXpzejdqWWpHOVpxZ2RNV0JNZHFteGYwRU1NPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W3sia2V5Ijp7InJlbW90ZUppZCI6IjkyMzA3NjQxMTA5OUBzLndoYXRzYXBwLm5ldCIsImZyb21NZSI6dHJ1ZSwiaWQiOiJBQzI5MTEyNzI4QUE1NjRBMEEwNTg2RjU1MzVDNjhBNSJ9LCJtZXNzYWdlVGltZXN0YW1wIjoxNzY5NjMyOTcwfSx7ImtleSI6eyJyZW1vdGVKaWQiOiI5MjMwNzY0MTEwOTlAcy53aGF0c2FwcC5uZXQiLCJmcm9tTWUiOnRydWUsImlkIjoiQUM4QzVCMEIxRjBFNEU5OEU1RDZCRjMyQzE0MkI4RUIifSwibWVzc2FnZVRpbWVzdGFtcCI6MTc2OTYzMjk3MH1dLCJuZXh0UHJlS2V5SWQiOjgxMywiZmlyc3RVbnVwbG9hZGVkUHJlS2V5SWQiOjgxMywiYWNjb3VudFN5bmNDb3VudGVyIjowLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwicmVnaXN0ZXJlZCI6dHJ1ZSwicGFpcmluZ0NvZGUiOiJZVVBSQURFViIsIm1lIjp7ImlkIjoiOTIzMDc2NDExMDk5OjMzQHMud2hhdHNhcHAubmV0IiwibGlkIjoiMTY4NDEwNTgzNDAwNjg1OjMzQGxpZCJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDSUxwbEw0RUVMUHA2Y3NHR0FJZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoiQnZmMWw0OGVTTjExZGxmeFFZbDFzamNQeEJGMFpXV0N1Y0UxN1pacUVHQT0iLCJhY2NvdW50U2lnbmF0dXJlIjoiY3p6b0MvRkZUOWxmTUszWStJc2NjS1duRnh0a3dmdSswVkVVSkMzeFRRRHgvL2tzRzljemNtZmZRZlJaQVNqM0lHNDVRWmY1bE91cElMRVUrSFVURFE9PSIsImRldmljZVNpZ25hdHVyZSI6IjZwRWRGRk1UTVJCM0FkY2xscWJDenUzbmZEWlVCOUxlZWhpamRMTGxtb2RoNXpPcFBGRGEvalRPUkEyV0dQVEFUcG4yRWtvRFBDNEJSOStKRDcxd0R3PT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiOTIzMDc2NDExMDk5OjMzQHMud2hhdHNhcHAubmV0IiwiZGV2aWNlSWQiOjB9LCJpZGVudGlmaWVyS2V5Ijp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQlFiMzlaZVBIa2pkZFhaWDhVR0pkYkkzRDhRUmRHVmxncm5CTmUyV2FoQmcifX1dLCJwbGF0Zm9ybSI6ImFuZHJvaWQiLCJyb3V0aW5nSW5mbyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkNBMElFZ2dJIn0sImxhc3RBY2NvdW50U3luY1RpbWVzdGFtcCI6MTc2OTYzMjk2MywibGFzdFByb3BIYXNoIjoiM1I5WjM5IiwibXlBcHBTdGF0ZUtleUlkIjoiQUFBQUFMdVcifQ==",
// add your Session Id 
AUTO_STATUS_SEEN: process.env.AUTO_STATUS_SEEN || "true",
// make true or false status auto seen
AUTO_STATUS_REPLY: process.env.AUTO_STATUS_REPLY || "false",
// make true if you want auto reply on status 
AUTO_STATUS_REACT: process.env.AUTO_STATUS_REACT || "true",
// make true if you want auto reply on status 
AUTO_STATUS_MSG: process.env.AUTO_STATUS_MSG || "*SEEN YOUR STATUS BY 𝗕𝗼𝘀𝘀-𝗺𝗱 💔*",
// set the auto reply massage on status reply  
ANTI_DELETE: process.env.ANTI_DELETE || "false",
// set true false for anti delete     
ANTI_DEL_PATH: process.env.ANTI_DEL_PATH || "inbox", 
// change it to 'same' if you want to resend deleted message in same chat     
WELCOME: process.env.WELCOME || "false",
// true if want welcome and goodbye msg in groups    
ADMIN_EVENTS: process.env.ADMIN_EVENTS || "false",
// make true to know who dismiss or promoted a member in group
ANTI_LINK: process.env.ANTI_LINK || "true",
// make anti link true,false for groups 
MENTION_REPLY: process.env.MENTION_REPLY || "false",
// make true if want auto voice reply if someone menetion you 
MENU_IMAGE_URL: process.env.MENU_IMAGE_URL || "https://files.catbox.moe/aexas4.jpg",
// add custom menu and mention reply image url
PREFIX: process.env.PREFIX || ".",
// add your prifix for bot   
BOT_NAME: process.env.BOT_NAME || "🄱🄾🅂🅂-🄼🄳",
// add bot namw here for menu
AUTO_STATUS_REACT: process.env.AUTO_STATUS_REACT || "true",
// true to get auto status react
STICKER_NAME: process.env.STICKER_NAME || "ﮩ٨ـﮩﮩ٨ـ 𝑩𝑶𝑺𝑺ﮩ٨ـﮩﮩ٨ـ",
// type sticker pack name 
CUSTOM_REACT: process.env.CUSTOM_REACT || "false",
// make this true for custum emoji react    
CUSTOM_REACT_EMOJIS: process.env.CUSTOM_REACT_EMOJIS || "💝,💖,💗,❤️‍🩹,❤️,🧡,💛,💚,💙,💜,🤎,🖤,🤍",
// chose custom react emojis by yourself 
DELETE_LINKS: process.env.DELETE_LINKS || "false",
// automatic delete links witho remove member 
OWNER_NUMBER: process.env.OWNER_NUMBER || "923076411099",
// add your bot owner number
OWNER_NAME: process.env.OWNER_NAME || "𝘽𝙊𝙎𝙎-𝙈𝘿",
// add bot owner name
DESCRIPTION: process.env.DESCRIPTION || "*©ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝗕𝗼𝘀𝘀-𝗺𝗱*",
// add bot owner name    
ALIVE_IMG: process.env.ALIVE_IMG || "https://files.catbox.moe/aexas4.jpg",
// add img for alive msg
LIVE_MSG: process.env.LIVE_MSG || "> I'm alive*✿♡ 𝓑𝓸𝓼𝓼-𝓶𝓭 ♡✿*🇵🇰",
// add alive msg here 
READ_MESSAGE: process.env.READ_MESSAGE || "false",
// Turn true or false for automatic read msgs
AUTO_REACT: process.env.AUTO_REACT || "false",
// make this true or false for auto react on all msgs
ANTI_BAD: process.env.ANTI_BAD || "false",
// false or true for anti bad words  
MODE: process.env.MODE || "public",
// make bot public-private-inbox-group 
ANTI_LINK_KICK: process.env.ANTI_LINK_KICK || "false",
// make anti link true,false for groups 
AUTO_STICKER: process.env.AUTO_STICKER || "false",
// make true for automatic stickers 
AUTO_REPLY: process.env.AUTO_REPLY || "false",
// make true or false automatic text reply 
ALWAYS_ONLINE: process.env.ALWAYS_ONLINE || "false",
// maks true for always online 
PUBLIC_MODE: process.env.PUBLIC_MODE || "true",
// make false if want private mod
AUTO_TYPING: process.env.AUTO_TYPING || "false",
// true for automatic show typing   
READ_CMD: process.env.READ_CMD || "false",
// true if want mark commands as read 
DEV: process.env.DEV || "923487690170",
//replace with your whatsapp number        
ANTI_VV: process.env.ANTI_VV || "true",
// true for anti once view 
AUTO_RECORDING: process.env.AUTO_RECORDING || "false"
// make it true for auto recoding 
};
