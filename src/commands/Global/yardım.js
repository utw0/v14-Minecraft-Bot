const { EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const config = require("../../config");

exports.commandBase = {
  prefixData: {
    name: "help",
    aliases: ["help"]
  },
  slashData: new SlashCommandBuilder()
    .setName("help")
    .setDescription("yardım komutu"),
  
  prefixRun: async (client, message, args) => {
    
  },
  
  slashRun: async (client, interaction) => {
    const embed = new EmbedBuilder()
    .setDescription(`**luhux** tarafından \`${interaction.guild.name}\` sunucusuna yapılmış botun komutları aşağıda verilmiştir.`)
    .addFields(
        { name: "Global", value: `\`/avatar\`\n\`/profil\`\n\`/sıralama\``, inline: false },
        { name: "Moderasyon", value: `\`/ban\`\n\`/mute\`\n\`/sicil\`\n\`/sil\`\n\`/unban\`\n\`/url\`\n\`/uyarı\`\n\`/uyarılar\``, inline: false },
        { name: 'Others', value: '\`/çekiliş\`\n\`/hata\`\n\`/ticket\`' },
    )
    interaction.reply({embeds:[embed]})
  }
};
