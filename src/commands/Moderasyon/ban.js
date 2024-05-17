const { EmbedBuilder, PermissionsBitField, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const uyarisayi = require("../../Database/warn")
const moment = require("moment");
require("moment-duration-format");
moment.locale("tr");
const config = require("../../config");
 exports.commandBase = {
  prefixData: {
  name: "ban",
  aliases: ["ban"]
  },
  slashData: new SlashCommandBuilder()
  .setName("ban")
  .setDescription("Belirtilen kullanıcıyı sunucudan atar")
  .addUserOption(option =>
    option.setName('user')
        .setDescription('Atılıcak kullanıcıyı seç')
        .setRequired(true))
        .addStringOption(option =>
            option.setName('sebep')
                .setDescription('Ban sebebini belirtin')
                .setRequired(true)),
  prefixRun: async (client, message, args) => {
  },
  slashRun: async (client, interaction) => {
    if( [PermissionsBitField.Flags.Administrator].some(x => interaction.member.permissions.has(x)) ||
        [...config.BanRoller].some(x => interaction.member.roles.cache.has(x))) {

            const user = interaction.options.getUser('user');
            const reason = interaction.options.getString('sebep') || "Belirtilmedi!";
            const member = await interaction.guild.members.fetch(user.id);
        
          
      if (member.bot) return interaction.reply({ content: "Botlar üstünde işlem yapılamaz", ephemeral: true });
      if (!member.manageable) return interaction.reply({ content: "Yetersiz yetki !", ephemeral: true });
      if (member.roles.highest.position >= interaction.guild.members.cache.get(interaction.user.id).roles.highest.position && !client.owners.includes(interaction.user.id)) return interaction.reply({ content: "kendinden Üst/Aynı yetkide ki kullanıcılar veya bot sahipleri üstünde işlem yapılamaz", ephemeral: true });
      await member.ban({ reason: reason });
      await interaction.reply({ content: `${user} - \`[${user.id}]\` Kullanıcısı başarıyla banlandı! Sebep: **${reason}**`});
      const log = new EmbedBuilder()
        .setDescription(`${member} (\`${member.id}\`) Sunucudan Yasaklandı!

Cezanın Detayları:
- Yetkili: ${interaction.user} (\`${interaction.user.id}\`)
- Kullanıcı: ${member} (\`${member.id}\`)
- İşlem: Yasaklama (Ban)
- Tarih: <t:${Math.floor(Date.now() / 1000)}> (<t:${Math.floor(Date.now() / 1000)}:R>)
- Sebep: ${reason}`)
       
        .setFooter({ text: `${moment(Date.now()).format("LLL") }` });
  
      interaction.guild.channels.cache.get(config.BanLog).send({ embeds: [log] });
          } else {
            return interaction.reply({ content: "Üzgünüm..., Bu komutu kullanamazsın!", ephemeral: true });
          }
        }
        }  