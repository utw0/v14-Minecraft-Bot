const { EmbedBuilder, PermissionsBitField, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const penaltys = require("../../Database/mute")
const ms = require('ms')
const moment = require("moment");
require("moment-duration-format");
moment.locale("tr");
const config = require("../../config");
 exports.commandBase = {
  prefixData: {
  name: "mute",
  aliases: ["mute"]
  },
  slashData: new SlashCommandBuilder()
    .setName("mute")
    .setDescription("Belirtilen kullanıcıyı susturur")
    .addUserOption(option =>
      option.setName('user')
          .setDescription('Susturulacak kullanıcıyı seç')
          .setRequired(true))
    .addStringOption(option =>
      option.setName('sebep')
          .setDescription('Susturma sebebini belirtin')
          .setRequired(true))
    .addStringOption(option =>
      option.setName('süre')
          .setDescription('Susturma süresini belirtin (örn: 1h, 30m)')
          .setRequired(true)),
  prefixRun: async (client, message, args) => {
  },
  slashRun: async (client, interaction) => {
    if ([PermissionsBitField.Flags.ManageRoles].some(x => interaction.member.permissions.has(x)) ||
    [...config.MuteRoller].some(x => interaction.member.roles.cache.has(x))) {

  const user = interaction.options.getUser('user');
  const reason = interaction.options.getString('sebep') || "Belirtilmedi!";
  const duration = interaction.options.getString('süre') || null;
  const member = interaction.guild.members.cache.get(user.id)
  const timeInMs = ms(duration);
  member.timeout(timeInMs, reason);
  const ceza = await penaltys.countDocuments().exec();
  const bitisTarihi = (Date.now() + timeInMs)
await penaltys.findOneAndUpdate({guildID: interaction.guild.id, userID:member.id, cezaId: ceza+1}, {$set:{penaltys:{Staff:interaction.user.id, Punished:member.id, SentencingDate:Date.now(),PenaltyEndTime: bitisTarihi,Finished:false,Reason:reason, type:"CHAT-MUTE"}}},{upsert:true})
  interaction.reply({content:`${member.toString()} üyesi, **${interaction.user.tag}** tarafından, \`${reason}\` nedeniyle susturuldu!`})
  const log = new EmbedBuilder()
        .setDescription(`${member} (\`${member.id}\`) Sunucudan Yasaklandı!

Cezanın Detayları:
- Yetkili: ${interaction.user} (\`${interaction.user.id}\`)
- Kullanıcı: ${member} (\`${member.id}\`)
- İşlem: Mute
- Süre: ${sureCevir(timeInMs)}
- Tarih: <t:${Math.floor(Date.now() / 1000)}> (<t:${Math.floor(Date.now() / 1000)}:R>)
- Sebep: ${reason}`)
       
        .setFooter({ text: `${moment(Date.now()).format("LLL") }` });
  
      interaction.guild.channels.cache.get(config.MuteLog).send({ embeds: [log] });
} else {
  return interaction.reply({ content: "Üzgünüm..., Bu komutu kullanamazsın!", ephemeral: true });
}
}
}
const sureCevir = global.sureCevir = function(veri){
    return moment.duration(veri).format("H [Saat], m [dakika]");
  }