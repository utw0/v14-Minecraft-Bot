const {EmbedBuilder, PermissionFlagsBits, UserSelectMenuBuilder, ActionRowBuilder,Events} = require('discord.js');
const {createTranscript} = require('discord-html-transcripts');
const TicketSetup = require('../Database/ticketsetup');
const TicketSchema = require('../Database/ticket');
const config = require("../config");

module.exports = {
 name: Events.InteractionCreate,

 execute: async(interaction, client) => {
    const {guild, member, customId, channel } = interaction;
    const {ManageChannels, SendMessages} = PermissionFlagsBits;
    if(!['ticket-manage-menu'].includes(customId)) return;
    await interaction.deferUpdate();
    await interaction.deleteReply();
    const embed = new EmbedBuilder()
    const data = await TicketSchema.findOne({GuildID: guild.id, ChannelID: channel.id});
    if (!data) return interaction.reply({embeds: [embed.setColor('Red').setDescription(config.ticketError)], ephemeral: true}).catch(error => {return});
    const findMembers = await TicketSchema.findOne({GuildID: guild.id, ChannelID: channel.id, MembersID: interaction.values[0]});
    if(!findMembers) {
        data.MembersID.push(interaction.values[0]);
        channel.permissionOverwrites.edit(interaction.values[0], {
            SendMessages: true,
            ViewChannel: true,
            ReadMessageHistory: true
        }).catch(error => {return});
        interaction.channel.send({embeds: [embed.setColor('Green').setDescription('<@' + interaction.values[0] + '>' + ' ' + config.ticketMemberAdd)]}).catch(error => {return});
        data.save();
    }else {
        data.MembersID.remove(interaction.values[0]);
        channel.permissionOverwrites.delete(interaction.values[0]).catch(error => {return});
        interaction.channel.send({embeds: [embed.setColor('Green').setDescription('<@' + interaction.values[0] + '>' + ' ' + config.ticketMemberRemove)]}).catch(error => {return});
        data.save();
    }
}
}
