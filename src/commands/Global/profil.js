const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const messageUser = require("../../Database/message")
const VoiceeUser = require("../../Database/voice")
const moment = require("moment");
require("moment-duration-format");
moment.locale("tr");
const config = require("../../config");
 exports.commandBase = {
  prefixData: {
  name: "profil",
  aliases: ["profil"]
  },
  slashData: new SlashCommandBuilder()
  .setName("profil")
  .setDescription("Bir kullanıcının profilini görüntüler.")
  .addUserOption(option =>
    option.setName('user')
        .setDescription('Profil görüntülemek için kullanıcı.')
        .setRequired(false)),
  prefixRun: async (client, message, args) => {
  },
  slashRun: async (client, interaction) => {
    const user =  interaction.options.getUser("user") || interaction.user;
    const member = await interaction.guild.members.fetch(user.id);
    let platform = { web: '`İnternet Tarayıcısı`', desktop: '`PC (App)`', mobile: '`Mobil`' }
    let bilgi;
    if (member.presence && member.presence.status !== 'offline') { bilgi = `\`•\` Bağlandığı Cihaz: ${platform[Object.keys(member.presence.clientStatus)[0]]}` } else { bilgi = '`•` Bağlandığı Cihaz: Çevrimdışı `🔴`' }
    const roles = member.roles.cache.filter(role => role.id !== interaction.guild.id).sort((a, b) => b.position - a.position).map(role => `<@&${role.id}>`);
    const rolleri = [];
    if (roles.length > 6) {
        const lent = roles.length - 6;
        let itemler = roles.slice(0, 6);
        itemler.map(x => rolleri.push(x));
        rolleri.push(`${lent}...`);
    } else {
        roles.map(x => rolleri.push(x));
    };
    const messageData = await messageUser.findOne({ guildID: interaction.guild.id, userID: member.id });
    const voiceData = await VoiceeUser.findOne({ guildID: interaction.guild.id, userID: member.id });
    const embedcik = new EmbedBuilder()
    .setAuthor({ name: interaction.member.user.username, iconURL: interaction.member.user.avatarURL({ dynamic: true }) })
    .setThumbnail(member.user.avatarURL({ dynamic: true }))
    .addFields(
        { name: "Genel Bilgileri", value: `\`•\` Profil: ${member}\n\`•\` ID: ${member.id}\n ${bilgi}`, inline: true },
        { name: "Sunucu Bilgileri", value: `\`•\` Oluşturulma Tarihi: <t:${Math.floor(member.user.createdTimestamp / 1000)}:R>\n\`•\` Katılma Tarihi: <t:${Math.floor(member.joinedTimestamp / 1000)}:R>\n\`•\` Katılım Sırası: \`${(interaction.guild.members.cache.filter(a => a.joinedTimestamp <= member.joinedTimestamp).size).toLocaleString()}/${(interaction.guild.memberCount).toLocaleString()}\``, inline: true },
        { name: '\n', value: '\n' },
        { name: `Rolleri (\`${rolleri.length}\`)`, value: `${rolleri.join(", ")}`, inline: false },
        { name: `Mesaj Bilgisi`, value: `▫️ Bu hafta \`${messageData ? messageData.weeklyStat : 0}\` mesaj atmış\n▫️ Toplam \`${messageData ? messageData.totalStat : 0}\` mesaj atmış`, inline: false },
        { name: `Ses Bilgisi`, value: `▫️ Bu hafta \`${moment.duration(voiceData ? voiceData.WeeklyStat : 0).format("H [Saat], m [dakika]")}\` seste durmuş\n▫️ Toplam \`${moment.duration(voiceData ? voiceData.TotalStat : 0).format("H [Saat], m [dakika]")}\` seste durmuş`, inline: true },
    )
    interaction.reply({embeds:[embedcik]})
  }
  }