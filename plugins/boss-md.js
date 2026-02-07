// ==================== BOSS-MD AUTO MATRIX PLUGIN ====================
// 🔥 NO INDEX EDIT REQUIRED | AUTO-REGISTERS | MATRIX DIGITAL RAIN STYLE

const fs = require('fs');
const path = require('path');
const os = require('os');

// Auto-inject into global
if (!global.matrixPlugin) {
    global.matrixPlugin = {
        name: "MATRIX Digital Rain Auto",
        version: "3.1",
        active: true,
        style: "DIGITAL_RAIN"
    };
}

class MatrixBossPlugin {
    constructor() {
        this.name = "BOSS Auto Plugin";
        this.version = "3.1";
        this.author = "BOSS-MD";
        this.description = "Auto-detects BOSS and replies with Matrix style";
        this.triggers = ['boss', 'BOSS', 'Boss', 'مالك', 'مالک', 'owner', 'OWNER', 'صاحب', 'بوس'];
        
        console.log(`🌀 ${this.name} v${this.version} loaded successfully!`);
        
        // Auto-register with global handlers
        this.injectIntoSystem();
    }
    
    injectIntoSystem() {
        // Store original handler if exists
        if (typeof global.handleMessageUltra === 'function') {
            const originalHandler = global.handleMessageUltra;
            global.handleMessageUltra = async (message) => {
                // First check for matrix trigger
                const matrixResult = await this.checkAndReply(message);
                if (!matrixResult) {
                    // Call original handler if not handled by matrix
                    return originalHandler(message);
                }
            };
            console.log('✅ Matrix Plugin injected into message handler');
        } else {
            console.log('⚠️ Global handler not found, running in standalone mode');
        }
    }
    
    getMatrixChars() {
        return "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
    }
    
    generateMatrixLine() {
        const chars = this.getMatrixChars();
        let line = '';
        for (let i = 0; i < 35; i++) {
            line += chars[Math.floor(Math.random() * chars.length)];
        }
        return line;
    }
    
    getSystemInfo() {
        const memory = process.memoryUsage();
        const usedMB = Math.round(memory.heapUsed / 1024 / 1024);
        const uptime = process.uptime();
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const date = new Date();
        
        return {
            time: date.toLocaleTimeString('en-PK', { hour12: false }),
            date: date.toLocaleDateString('en-PK'),
            uptime: `${hours}h ${minutes}m`,
            memory: `${usedMB}MB`,
            platform: os.platform(),
            cpu: os.cpus().length
        };
    }
    
    async checkAndReply(message) {
        try {
            if (!message || !message.message || !message.key) return false;
            
            // Get message text
            let text = '';
            const msgType = Object.keys(message.message)[0];
            
            switch(msgType) {
                case 'conversation':
                    text = message.message.conversation || '';
                    break;
                case 'extendedTextMessage':
                    text = message.message.extendedTextMessage?.text || '';
                    break;
                case 'imageMessage':
                    text = message.message.imageMessage?.caption || '';
                    break;
                case 'videoMessage':
                    text = message.message.videoMessage?.caption || '';
                    break;
                default:
                    return false;
            }
            
            // Check triggers
            const hasTrigger = this.triggers.some(trigger => 
                text.toLowerCase().includes(trigger.toLowerCase())
            );
            
            if (hasTrigger) {
                const from = message.key.remoteJid;
                const sender = message.key.fromMe ? 'SYSTEM' : 
                             (message.key.participant || from);
                const userId = sender.split('@')[0];
                const name = message.pushName || 'User';
                
                const sysInfo = this.getSystemInfo();
                const line1 = this.generateMatrixLine();
                const line2 = this.generateMatrixLine();
                
                const matrixResponse = `
${line1}
   ▞▚▞▚▞▚▞▚▞▚▞▚▞▚▞▚▞▚▞▚
      BOSS  PROTOCOL v5.1
   ▚▞▚▞▚▞▚▞▚▞▚▞▚▞▚▞▚▞▚▞

> USER_IDENTIFIED: ${name.toUpperCase()}
> USER_ID: ${userId}
> TIME: ${sysInfo.time}
> DATE: ${sysInfo.date}
> UPTIME: ${sysInfo.uptime}
> MEMORY: ${sysInfo.memory}
> PLATFORM: ${sysInfo.platform.toUpperCase()}
> CPU_CORES: ${sysInfo.cpu}
> ACCESS: ROOT
> STATUS: VERIFIED ✅
> ENCRYPTION: AES-256

> WELCOME_TO: BOSS-MD NETWORK
> ALL SYSTEMS: OPERATIONAL

${line2}
▞▚▞▚▞▚▞▚▞▚▞▚▞▚▞▚▞▚▞▚▞▚▞
                `.trim();
                
                // Find conn from global
                if (global.conn && typeof global.conn.sendMessage === 'function') {
                    await global.conn.sendPresenceUpdate('composing', from);
                    
                    setTimeout(async () => {
                        await global.conn.sendMessage(from, {
                            text: matrixResponse,
                            contextInfo: {
                                mentionedJid: [sender]
                            }
                        }, { quoted: message });
                    }, 1000);
                }
                
                console.log(`🌀 Matrix response sent to ${name}`);
                return true;
            }
        } catch (error) {
            console.error('Matrix check error:', error.message);
        }
        return false;
    }
    
    // Commands for manual control
    getCommands() {
        return [
            {
                pattern: 'matrix',
                handler: async (message, conn) => {
                    const from = message.key.remoteJid;
                    const name = message.pushName || 'User';
                    const sysInfo = this.getSystemInfo();
                    
                    const response = `
▞▚▞▚ BOSS ACTIVATED ▚▞▚▞
> USER: ${name}
> TIME: ${sysInfo.time}
> STATUS: ACTIVE
> MODE: DIGITAL_RAIN
▚▞▚▞▚▞▚▞▚▞▚▞▚▞▚▞▚▞▚▞▚▞
                    `.trim();
                    
                    if (conn) {
                        await conn.sendMessage(from, { text: response }, { quoted: message });
                    }
                }
            },
            {
                pattern: 'sys',
                handler: async (message, conn) => {
                    const sysInfo = this.getSystemInfo();
                    const response = `
> SYSTEM DIAGNOSTICS
> UPTIME: ${sysInfo.uptime}
> MEMORY: ${sysInfo.memory}
> PLATFORM: ${sysInfo.platform}
> CORES: ${sysInfo.cpu}
> STATUS: OPTIMAL
                    `.trim();
                    
                    if (conn) {
                        await conn.sendMessage(message.key.remoteJid, { text: response }, { quoted: message });
                    }
                }
            }
        ];
    }
}

// Auto-initialize when loaded
const matrixPluginInstance = new MatrixBossPlugin();

// Export for module system
module.exports = matrixPluginInstance;

// Auto-attach to global message events
if (typeof global.handleIncomingMessage === 'undefined') {
    global.handleIncomingMessage = async (message) => {
        return await matrixPluginInstance.checkAndReply(message);
    };
    console.log('✅ Boss plugin attached to global handler');
}