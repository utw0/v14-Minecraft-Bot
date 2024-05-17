const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Config = require("../../config")
 exports.commandBase = {
  prefixData: {
  name: "sil",
  aliases: ["sil"]
  },
  slashData: new SlashCommandBuilder()
    .setName("sil")
    .setDescription("Belirtiğiniz kadar mesaj siler")
    .addStringOption(option =>
      option.setName('mıktar')
          .setDescription('Silincek Miktarı Giriniz')
          .setRequired(true)),

  prefixRun: async (client, message, args) => {
  },
  slashRun: async (client, interaction) => {
    if( [PermissionsBitField.Flags.Administrator,PermissionsBitField.Flags.ManageRoles,PermissionsBitField.Flags.BanMembers,PermissionsBitField.Flags.KickMembers,].some(x=> interaction.member.permissions.has(x))
    ||
    [...Config.WarnRoller].some(x=> interaction.member.roles.cache.has(x))){
    const input = interaction.options.getString('mıktar');
    const deleteCount = parseInt(input, 10);
    if (isNaN(deleteCount) || deleteCount < 1 || deleteCount > 100) {
      return interaction.reply({ content: "Lütfen 1 ile 100 arasında bir sayı belirtin.", ephemeral: true });
    }
    const SilincekMesaj = await interaction.channel.messages.fetch({ limit: deleteCount });
    interaction.reply({ content: `**${deleteCount}** Adet Mesaj Silindi`, ephemeral: true });
    await interaction.channel.bulkDelete(SilincekMesaj, true)
      .catch(error => {
        interaction.reply({ content: "Mesajları silerken bir hata oluştu.", ephemeral: true });
      });
    } else return interaction.reply({ content: "Üzgünüm..., Bu komutu kullanamazsın!", ephemeral: true })
  }
}

