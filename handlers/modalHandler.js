const { createTicketFromModal } = require('./ticketHandler');

async function handleModal(interaction) {
    if (interaction.customId === 'ticket_form') {
        const reasonCode = interaction.fields.getTextInputValue('ticket_reason');
        const question = interaction.fields.getTextInputValue('ticket_question');
        const details = interaction.fields.getTextInputValue('ticket_details');
        
        const typeMap = {
            '1': { name: 'Genel Destek', emoji: '🔧', color: '#00ff00' },
            '2': { name: 'Teknik Destek', emoji: '💻', color: '#ff8800' },
            '3': { name: 'Şikayet', emoji: '📢', color: '#ff0000' }
        };
        
        const ticketType = typeMap[reasonCode];
        
        if (!ticketType) {
            return interaction.reply({
                content: '❌ Geçersiz sorun türü! Lütfen 1, 2 veya 3 yazın.',
                ephemeral: true
            });
        }
        
        await createTicketFromModal(interaction, ticketType, question, details);
    }
}

module.exports = {
    handleModal
};
