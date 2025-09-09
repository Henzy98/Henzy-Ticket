const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const { closeTicket } = require('./ticketHandler');

async function handleButton(interaction) {
    if (interaction.customId === 'open_ticket_modal') {
        const modal = new ModalBuilder()
            .setCustomId('ticket_form')
            .setTitle('📝 Ticket Formu');
        
        const reasonSelect = new TextInputBuilder()
            .setCustomId('ticket_reason')
            .setLabel('Sorun Türü (1: Genel, 2: Teknik, 3: Şikayet)')
            .setPlaceholder('Lütfen 1, 2 veya 3 yazın')
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setMinLength(1)
            .setMaxLength(1);
        
        const questionInput = new TextInputBuilder()
            .setCustomId('ticket_question')
            .setLabel('Sorununuz veya ihtiyacınız nedir?')
            .setPlaceholder('Sorununuzu detaylıca açıklayın...')
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true)
            .setMinLength(10)
            .setMaxLength(1000);
        
        const detailsInput = new TextInputBuilder()
            .setCustomId('ticket_details')
            .setLabel('Ek bilgiler (Opsiyonel)')
            .setPlaceholder('Varsa ek detaylar...')
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(false)
            .setMaxLength(500);
        
        const firstRow = new ActionRowBuilder().addComponents(reasonSelect);
        const secondRow = new ActionRowBuilder().addComponents(questionInput);
        const thirdRow = new ActionRowBuilder().addComponents(detailsInput);
        
        modal.addComponents(firstRow, secondRow, thirdRow);
        await interaction.showModal(modal);
    }
    
    if (interaction.customId === 'close_ticket') {
        if (!interaction.channel.name.includes('ticket')) {
            return interaction.reply({ 
                content: '❌ Bu buton sadece ticket kanallarında çalışır!', 
                ephemeral: true 
            });
        }
        
        await closeTicket(interaction.channel, interaction.member, interaction);
    }
    
    if (interaction.customId === 'delete_ticket') {
        await interaction.reply('🗑️ Ticket 5 saniye içinde silinecek...');
        setTimeout(async () => {
            await interaction.channel.delete();
        }, 5000);
    }
}

module.exports = {
    handleButton
};
