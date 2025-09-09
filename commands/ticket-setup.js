const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket-setup')
        .setDescription('Ticket sistemini kurar (Admin yetkisi gerekli)'),
    
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({ 
                content: '❌ Bu komutu kullanmak için yönetici yetkisine sahip olmalısınız!', 
                ephemeral: true 
            });
        }

        const embed = new EmbedBuilder()
            .setTitle('🎫 Ticket Sistemi')
            .setDescription('Destek almak için aşağıdaki butona tıklayın ve formu doldurun.')
            .setColor('#00ff00')
            .setFooter({ text: 'Ticket Bot System' })
            .setTimestamp();

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('open_ticket_modal')
                    .setLabel('📩 Ticket Oluştur')
                    .setStyle(ButtonStyle.Primary)
            );

        await interaction.reply({ embeds: [embed], components: [row] });
    }
};
