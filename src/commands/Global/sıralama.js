const { EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const messageUser = require("../../Database/message");
const VoiceeUser = require("../../Database/voice");
const moment = require("moment");
require("moment-duration-format");
moment.locale("tr");
const config = require("../../config");

exports.commandBase = {
    prefixData: {
        name: "sıralama",
        aliases: ["sıralama"]
    },
    slashData: new SlashCommandBuilder()
        .setName("sıralama")
        .setDescription("İstatislik sıralaması görüntüler"),

    prefixRun: async (client, message, args) => {
    },
    slashRun: async (client, interaction) => {
        var voiceUsersData = await VoiceeUser.find({ guildID: interaction.guild.id }).sort({ TotalStat: -1 });
        var voiceUsers = voiceUsersData.filter(x => interaction.guild.members.cache.get(x.userID)).sort((a, b) => b.TotalStat - a.TotalStat).splice(0, 10).map((x, index) => {
            let userPosition = voiceUsersData.findIndex(user => user.userID === x.userID) + 1;
            let totalUsers = voiceUsersData.length;
            return `${index + 1}. <@${x.userID}>: \`${moment.duration(x.TotalStat).format("H [saat], m [dakika]")}\` `;
        }).join(`\n`);
        const ses = `${voiceUsers.length > 0 ? voiceUsers.split('\n').map((user, index) => {
            switch(index) {
                case 0:
                    return `🥇 <@${voiceUsersData[index].userID}>: \`${moment.duration(voiceUsersData[index].TotalStat).format("H [saat], m [dakika]")}\``;
                case 1:
                    return `🥈 <@${voiceUsersData[index].userID}>: \`${moment.duration(voiceUsersData[index].TotalStat).format("H [saat], m [dakika]")}\``;
                case 2:
                    return `🥉 <@${voiceUsersData[index].userID}>: \`${moment.duration(voiceUsersData[index].TotalStat).format("H [saat], m [dakika]")}\``;
                default:
                    return user;
            }
        }).join('\n') : "Veri Bulunmuyor."}`;
        

        var messageUsersData = await messageUser.find({ guildID: interaction.guild.id }).sort({ totalStat: -1 });
        var messageUsers = messageUsersData.filter(x => interaction.guild.members.cache.get(x.userID)).sort((a, b) => b.totalStat - a.totalStat).splice(0, 10).map((x, index) => {
            let userPosition = messageUsersData.findIndex(user => user.userID === x.userID) + 1;
            let totalUsers = messageUsersData.length;
            return `${(index + 1)}. <@${x.userID}>: \`${Number(x.totalStat).toLocaleString()} mesaj\` `;
        }).join(`\n`);
        const mesaj = `${messageUsers.length > 0 ? messageUsers.split('\n').map((user, index) => {
            switch(index) {
                case 0:
                    return `🥇 <@${messageUsersData[index].userID}>: \`${Number(messageUsersData[index].totalStat).toLocaleString()} mesaj\``;
                case 1:
                    return `🥈 <@${messageUsersData[index].userID}>: \`${Number(messageUsersData[index].totalStat).toLocaleString()} mesaj\``;
                case 2:
                    return `🥉 <@${messageUsersData[index].userID}>: \`${Number(messageUsersData[index].totalStat).toLocaleString()} mesaj\``;
                default:
                    return user;
            }
        }).join('\n') : "Veri Bulunmuyor."}`;

        let userPositionVoice = voiceUsersData.findIndex(user => user.userID === interaction.member.id) + 1;
        let totalUsersVoice = voiceUsersData.length;
        let userPositionMessage = messageUsersData.findIndex(user => user.userID === interaction.member.id) + 1;
        let totalUsersMessage = messageUsersData.length;

        const embedcik = new EmbedBuilder()
            .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
            .addFields(
                { name: "Mesaj Sıralaması", value: `${mesaj}`, inline: true },
                { name: "Ses Sıralaması", value: `${ses}`, inline: true },
                { name: '\n', value: '\n' },
                { name: "Bilgilendirme", value: `✍️ Mesaj sıralamasında **${totalUsersMessage}** kişi arasından **${userPositionMessage}.** sıradasın\n🎙️ Ses sıralamasında **${totalUsersVoice}** kişi arasından **${userPositionVoice}.** sıradasın`, inline: true },
            );
        
        interaction.reply({ embeds: [embedcik] });
    }
};
