const { ChannelType, Collection, Events } = require("discord.js");
const config = require("../config.js");
const VoiceStat = require("../Database/voice.js");
const JoinedAt = require("../Database/voiceJoinedAt.js");
const VoiceUserChannel = require("../Database/voiceuserchannel.js");
const ms = require("ms");
const cooldown = new Collection();

module.exports = {
  name: Events.VoiceStateUpdate,
  execute: async (oldState, newState) => {
    if ((oldState.member && oldState.member.user.bot) || (newState.member && newState.member.user.bot)) return;

    if (!oldState.channelId && newState.channelId) await JoinedAt.findOneAndUpdate({ userID: newState.id },{ $set: { Date: Date.now() } },  { upsert: true });
    
    let joinedAtData = await JoinedAt.findOne({ userID: oldState.id });
    if (!joinedAtData) await JoinedAt.findOneAndUpdate({ userID: oldState.id },{ $set: { Date: Date.now() } },  { upsert: true });
    joinedAtData = await JoinedAt.findOne({ userID: oldState.id });
    const data = Date.now() - joinedAtData.Date;
    
    if (oldState.channelId && !newState.channelId) {
    await DbSave(oldState, oldState.channel, data);
    await JoinedAt.deleteOne({ userID: oldState.id });
}
  }
};
async function DbSave(user, channel, data) {
    await VoiceStat.findOneAndUpdate({ guildID: config.SunucuID, userID: user.id },{ $inc: { TotalStat: data, DailyStat: data, WeeklyStat: data, MonthlyStat: data } }, { upsert: true });
    await VoiceUserChannel.findOneAndUpdate({ guildID: config.SunucuID, userID: user.id, ChannelID: channel.id}, { $inc: { ChannelData: data } }, { upsert: true });
    }