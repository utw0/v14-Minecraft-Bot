const { ChannelType, Collection, Events } = require("discord.js");
const config = require("../config.js");
const messageUser = require("../Database/message.js");
const userChannel = require("../Database/userChannels.js");
const ms = require("ms");
const cooldown = new Collection();

module.exports = {
  name: Events.MessageCreate,
  execute: async (message) => {
    if (message.author.bot) return;
    await messageUser.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { dailyStat: 1, weeklyStat: 1, twoWeeklyStat: 1,totalStat: 1  } }, { upsert: true });
    await userChannel.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id, channelID: message.channel.id }, { $inc: { channelData: 1 } }, { upsert: true });
  }
};
