const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('./config.json');
const { verifyLicense, checkLicensePeriodically } = require('./utils/license');
const { henzyCore } = require('./core/henzy');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

client.henzy = henzyCore;
client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    }
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

async function startBot() {
    const henzyUrl = client.henzy.getLicenseUrl();
    if (config.LICENSE_SERVER_URL !== henzyUrl) {
        console.error('❌ HENZY CORE: Lisans sunucu URL\'si değiştirilmiş!');
        console.error('❌ Beklenen: ' + henzyUrl);
        console.error('❌ Bulunan: ' + config.LICENSE_SERVER_URL);
        console.error('❌ Bot güvenlik nedeniyle başlatılamıyor...');
        process.exit(1);
    }

    if (!config.DISCORD_TOKEN) {
        console.error('❌ Discord token bulunamadı! config.json dosyasını kontrol edin.');
        process.exit(1);
    }

    if (!config.LICENSE_KEY) {
        console.error('❌ Lisans anahtarı bulunamadı! config.json dosyasını kontrol edin.');
        process.exit(1);
    }

    const isValid = await verifyLicense(config.LICENSE_KEY, config.LICENSE_SERVER_URL);
    if (!isValid) {
        console.log('❌ Geçerli lisans bulunamadı. Bot kapatılıyor...');
        process.exit(1);
    }

    try {
        await client.login(config.DISCORD_TOKEN);
    } catch (error) {
        console.error('❌ Bot başlatılamadı:', error);
        
        if (error.message.includes('Used disallowed intents')) {
            console.error('\n⚠️ ÖNEMLİ: Discord Developer Portal\'dan Intent\'leri açmanız gerekiyor!');
            console.error('📌 Çözüm:');
            console.error('1. https://discord.com/developers/applications adresine gidin');
            console.error('2. Botunuzu seçin');
            console.error('3. Sol menüden "Bot" sekmesine tıklayın');
            console.error('4. "Privileged Gateway Intents" bölümünde şunları açın:');
            console.error('   ✅ MESSAGE CONTENT INTENT');
            console.error('   ✅ SERVER MEMBERS INTENT');
            console.error('5. Değişiklikleri kaydedin ve botu tekrar başlatın\n');
        }
        
        process.exit(1);
    }
}

startBot();
