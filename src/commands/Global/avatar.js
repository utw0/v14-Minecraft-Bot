const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const uyarisayi = require("../../Database/warn")
const moment = require("moment");
require("moment-duration-format");
moment.locale("tr");
const config = require("../../config");
 exports.commandBase = {
  prefixData: {
  name: "avatar",
  aliases: ["avatar"]
  },
  slashData: new SlashCommandBuilder()
  .setName("avatar")
  .setDescription("Bir kullanıcının avatarını görüntüler.")
  .addUserOption(option =>
    option.setName('user')
        .setDescription('Avatar görüntülemek için kullanıcı.')
        .setRequired(false)),
  prefixRun: async (client, message, args) => {
  },
  slashRun: async (client, interaction) => {
    const user =  interaction.options.getUser("user") || interaction.user;
        const userAvatar = user.displayAvatarURL({
            format: "png",
            dynamic: true,
            size: 1024
        });


    const embed = new EmbedBuilder()
        .setColor("#C28F2C")
        .setImage(userAvatar)
        .setTimestamp()
    await interaction.reply({ embeds: [embed] });
    
  }
  }