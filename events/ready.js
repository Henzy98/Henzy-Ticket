const { startLicenseCheck } = require('../utils/license');
const config = require('../config.json');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        client.henzy.validateCore();
        
        console.log(`🎫 ${client.henzy.getBotInfo().name} başlatıldı: ${client.user.tag}`);
        
        const guildInfo = client.henzy.getGuildInfo(client);
        if (guildInfo) {
            console.log(`✅ HENZY: Sunucu bulundu: ${guildInfo.name} (${guildInfo.memberCount} üye)`);
            console.log(`🔐 HENZY: Güvenlik imzası aktif: ${guildInfo.henzySignature}`);
        }
        
        startLicenseCheck(client, config.LICENSE_KEY, config.LICENSE_SERVER_URL);
        
        const commands = [];
        client.commands.forEach(command => {
            commands.push(command.data.toJSON());
        });
        
        try {
            if (config.GUILD_ID) {
                const guild = client.guilds.cache.get(config.GUILD_ID);
                if (guild) {
                    await guild.commands.set(commands);
                    console.log('✅ HENZY: Sunucu komutları yüklendi!');
                } else {
                    console.error('❌ HENZY: Belirtilen sunucu bulunamadı!');
                }
            } else {
                await client.application.commands.set(commands);
                console.log('✅ HENZY: Global komutlar yüklendi!');
            }
        } catch (error) {
            console.error('❌ HENZY: Komut yükleme hatası:', error);
        }
        
        client.user.setActivity('Ticket Bot Sistemi', { type: 'WATCHING' });
    }
};
