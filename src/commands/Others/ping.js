const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

 exports.commandBase = {
  prefixData: {
  name: "ping",
  aliases: ["pong"]
  },
  slashData: new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Pong!"),
  cooldown: 5000,//1 saniye = 1000 ms / cooldown olmasını istemezseniz 0 yazın.
  ownerOnly: false,//komutu sadece geliştiricinin kullanabilmesini istersen true olarak değiştir
  prefixRun: async (client, message, args) => {
  },
  slashRun: async (client, interaction) => {
    interaction.reply(`${client.ws.ping}`)
  }
}
