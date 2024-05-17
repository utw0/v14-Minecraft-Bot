const { EmbedBuilder, PermissionsBitField, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const uyarisayi = require("../../Database/mute")
const moment = require("moment");
require("moment-duration-format");
moment.locale("tr");
const config = require("../../config");
 exports.commandBase = {
  prefixData: {
  name: "sicil",
  aliases: ["sicil"]
  },
  slashData: new SlashCommandBuilder()
  .setName("sicil")
  .setDescription("ID'si girilen kullanıcının sicilini gösterir")
  .addUserOption(option =>
    option.setName('user')
        .setDescription('Siciline bakılcak kullanıcıyı belirtin')
        .setRequired(true)),
  prefixRun: async (client, message, args) => {
  },
  slashRun: async (client, interaction) => {
    if( [PermissionsBitField.Flags.Administrator, PermissionsBitField.Flags.ManageRoles, PermissionsBitField.Flags.BanMembers, PermissionsBitField.Flags.KickMembers].some(x => interaction.member.permissions.has(x)) ||
        [...config.WarnRoller].some(x => interaction.member.roles.cache.has(x))) {

            const user = interaction.options.getUser('user');
            const member = await interaction.guild.members.fetch(user.id);
        
            var data = await uyarisayi.find({ guildID: interaction.guild.id, userID: member.id });
            if (!data || data.length === 0) {
                return interaction.reply({ content: `**${member.user.tag}** adlı kullanıcıya ait veri bulunamadı` });
            }
            
            const menuOptions = [];
            for (let i = 0; i < data.length; i++) {
                const cezalar = data[i]
                await menuOptions.push({
                    label: `Timeout`,
                    description: `${cezalar.penaltys[0].Reason === undefined ? "Sebep Girilmemiş." : cezalar.penaltys[0].Reason}`,
                    value: `${cezalar.cezaId}`
                })
            
            
            }
            
            const row = new ActionRowBuilder()
            .setComponents(
                new StringSelectMenuBuilder()
                    .setCustomId("sicil")
                    .addOptions(menuOptions.slice(0, 25))
                    .setPlaceholder(`${menuOptions.length > 25 ? "Son 25" : menuOptions.length} adet cezan sıralanmıştır.`)
            )
            interaction.reply({content:`**${member.user.tag}** kullanıcısının uyarıları`,components:[row]})
          } else {
            return interaction.reply({ content: "Üzgünüm..., Bu komutu kullanamazsın!", ephemeral: true });
          }
        }
        }  