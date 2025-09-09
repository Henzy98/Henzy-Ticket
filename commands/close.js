const { SlashCommandBuilder } = require('discord.js');
const { closeTicket } = require('../handlers/ticketHandler');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('close')
        .setDescription('Açık ticketı kapatır'),
    
    async execute(interaction) {
        if (!interaction.channel.name.includes('ticket')) {
            return interaction.reply({ 
                content: '❌ Bu komut sadece ticket kanallarında kullanılabilir!', 
                ephemeral: true 
            });
        }

        await closeTicket(interaction.channel, interaction.member, interaction);
    }
};
