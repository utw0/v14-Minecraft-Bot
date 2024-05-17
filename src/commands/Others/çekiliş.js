
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle,PermissionsBitField } = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders");
const moment = require("moment");
const ms = require("ms")
const { giveawaysManager } = require('vante-giveaways');
require("moment-duration-format");
moment.locale("tr");
const config = require("../../config");
 exports.commandBase = {
  prefixData: {
  name: "çekiliş",
  aliases: ["çekiliş"]
  },
  slashData: new SlashCommandBuilder()
  .setName("çekiliş")
  .setDescription("Çekiliş başlatma komutu")
  .addStringOption(option =>
    option.setName('süre')
        .setDescription('Geçerli bir süre girin (1m/1h)')
        .setRequired(true))
  .addStringOption(option =>
    option.setName('kazanan')
        .setDescription('Kazanan sayısını belirtmelisin.')
        .setRequired(true))
        .addStringOption(option =>
            option.setName('ödül')
                .setDescription('Ödülü belirtmelisin.')
                .setRequired(true)),
  prefixRun: async (client, message, args) => {
  },
  slashRun: async (client, interaction) => {
    if( [PermissionsBitField.Flags.Administrator, PermissionsBitField.Flags.ManageRoles, PermissionsBitField.Flags.BanMembers, PermissionsBitField.Flags.KickMembers].some(x => interaction.member.permissions.has(x))) {
    const duration = interaction.options.getString('süre');
    let süre = ms(duration)
    const winners = interaction.options.getString('kazanan');
    const prize = interaction.options.getString('ödül');
    client.giveawaysManager.start(interaction.channel, {
        duration: süre,
        winnerCount: parseInt(winners),
        prize: prize,
        messages: {
            giveaway: '🎉🎉 **ÇEKİLİŞ** 🎉🎉',
            giveawayEnded: '🎉🎉 **ÇEKİLİŞ BİTTİ** 🎉🎉',
            giveawayEndedButton: 'Çekilişe git.',
            title: '{this.prize}',
            inviteToParticipate: 'Katılmak için 🎉 tıklayın!',
            winMessage: 'Tebrikler, {winners}! **{this.prize}** kazandın!',
            drawing: 'Süre: {timestamp-relative} ({timestamp-default})',
            dropMessage: 'İlk katılan sen ol!',
            embedFooter: '{this.winnerCount} kazanan',
            noWinner: 'Kimse katılmadığı için çekiliş iptal edildi.',
            winners: 'Kazanan:',
            endedAt: 'Bitecek',
            hostedBy: 'Başlatan: {this.hostedBy}',
            participants: 'Katılımcı Sayısı {participants}\nSon Katılan Üye: {member}',
        }
    })
    interaction.reply({content:"Çekiliş Başlatıldı", ephemeral: true})
} else return interaction.reply({ content: "Üzgünüm..., Bu komutu kullanamazsın!", ephemeral: true });
  }
  
  }