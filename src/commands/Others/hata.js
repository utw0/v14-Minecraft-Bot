
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle,PermissionsBitField } = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders");
const moment = require("moment");
require("moment-duration-format");
moment.locale("tr");
const config = require("../../config");
 exports.commandBase = {
  prefixData: {
  name: "hata",
  aliases: ["hata"]
  },
  slashData: new SlashCommandBuilder()
  .setName("hata")
  .setDescription("Hata Bildirisi")
  .addStringOption(option =>
    option.setName('sunucu')
        .setDescription('Hatanın Olduğu Sunucu İsmi')
        .setRequired(true))
  .addStringOption(option =>
    option.setName('içerik')
        .setDescription('Hata İçeriği')
        .setRequired(true)),
  prefixRun: async (client, message, args) => {
  },
  slashRun: async (client, interaction) => {
    const sunucu = interaction.options.getString('sunucu');
    const içerik = interaction.options.getString('içerik');

    const HataEmbed = new EmbedBuilder()
    .setColor(0x00B2FF)
    .setTitle(`${sunucu}`)
    .setDescription(`**Hata :**\n\`\`\`${içerik}\`\`\``)
    .setTimestamp()
    .setFooter({ text: `Gönderen: ${interaction.user.tag}` })
    .setThumbnail(interaction.user.displayAvatarURL())
    .addFields(
        { name: 'Durum', value: '⏳ Beklemede ', inline: true },
        { name: 'Oylar', value: '👍 0 | 👎 0', inline: true }
    );
const row = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId(`accept_${interaction.user.id}`)
            .setLabel(`${config.ÖneriKabulButon}`)
            .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
            .setCustomId(`reject_${interaction.user.id}`)
            .setLabel(`${config.ÖneriRedButon}`)
            .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
            .setCustomId('upvote')
            .setLabel('👍')
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
            .setCustomId('downvote')
            .setLabel('👎')
            .setStyle(ButtonStyle.Primary)
    );
    interaction.reply({content:`Mesajınız Gönderildi`, ephemeral: true })
    interaction.guild.channels.cache.get(config.HataKanal).send({ embeds: [HataEmbed], components: [row] });
  }
  }