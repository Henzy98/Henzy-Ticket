const { isLicenseValid } = require('../utils/license');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        // License validation for all interactions
        if (!isLicenseValid()) {
            if (interaction.isCommand() || interaction.isButton() || interaction.isModalSubmit()) {
                await interaction.reply({ 
                    content: '❌ Bot lisansı geçersiz veya süresi dolmuş!', 
                    ephemeral: true 
                });
            }
            return;
        }

        // Command handling
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) {
                console.error(`❌ ${interaction.commandName} komutu bulunamadı.`);
                return;
            }

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error('❌ Komut çalıştırma hatası:', error);
                const reply = { 
                    content: '❌ Bu komut çalıştırılırken bir hata oluştu!', 
                    ephemeral: true 
                };
                
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp(reply);
                } else {
                    await interaction.reply(reply);
                }
            }
        }

        // Button handling
        if (interaction.isButton()) {
            const buttonHandlers = require('../handlers/buttonHandler');
            await buttonHandlers.handleButton(interaction);
        }

        // Modal handling
        if (interaction.isModalSubmit()) {
            const modalHandlers = require('../handlers/modalHandler');
            await modalHandlers.handleModal(interaction);
        }
    }
};
