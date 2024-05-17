const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const uyarisayi = require("../../Database/warn")
const moment = require("moment");
require("moment-duration-format");
moment.locale("tr");
const config = require("../../config");
 exports.commandBase = {
  prefixData: {
  name: "uyarı",
  aliases: ["warn"]
  },
  slashData: new SlashCommandBuilder()
  .setName("warn")
  .setDescription("ID'si girilen kullanıcıyı uyarır")
  .addUserOption(option =>
    option.setName('user')
        .setDescription('Uyarılacak kullanıcıyı belirtin')
        .setRequired(true))
  .addStringOption(option =>
    option.setName('sebep')
        .setDescription('Uyarı sebebini belirtin')
        .setRequired(true)),
  prefixRun: async (client, message, args) => {
  },
  slashRun: async (client, interaction) => {
    if( [PermissionsBitField.Flags.Administrator, PermissionsBitField.Flags.ManageRoles, PermissionsBitField.Flags.BanMembers, PermissionsBitField.Flags.KickMembers].some(x => interaction.member.permissions.has(x)) ||
        [...config.WarnRoller].some(x => interaction.member.roles.cache.has(x))) {
  
      const user = interaction.options.getUser('user');
      const reason = interaction.options.getString('sebep') || "Belirtilmedi!";
      const member = await interaction.guild.members.fetch(user.id);
  
      if (member.bot) return interaction.reply({ content: "Botlar üstünde işlem yapılamaz", ephemeral: true });
      if (!member.manageable) return interaction.reply({ content: "Yetersiz yetki !", ephemeral: true });
      if (member.roles.highest.position >= interaction.guild.members.cache.get(interaction.user.id).roles.highest.position && !client.owners.includes(interaction.user.id)) return interaction.reply({ content: "kendinden Üst/Aynı yetkide ki kullanıcılar veya bot sahipleri üstünde işlem yapılamaz", ephemeral: true });
  
      let uyariData = await uyarisayi.findOne({ guildID: interaction.guild.id, userID: member.id });
  
      if (uyariData) {
        const newReason = { reason: reason, by: interaction.user.id };
        uyariData.reasons.push(newReason);
        uyariData.sayi += 1;
        await uyarisayi.findOneAndUpdate(
          { guildID: interaction.guild.id, userID: member.id },
          uyariData
        );
      } else {
        const newUyariData = {
          guildID: interaction.guild.id,
          userID: member.id,
          sayi: 1,
          reasons: [{ reason: reason, by: interaction.user.id}]
        };
      
        await uyarisayi.create(newUyariData);
      }
  
      interaction.reply({
        content: `${member.toString()} üyesi, **${interaction.user.tag}** tarafından, \`${reason}\` nedeniyle uyarıldı! Uyarı Numarası: (\`${uyariData ? uyariData.sayi : 1}\`)`
      }).then((e) => setTimeout(() => {
        e.delete();
      }, 50000));
  
      member.send({ content: `**${interaction.guild.name}** sunucusunda, **${interaction.user.tag}** tarafından, **${reason}** sebebiyle uyarıldınız!` }).catch(() => {});
  
      const log = new EmbedBuilder()
        .setDescription(`${member.user.tag} adlı kullanıcıya **${interaction.user.tag}** tarafından uyarıldı`)
        .addFields(
            { name: "Cezalandırılan", value: `${member ? member.toString() : user.username}`, inline: true },
            { name: "Cezalandıran", value: `${interaction.user.tag}`, inline: true },
            { name: "Uyarı Sayısı", value: `${uyariData ? 0 : 1}`, inline: true },
            { name: "Ceza Sebebi", value: `\`\`\`fix\n${reason}\n\`\`\``, inline: false },
        )
        .setFooter({ text: `${moment(Date.now()).format("LLL") }` });
  
      interaction.guild.channels.cache.get(config.WarnLog).send({ embeds: [log] });
    } else {
      return interaction.reply({ content: "Üzgünüm..., Bu komutu kullanamazsın!", ephemeral: true });
    }
  }
  }