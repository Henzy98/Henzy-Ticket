const crypto = require('crypto');

function generateHash(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
}

const coreData = {
    author: 'henzy988',
    version: '1.0.0',
    signature: 'HENZY_CORE_2025',
    url: 'https://lc-unah.onrender.com'
};

const expectedHash = generateHash(JSON.stringify(coreData));

const henzyCore = {
    author: coreData.author,
    version: coreData.version,
    signature: coreData.signature,
    
    validateIntegrity() {
        const currentHash = generateHash(JSON.stringify(coreData));
        if (currentHash !== expectedHash) {
            console.error('❌ HENZY CORE: Dosya bütünlüğü bozulmuş!');
            console.error('❌ HENZY CORE: Yetkisiz değişiklik tespit edildi!');
            process.exit(1);
        }
        return true;
    },
    
    getLicenseUrl() {
        this.validateIntegrity();
        return coreData.url;
    },
    
    getGuildInfo(client) {
        this.validateIntegrity();
        const guild = client.guilds.cache.first();
        if (!guild) return null;
        
        return {
            id: guild.id,
            name: guild.name,
            memberCount: guild.memberCount,
            owner: guild.ownerId,
            henzySignature: this.signature
        };
    },
    
    validateCore() {
        this.validateIntegrity();
        const expectedSignature = 'HENZY_CORE_2025';
        if (this.signature !== expectedSignature) {
            console.error('❌ HENZY CORE: Güvenlik imzası geçersiz!');
            process.exit(1);
        }
        return true;
    },
    
    getBotInfo() {
        this.validateIntegrity();
        return {
            name: 'Henzy Ticket Bot',
            author: this.author,
            core: 'HENZY_SYSTEM',
            protected: true
        };
    },
    
    getLicenseHeaders() {
        this.validateIntegrity();
        return {
            'User-Agent': 'HenzyBot/1.0',
            'X-Henzy-Core': this.signature,
            'Content-Type': 'application/json'
        };
    }
};

Object.freeze(henzyCore);
Object.freeze(coreData);

module.exports = { henzyCore };
