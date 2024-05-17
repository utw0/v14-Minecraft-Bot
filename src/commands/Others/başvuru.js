const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, TextInputBuilder, TextInputStyle,ModalBuilder} = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders");
const TicketSetup  = require("../../Database/ticketsetup");
 exports.commandBase = {
  prefixData: {
  name: "basvuru",
  aliases: ["basvuru"]
  },
  slashData: new SlashCommandBuilder()
      .setName('basvuru')
      .setDescription('Başvuru Sistemi'),
      ownerOnly: true,
      prefixRun: async (client, message, args) => {

        message.channel.send({embeds:[ new EmbedBuilder()
            .setColor("Random")
            .setDescription(`Merhaba! ${message.guild.name}\n\nAşağıdaki butondanlardan **Yetkili Başvurusu, Slot Başvurusu ve Komutçu Başvurusu** yapabilirsin`)
            .setThumbnail(message.guild.iconURL({dynamic:true}))
        ]
        ,components:[
            new ActionRowBuilder()
            .setComponents(
                new ButtonBuilder().setCustomId("yetkili").setLabel("Yetkili Başvurusu Yap").setStyle(ButtonStyle.Secondary),
                new ButtonBuilder().setCustomId("slot").setLabel("Slot Başvurusu Yap").setStyle(ButtonStyle.Secondary),
                new ButtonBuilder().setCustomId("komut").setLabel("Komutcu Başvurusu Yap").setStyle(ButtonStyle.Secondary),
    
            )
        ]})
    

    },
  }
