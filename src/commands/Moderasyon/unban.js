const { SlashCommandBuilder } = require("@discordjs/builders");
const { PermissionsBitField } = require("discord.js");
const config = require("../../config");

exports.commandBase = {
    prefixData: {
    name: "unban",
    aliases: ["unban"]
    },
    slashData: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Belirtilen kullanıcının banını kaldırır")
    .addStringOption(option =>
      option.setName('user')
          .setDescription('Banı kaldırılacak kullanıcının ID\'si')
          .setRequired(true))
    .addStringOption(option =>
      option.setName('sebep')
          .setDescription('Ban kaldırma sebebini belirtin')
          .setRequired(true)),
    prefixRun: async (client, message, args) => {
    },
    slashRun: async (client, interaction) => {
    if ([PermissionsBitField.Flags.Administrator].some(x => interaction.member.permissions.has(x)) ||
        [...config.BanRoller].some(x => interaction.member.roles.cache.has(x))) {

      const userId = interaction.options.getString('user');
      const reason = interaction.options.getString('sebep') || "Belirtilmedi!";

      try {
        const bans = await interaction.guild.bans.fetch();
        if (!bans.some(ban => ban.user.id === userId)) {
          return interaction.reply({ content: "Belirtilen kullanıcı banlı değil!", ephemeral: true });
        }

        await interaction.guild.bans.remove(userId, reason);

        await interaction.reply({ content: `${userId} ID'li kullanıcının banı kaldırıldı! Sebep: ${reason}`, ephemeral: true });
      } catch (error) {
        console.error(error);
        await interaction.reply({ content: "Ban kaldırma işlemi sırasında bir hata oluştu.", ephemeral: true });
      }
    } else {
      return interaction.reply({ content: "Üzgünüm..., Bu komutu kullanamazsın!", ephemeral: true });
    }
  }
}
