const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {
SESSION_ID: process.env.SESSION_ID || "BOSS-MD~eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiS1BnaSszZHVUdTlJbmZpTURnYkV6TWNYQnl3bTMySjg3R0lvUEp1d0IxVT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQ3YxbTVGZ2lnRCtEUUVLY1F2Um9MVmRIMksyOGxQRGJ1MkZkYnRpdzlpND0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJ5TGo0MHcvdnFFQ0dFWWttQ3Jta05yTkcrUkNrdHZneU4xMUNwZ1dYZldFPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJHNmxaVjgxZTNpRjFmR1E4UFh0Z25Pdm52QlV3eVdNekRwMk5TcXhJWkNrPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImdPVlRlUy9EWE04SG53VFBwcG1FRnZLaWthMldSQVlsVStuOHRXWW8va0U9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkFKYjhRaTF3cllpaS8yUjdmRkFDbVViWnMxR0Y0RG1KWXk2N05CaWFvV0U9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiOEtjemxnTUFxMDZVZmlHOW1LZDVOTUphazR3T0dZT1lJblZrOTJBNjgyVT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiVms2NEhadFlmODcyWmQ4aU00OE1hRStaNEhuY0xXWnpvVHlnVGh2bWl3Yz0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImhrSTFTcVZORklNdWgrekpUNXNnZ0pNNTR2d09UeUNuZGRYdVJKOVI4aEdERGlPRVgybC80bDF5SHEzSXh2bm9hS21xbjdUK2JxakJjSDJpcWUyZUJBPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6NjgsImFkdlNlY3JldEtleSI6Im9FYTNTWVQwcjBuUVIwUGhFeThwQzNuK0RuVWtpSy9iaklCZ2pqcUR5Rkk9IiwicHJvY2Vzc2VkSGlzdG9yeU1lc3NhZ2VzIjpbeyJrZXkiOnsicmVtb3RlSmlkIjoiOTIzMDc2NDExMDk5QHMud2hhdHNhcHAubmV0IiwiZnJvbU1lIjp0cnVlLCJpZCI6IkFDOUY2RjlGMzQ4Mzk2Mjg2QjdDREZENTQyQzMyNjlDIn0sIm1lc3NhZ2VUaW1lc3RhbXAiOjE3Njk1NDM5MTV9LHsia2V5Ijp7InJlbW90ZUppZCI6IjkyMzA3NjQxMTA5OUBzLndoYXRzYXBwLm5ldCIsImZyb21NZSI6dHJ1ZSwiaWQiOiJBQzZCREZGOUI4OEQwMTVDNEJBRDIyREYwMTRFNjExQiJ9LCJtZXNzYWdlVGltZXN0YW1wIjoxNzY5NTQzOTE1fSx7ImtleSI6eyJyZW1vdGVKaWQiOiI5MjMwNzY0MTEwOTlAcy53aGF0c2FwcC5uZXQiLCJmcm9tTWUiOnRydWUsImlkIjoiQUNCMEZEMEYxMTlCNTcyMUJDMjJGMDhCOUZDNUU3RDYifSwibWVzc2FnZVRpbWVzdGFtcCI6MTc2OTU0MzkxN30seyJrZXkiOnsicmVtb3RlSmlkIjoiOTIzMDc2NDExMDk5QHMud2hhdHNhcHAubmV0IiwiZnJvbU1lIjp0cnVlLCJpZCI6IkFDMUMxREQzNTVBMkExRjM3RTJFQzJDOUVBM0M5MTUyIn0sIm1lc3NhZ2VUaW1lc3RhbXAiOjE3Njk1NDM5MTh9XSwibmV4dFByZUtleUlkIjo4MTMsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjo4MTMsImFjY291bnRTeW5jQ291bnRlciI6MCwiYWNjb3VudFNldHRpbmdzIjp7InVuYXJjaGl2ZUNoYXRzIjpmYWxzZX0sInJlZ2lzdGVyZWQiOnRydWUsInBhaXJpbmdDb2RlIjoiWVVQUkFERVYiLCJtZSI6eyJpZCI6IjkyMzA3NjQxMTA5OToyOUBzLndoYXRzYXBwLm5ldCIsImxpZCI6IjE2ODQxMDU4MzQwMDY4NToyOUBsaWQifSwiYWNjb3VudCI6eyJkZXRhaWxzIjoiQ0lIcGxMNEVFTnF4NU1zR0dBSWdBQ2dBIiwiYWNjb3VudFNpZ25hdHVyZUtleSI6IkJ2ZjFsNDhlU04xMWRsZnhRWWwxc2pjUHhCRjBaV1dDdWNFMTdaWnFFR0E9IiwiYWNjb3VudFNpZ25hdHVyZSI6InpkS0ZUZUZxcURVcERYbjBndytZOFlYbFhZWldLZytTUVpQOWFFVVM1ZitZVWV3cXg5SEsxSkJhL0dYMkZjd005c0dRUlNJMzlHeWRNWGt1Z1ZPdERnPT0iLCJkZXZpY2VTaWduYXR1cmUiOiIvNHVyZERXeG8xUm1PQVVrMmxkemRLcjZTcWhYamxiYnRPT2FKcGZITlhlbzJ1WXh5QkpodkorWmxPR2l5YXUrQ3lVRGdXMGVqZkcySk9LQm5mYWpEZz09In0sInNpZ25hbElkZW50aXRpZXMiOlt7ImlkZW50aWZpZXIiOnsibmFtZSI6IjkyMzA3NjQxMTA5OToyOUBzLndoYXRzYXBwLm5ldCIsImRldmljZUlkIjowfSwiaWRlbnRpZmllcktleSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkJRYjM5WmVQSGtqZGRYWlg4VUdKZGJJM0Q4UVJkR1ZsZ3JuQk5lMldhaEJnIn19XSwicGxhdGZvcm0iOiJhbmRyb2lkIiwicm91dGluZ0luZm8iOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJDQTBJRWdnSSJ9LCJsYXN0QWNjb3VudFN5bmNUaW1lc3RhbXAiOjE3Njk1NDM5MTEsImxhc3RQcm9wSGFzaCI6IjNSOVozOSIsIm15QXBwU3RhdGVLZXlJZCI6IkFBQUFBR1g4In0=",
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
