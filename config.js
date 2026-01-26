const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {
SESSION_ID: process.env.SESSION_ID || "BOSS-MD~eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiNE02ZzlmNnBTbFlxZ283T0MvclVjKzlRME50d0Exd3c3NFJtTVAxWmZFWT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiMFhIaUZhUG9paDA3eU5QWlNqajE2N1BsV0x1VDNxNzJJTVFSbFNoWmZoOD0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiIrQVdLUzU4YXdZbkdjZW1SY29XNjUvb01pdzN4ZDJhWStqejZvSFZESFY4PSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJHUGZzQXViUUJQZGozbkNjZmwyOXhXQlBCZUZUbTR3aThQWGxVbGI4RlI0PSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IlNOczB0Tnl1MHE4V1FkQ3ZYa2l0OWU5bTVHUlIwRmRsZ1J0cXd0K3ozM1E9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Ik8wbnNwVU1PKzFrMGxBY1Q5Z0VvL3lKSUEzY1A5T3VRZHZrMFB3RFo4QXc9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQUU0ZXZ0dmNhQUdzSlUyZXQ1dlBnWW1rUVRhYnh0NC9iTTFrdjlZdXhVND0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoickRjeEpSZ1lhNnJCeCtyVUlCS2FkSExKeHJha05KU08vVllINExOZW1nZz0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImVCNFBvb21VWEVCNlAvU0JkNkhKUzlFOTNOcXJkdlpqbDZMVlcyUzE4eVk2MnVrVXptUmNoaVNqRXExcnhWM1AxRHl5dmdrTGNyVTdZQ25GVnpzekJ3PT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MjE0LCJhZHZTZWNyZXRLZXkiOiJVaXNSaytsN2hndFkxRGhGSE1kcnJydmNOWVQ4RFIzem95TjNGQ2lxTVlnPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W3sia2V5Ijp7InJlbW90ZUppZCI6IjkyMzA3NjQxMTA5OUBzLndoYXRzYXBwLm5ldCIsImZyb21NZSI6dHJ1ZSwiaWQiOiJBQzk4Rjk3MzA2RkZEQzE3RTNBMEE1QzZGRTQ1QTQ5QSJ9LCJtZXNzYWdlVGltZXN0YW1wIjoxNzY5NDIwNTMxfSx7ImtleSI6eyJyZW1vdGVKaWQiOiI5MjMwNzY0MTEwOTlAcy53aGF0c2FwcC5uZXQiLCJmcm9tTWUiOnRydWUsImlkIjoiQUM0MjI3MTUzRDhFQjREMUVCMTkwOUM0MEU1QTdFQTEifSwibWVzc2FnZVRpbWVzdGFtcCI6MTc2OTQyMDUzMn0seyJrZXkiOnsicmVtb3RlSmlkIjoiOTIzMDc2NDExMDk5QHMud2hhdHNhcHAubmV0IiwiZnJvbU1lIjp0cnVlLCJpZCI6IkFDNzVBRkRFRDI1QkNERkVCMjhCMzkwNTlCOTQ2RTIyIn0sIm1lc3NhZ2VUaW1lc3RhbXAiOjE3Njk0MjA1MzJ9LHsia2V5Ijp7InJlbW90ZUppZCI6IjkyMzA3NjQxMTA5OUBzLndoYXRzYXBwLm5ldCIsImZyb21NZSI6dHJ1ZSwiaWQiOiJBQzI0RTVGRkNCNUJEODBERDJGRENBNjhDNTdBMjlDNyJ9LCJtZXNzYWdlVGltZXN0YW1wIjoxNzY5NDIwNTMzfSx7ImtleSI6eyJyZW1vdGVKaWQiOiI5MjMwNzY0MTEwOTlAcy53aGF0c2FwcC5uZXQiLCJmcm9tTWUiOnRydWUsImlkIjoiQUMwQTQ3M0FFMEU2NjlGRDI3RkI4RDI0MkM1NTk1OEYifSwibWVzc2FnZVRpbWVzdGFtcCI6MTc2OTQyMDU1M30seyJrZXkiOnsicmVtb3RlSmlkIjoiOTIzMDc2NDExMDk5QHMud2hhdHNhcHAubmV0IiwiZnJvbU1lIjp0cnVlLCJpZCI6IkFDRDg1QzFEREJCMzI2Qjc3MUMzNTc1OTNBNDVEQzNFIn0sIm1lc3NhZ2VUaW1lc3RhbXAiOjE3Njk0MjA1NjZ9LHsia2V5Ijp7InJlbW90ZUppZCI6IjkyMzA3NjQxMTA5OUBzLndoYXRzYXBwLm5ldCIsImZyb21NZSI6dHJ1ZSwiaWQiOiJBQ0U1RDBDOUI4N0M1MzZFRDI2NTdBMDIzMkRFQUUyOSJ9LCJtZXNzYWdlVGltZXN0YW1wIjoxNzY5NDIwNTk3fSx7ImtleSI6eyJyZW1vdGVKaWQiOiI5MjMwNzY0MTEwOTlAcy53aGF0c2FwcC5uZXQiLCJmcm9tTWUiOnRydWUsImlkIjoiQUNCRjM2Q0NFNDhGQTE0MUYyQjAwNDg3Q0EzN0I5M0YifSwibWVzc2FnZVRpbWVzdGFtcCI6MTc2OTQyMDYzNX1dLCJuZXh0UHJlS2V5SWQiOjE2MzAsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjoxNjMwLCJhY2NvdW50U3luY0NvdW50ZXIiOjMsImFjY291bnRTZXR0aW5ncyI6eyJ1bmFyY2hpdmVDaGF0cyI6ZmFsc2V9LCJyZWdpc3RlcmVkIjp0cnVlLCJwYWlyaW5nQ29kZSI6IllVUFJBREVWIiwibWUiOnsiaWQiOiI5MjMwNzY0MTEwOTk6MjdAcy53aGF0c2FwcC5uZXQiLCJsaWQiOiIxNjg0MTA1ODM0MDA2ODU6MjdAbGlkIiwibmFtZSI6IkJvc3MifSwiYWNjb3VudCI6eyJkZXRhaWxzIjoiQ0lEcGxMNEVFTi90M01zR0dBSWdBQ2dBIiwiYWNjb3VudFNpZ25hdHVyZUtleSI6IkJ2ZjFsNDhlU04xMWRsZnhRWWwxc2pjUHhCRjBaV1dDdWNFMTdaWnFFR0E9IiwiYWNjb3VudFNpZ25hdHVyZSI6Ilc2OCttYldOVFhvQ3diSzdLTXQ2a2xIdEkxNC9kcUxXTkNSQ1g2TEJSbVRWRXVBb01yVyt1N2RSMnF6cXJDdjZlTy9lTkZaVGJKY1JVc0pyQU1UK0RRPT0iLCJkZXZpY2VTaWduYXR1cmUiOiI1YnNoZEVlNXVoVWhEaW5aRlJrR1RYYVlIMGVXaDczUDBNR01aejlwU3dCTjZlVGdHejZiUjZmYnZRR0wvaDV6TFpIT1JIWFNvNWx3NjVCQ3JLWXZBdz09In0sInNpZ25hbElkZW50aXRpZXMiOlt7ImlkZW50aWZpZXIiOnsibmFtZSI6IjkyMzA3NjQxMTA5OToyN0BzLndoYXRzYXBwLm5ldCIsImRldmljZUlkIjowfSwiaWRlbnRpZmllcktleSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkJRYjM5WmVQSGtqZGRYWlg4VUdKZGJJM0Q4UVJkR1ZsZ3JuQk5lMldhaEJnIn19XSwicGxhdGZvcm0iOiJhbmRyb2lkIiwicm91dGluZ0luZm8iOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJDQTBJRWdnSSJ9LCJsYXN0QWNjb3VudFN5bmNUaW1lc3RhbXAiOjE3Njk0MjA1MjYsImxhc3RQcm9wSGFzaCI6IjNSOVozOSIsIm15QXBwU3RhdGVLZXlJZCI6IkFBQUFBTjAzIn0=",
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
BOT_NAME: process.env.BOT_NAME || "𝗕𝗼𝘀𝘀-𝗺𝗱",
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
OWNER_NUMBER: process.env.OWNER_NUMBER || "923266105873",
// add your bot owner number
OWNER_NAME: process.env.OWNER_NAME || "彡★🅱🅾🆂🆂-🅼🅳★彡",
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
