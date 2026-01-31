const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {
SESSION_ID: process.env.SESSION_ID || "BOSS-MD~eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiVUtJSmJ6dTlUK1lIUE1YLy8yaW4yMEJ3elZPTSt3eHdIZm9Kc0Y1blMzWT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiemVpOVVhU1ROOFVuNm9vVzNlY2gwREFEbnUwUFNJU0JBYXZ6SS9SaG9IMD0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJhRmNKaDhXajdXdnRuUHpDMVlHZ0hBbTJwQmhsVmRtMmpzemRWTlVVS1V3PSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJtTDN0d0tHa0NVWk9QVGNiTEVJcGFDVS9xdTdqOVhvV3BwM3VUMm54UlNzPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IitFby9lcFVaZytFT2hGdEx6NDJpczNoYjdKMHJlYVZ4N2RhTFIwOU9PMlk9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InZIU0p0MEZuTTdob05uNy9HTkZmckQ5czlnY1VTTHNYS0I4M1NmZ3RLUnM9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiV0pnREFzQjExd2VIR3RMSzJKOWl6RkVoMWdkM3YvMDgzL1VFUXVMZHNYWT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiNlVDMnNsWTF1L0lMN1dtRW5nR2VjR0lLU0FIVHkwUERjNWJpOHNRblZ6ND0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InIzMkNRSVF3YUo3UWdrTmtjOEhsUnlJMmpPeVcyMjRjT05DQlZBK1FTMmpNYzlqRWZOZjJsMEIzNUx6MkxpTzdUKzVuYkRGY3F5Ym1LQk9ZREkrVmp3PT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MTY0LCJhZHZTZWNyZXRLZXkiOiI3cUEyUndaOUlYTVptcXgrTnJMWTBSeFlrNTVOZUhJRjU3WVRNNFVwdjlFPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W3sia2V5Ijp7InJlbW90ZUppZCI6IjkyMzA3NjQxMTA5OUBzLndoYXRzYXBwLm5ldCIsImZyb21NZSI6dHJ1ZSwiaWQiOiJBQzVFNkZEMzc1NzkyRjcxNzE1ODk4RDRGMzBDMEFDRSJ9LCJtZXNzYWdlVGltZXN0YW1wIjoxNzY5Nzc2NTgzfSx7ImtleSI6eyJyZW1vdGVKaWQiOiI5MjMwNzY0MTEwOTlAcy53aGF0c2FwcC5uZXQiLCJmcm9tTWUiOnRydWUsImlkIjoiQUNDMTE4NEFBOTU0NzJBQUY2MDEzNDdFREFENEYwMUYifSwibWVzc2FnZVRpbWVzdGFtcCI6MTc2OTc3NjU4NH0seyJrZXkiOnsicmVtb3RlSmlkIjoiOTIzMDc2NDExMDk5QHMud2hhdHNhcHAubmV0IiwiZnJvbU1lIjp0cnVlLCJpZCI6IkFDNkI2NDg4MTMxNzg4RTE5QUQ1QjIyMjc0QkNGMzI0In0sIm1lc3NhZ2VUaW1lc3RhbXAiOjE3Njk3NzY1ODR9XSwibmV4dFByZUtleUlkIjo4MTMsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjo4MTMsImFjY291bnRTeW5jQ291bnRlciI6MCwiYWNjb3VudFNldHRpbmdzIjp7InVuYXJjaGl2ZUNoYXRzIjpmYWxzZX0sInJlZ2lzdGVyZWQiOnRydWUsInBhaXJpbmdDb2RlIjoiWVVQUkFERVYiLCJtZSI6eyJpZCI6IjkyMzA3NjQxMTA5OTozNUBzLndoYXRzYXBwLm5ldCIsImxpZCI6IjE2ODQxMDU4MzQwMDY4NTozNUBsaWQifSwiYWNjb3VudCI6eyJkZXRhaWxzIjoiQ0lMcGxMNEVFTFhMOHNzR0dBUWdBQ2dBIiwiYWNjb3VudFNpZ25hdHVyZUtleSI6IkJ2ZjFsNDhlU04xMWRsZnhRWWwxc2pjUHhCRjBaV1dDdWNFMTdaWnFFR0E9IiwiYWNjb3VudFNpZ25hdHVyZSI6IlNOTDlBa1h2eElScU92TDZoZDQyVDQyS2ZWZ240eXhhcHdFYnhUa0EzdVhlMGxWZmVRVmQvbjd3SXdFV2ZFbDlFd3pTVjlsUGJyUTlmeU12N003dUNBPT0iLCJkZXZpY2VTaWduYXR1cmUiOiI0ck1xT1o2aUZGVmFsOHNLc1R5REsxbFBNQjdMRTMvYjJLMjRTQnZzdHc1dDVCamxCc0RteE9EWThHZnBML2gyZklpV1h3MlliU1V4ZDJJUzFWYzhnQT09In0sInNpZ25hbElkZW50aXRpZXMiOlt7ImlkZW50aWZpZXIiOnsibmFtZSI6IjkyMzA3NjQxMTA5OTozNUBzLndoYXRzYXBwLm5ldCIsImRldmljZUlkIjowfSwiaWRlbnRpZmllcktleSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkJRYjM5WmVQSGtqZGRYWlg4VUdKZGJJM0Q4UVJkR1ZsZ3JuQk5lMldhaEJnIn19XSwicGxhdGZvcm0iOiJhbmRyb2lkIiwicm91dGluZ0luZm8iOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJDQTBJRWdnSSJ9LCJsYXN0QWNjb3VudFN5bmNUaW1lc3RhbXAiOjE3Njk3NzY1NzksImxhc3RQcm9wSGFzaCI6IjNSOVozOSIsIm15QXBwU3RhdGVLZXlJZCI6IkFBQUFBTHVYIn0=",
// add your Session Id 
AUTO_STATUS_SEEN: process.env.AUTO_STATUS_SEEN || "true",
// make true or false status auto seen
AUTO_STATUS_REPLY: process.env.AUTO_STATUS_REPLY || "false",
// make true if you want auto reply on status 
AUTO_STATUS_REACT: process.env.AUTO_STATUS_REACT || "true",
// make true if you want auto reply on status 
AUTO_STATUS_MSG: process.env.AUTO_STATUS_MSG || "*SEEN YOUR STATUS BY 𝗕𝗼𝘀𝘀-𝗺𝗱 💔*",
// set the auto reply massage on status reply  
ANTI_DELETE: process.env.ANTI_DELETE || "true",
// set true false for anti delete     
ANTI_DEL_PATH: process.env.ANTI_DEL_PATH || "inbox", 
// change it to 'same' if you want to resend deleted message in same chat     
WELCOME: process.env.WELCOME || "true",
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
