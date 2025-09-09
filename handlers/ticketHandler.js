const { ChannelType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');
const config = require('../config.json');

async function closeTicket(channel, member, interaction) {
    let closedCategory = channel.guild.channels.cache.find(
        c => c.name === (config.CLOSED_TICKETS_CATEGORY || 'KAPALI TİCKETLER') && c.type === ChannelType.GuildCategory
    );
    
    if (!closedCategory) {
        closedCategory = await channel.guild.channels.create({
            name: config.CLOSED_TICKETS_CATEGORY || 'KAPALI TİCKETLER',
            type: ChannelType.GuildCategory
        });
    }
    
    await channel.setParent(closedCategory.id);
    await channel.permissionOverwrites.set([
        {
            id: channel.guild.id,
            deny: [PermissionFlagsBits.ViewChannel]
        },
        ...(config.SUPPORT_ROLE_ID ? [{
            id: config.SUPPORT_ROLE_ID,
            allow: [PermissionFlagsBits.ViewChannel]
        }] : [])
    ]);
    
    const closedEmbed = new EmbedBuilder()
        .setTitle('🔒 Ticket Kapatıldı')
        .setDescription(`Bu ticket ${member.user.tag} tarafından kapatıldı.`)
        .setColor('#ff0000')
        .setTimestamp();
    
    const messages = await channel.messages.fetch({ limit: 100 });
    const firstMessage = messages.last();
    if (firstMessage && firstMessage.components.length > 0) {
        await firstMessage.edit({ components: [] });
    }
    
    const actionRow = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('delete_ticket')
                .setLabel('🗑️ Sil')
                .setStyle(ButtonStyle.Danger)
        );
    
    if (interaction) {
        await interaction.reply({ embeds: [closedEmbed], components: [actionRow] });
    } else {
        await channel.send({ embeds: [closedEmbed], components: [actionRow] });
    }
    
    const newName = channel.name.replace('🎫', '🔒').replace('🔧', '🔒').replace('💻', '🔒').replace('📢', '🔒');
    await channel.setName(newName);
}

async function createTicketFromModal(interaction, ticketType, question, details) {
    const guild = interaction.guild;
    const member = interaction.member;
    
    const existingTicket = guild.channels.cache.find(
        ch => ch.name.includes(`ticket-${member.user.id}`)
    );
    
    if (existingTicket) {
        return interaction.reply({ 
            content: `❌ Zaten açık bir ticketınız var: ${existingTicket}`, 
            ephemeral: true 
        });
    }
    
    let openCategory = guild.channels.cache.find(
        c => c.name === config.OPEN_TICKETS_CATEGORY && c.type === ChannelType.GuildCategory
    );
    
    if (!openCategory) {
        openCategory = await guild.channels.create({
            name: config.OPEN_TICKETS_CATEGORY || 'AÇIK TİCKETLER',
            type: ChannelType.GuildCategory
        });
    }
    
    const ticketNumber = String(Date.now()).slice(-4);
    const supportRole = config.SUPPORT_ROLE_ID ? guild.roles.cache.get(config.SUPPORT_ROLE_ID) : null;
    
    const ticketChannel = await guild.channels.create({
        name: `${ticketType.emoji}-ticket-${ticketNumber}`,
        type: ChannelType.GuildText,
        parent: openCategory.id,
        topic: `Ticket sahibi: ${member.user.tag} | Tip: ${ticketType.name}`,
        permissionOverwrites: [
            {
                id: guild.id,
                deny: [PermissionFlagsBits.ViewChannel]
            },
            {
                id: member.id,
                allow: [
                    PermissionFlagsBits.ViewChannel,
                    PermissionFlagsBits.SendMessages,
                    PermissionFlagsBits.ReadMessageHistory
                ]
            },
            ...(supportRole ? [{
                id: supportRole.id,
                allow: [
                    PermissionFlagsBits.ViewChannel,
                    PermissionFlagsBits.SendMessages,
                    PermissionFlagsBits.ReadMessageHistory
                ]
            }] : [])
        ]
    });
    
    const welcomeEmbed = new EmbedBuilder()
        .setTitle(`${ticketType.emoji} Ticket Oluşturuldu`)
        .setDescription(`Merhaba ${member}!`)
        .addFields(
            { name: 'Ticket Türü', value: ticketType.name, inline: true },
            { name: 'Ticket #', value: ticketNumber, inline: true },
            { name: 'Oluşturan', value: member.user.tag, inline: true },
            { name: '❓ Sorun', value: question, inline: false }
        )
        .setColor(ticketType.color)
        .setFooter({ text: 'Ticket Bot System' })
        .setTimestamp();
    
    if (details) {
        welcomeEmbed.addFields({ name: '📝 Ek Detaylar', value: details, inline: false });
    }
    
    const actionRow = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('close_ticket')
                .setLabel('🔒 Ticketı Kapat')
                .setStyle(ButtonStyle.Danger)
        );
    
    await ticketChannel.send({ 
        content: `${member} ${supportRole ? `${supportRole}` : ''}`,
        embeds: [welcomeEmbed], 
        components: [actionRow] 
    });
    
    await interaction.reply({ 
        content: `✅ Ticket oluşturuldu: ${ticketChannel}`, 
        ephemeral: true 
    });
}

module.exports = {
    closeTicket,
    createTicketFromModal
};
