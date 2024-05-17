
const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle,Partials,StringSelectMenuBuilder ,InteractionType,PermissionsBitField} = require('discord.js');
const client = new Client({
  intents: Object.values(GatewayIntentBits), 
  partials: Object.values(Partials),
  shards: "auto"
});
const config = require("./src/config.js");
const { readdirSync } = require("node:fs");

let token = config.token;

readdirSync("./src/utils").map(async (file) => {
const util = await require(`./src/utils/${file}`);
util.execute(client);
});
const suggestionChannelId = config.ÖneriKanalı;
const approverRoleId = config.ÖneriYetkili;
const userVotes = {};
const userVotesH = {};
client.on('messageCreate', message => {
  if (message.channel.id === suggestionChannelId) {
      const messageContent = message.content;
      if (message.author.bot) {
        return;
    }
      if (!messageContent.trim()) {
          return;
      }

      const suggestionEmbed = new EmbedBuilder()
          .setColor(0x00B2FF)
          .setTitle("📝 Yeni Öneri")
          .setDescription(`**Öneri :**\n\`\`\`${messageContent}\`\`\``)
          .setTimestamp()
          .setFooter({ text: `Öneri Gönderen: ${message.author.tag}` })
          .setThumbnail(message.author.displayAvatarURL())
          .addFields(
              { name: 'Durum', value: '⏳ Beklemede ', inline: true },
              { name: 'Oylar', value: '👍 0 | 👎 0', inline: true }
          );
      const row = new ActionRowBuilder()
          .addComponents(
              new ButtonBuilder()
                  .setCustomId(`accept_${message.author.id}`)
                  .setLabel(`${config.ÖneriKabulButon}`)
                  .setStyle(ButtonStyle.Success),
              new ButtonBuilder()
                  .setCustomId(`reject_${message.author.id}`)
                  .setLabel(`${config.ÖneriRedButon}`)
                  .setStyle(ButtonStyle.Danger),
              new ButtonBuilder()
                  .setCustomId('upvote')
                  .setLabel('👍')
                  .setStyle(ButtonStyle.Primary),
              new ButtonBuilder()
                  .setCustomId('downvote')
                  .setLabel('👎')
                  .setStyle(ButtonStyle.Primary)
          );

      message.channel.send({ embeds: [suggestionEmbed], components: [row] })
          .then(() => message.delete())
          .catch(console.error);
  }
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isButton()) return;

  const messageId = interaction.message.id;
  const userId = interaction.user.id;

  if (interaction.customId.startsWith('accept') || interaction.customId.startsWith('reject')) {
      const roleId = approverRoleId;
      if (!interaction.member.roles.cache.has(roleId)) {
          return interaction.reply({ content: "Buna Yetkin Yok", ephemeral: true });
      }

      const modal = new ModalBuilder()
          .setCustomId(`response-modal-${interaction.customId}`)
          .setTitle('Yanıt');

      const reasonInput = new TextInputBuilder()
          .setCustomId('reason')
          .setLabel('Yanıtınız')
          .setStyle(TextInputStyle.Paragraph);

      const actionRow = new ActionRowBuilder().addComponents(reasonInput);

      modal.addComponents(actionRow);

      await interaction.showModal(modal);
  } else if (interaction.customId === 'upvote' || interaction.customId === 'downvote') {
      if (!userVotes[messageId]) userVotes[messageId] = new Set();
      if (userVotes[messageId].has(userId)) {
          return interaction.reply({ content:"Zaten Oy Kullandınız", ephemeral: true });
      }
      userVotes[messageId].add(userId);

      const originalEmbed = interaction.message.embeds[0];
      const fields = originalEmbed.fields;
      let upvotes = parseInt(fields[1].value.split('|')[0].trim().split(' ')[1]);
      let downvotes = parseInt(fields[1].value.split('|')[1].trim().split(' ')[1]);

      if (interaction.customId === 'upvote') upvotes++;
      if (interaction.customId === 'downvote') downvotes++;


      const updatedEmbed = new EmbedBuilder(originalEmbed)
          .spliceFields(1, 1, { name: 'Oylar', value: `👍 ${upvotes} | 👎 ${downvotes}`, inline: true });

          
      await interaction.update({ embeds: [updatedEmbed], components: interaction.message.components });
  }
});



client.on('interactionCreate', async interaction => {
  if (interaction.isModalSubmit()) {
      const reason = interaction.fields.getTextInputValue('reason');
      const originalEmbed = interaction.message.embeds[0];
      const decision = interaction.customId.includes('accept') ? 'Kabul Edildi' : 'Reddedildi';
      const color = decision === 'Kabul Edildi' ? `${config.ÖneriOnay}` : `${config.ÖneriRed}`;
      const updatedButtons = new ActionRowBuilder()
          .addComponents(
              new ButtonBuilder()
                  .setCustomId('upvote')
                  .setLabel('👍')
                  .setStyle(ButtonStyle.Primary),
              new ButtonBuilder()
                  .setCustomId('downvote')
                  .setLabel('👎')
                  .setStyle(ButtonStyle.Primary)
          );

      const updatedEmbed = new EmbedBuilder(originalEmbed)
          .spliceFields(0, 1, { name: decision, value: reason, inline: true })
          .setColor(color);
      await interaction.message.edit({ embeds: [updatedEmbed], components: [updatedButtons] });
      await interaction.reply({ content: `${decision.toLowerCase()}.`, ephemeral: true });
      const user = await interaction.guild.members.fetch(interaction.customId.split('_')[1]);
      if (user) {
          user.send({ content:`Teklifiniz ${decision} ile yanıtlandı` })
      }
  }
});








let lastBoosters = [];
let topBoosters = [];
const intervalTime = 60 * 60 * 1000;
client.once('ready', () => {
    updateBoosters();
    updateBilgi();
    setInterval(updateBoosters, intervalTime);
});

async function updateBoosters() {
    const channel = await client.channels.fetch(config.BoostMetinKanalı);
    const guild = channel.guild;

    const membersCollection = await guild.members.fetch();
    const allMembers = Array.from(membersCollection.values());

    const boosters = allMembers.filter(member => member.premiumSinceTimestamp).sort((a, b) => (a.premiumSinceTimestamp || 0) - (b.premiumSinceTimestamp || 0));

    topBoosters = boosters.slice(0, 3);

    const lastBooster = boosters.reverse().find(member => member.premiumSinceTimestamp);

    lastBoosters = lastBooster ? [lastBooster] : [];

    const embed = new EmbedBuilder()
        .setTitle('Sunucu Boost Bilgileri')
        .setDescription(`${config.BoostMetin}`)
        .addFields(
            { name: "Top 3 Boost Basan Üyeler", value: topBoosters.length ? 
            topBoosters.map((member, index) => `${index + 1}. <@${member.id}> - <t:${Math.floor(member.premiumSinceTimestamp / 1000)}> tarhinden beri destekçimiz`).join('\n') : 'Yok', inline: false },
            { name: "En Son Boost Basan Üye", value: lastBoosters.length ? 
            `👤 <@${lastBooster.id}> - <t:${Math.floor(lastBooster.premiumSinceTimestamp / 1000)}> tarhinden beri destekçimiz` : 'Yok', inline: false },
        )
        .setColor(`${config.EmbedRengiBoost}`);
        const roooow = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('kontrol')
                .setLabel(`Kontrol`)
                .setEmoji(`${config.KontrolButonEmoji ? config.KontrolButonEmoji :"🎇"}`)
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('bilgi')
                .setLabel('Avantajlar')
                .setEmoji(`${config.AvantajlarButonEmoji ? config.AvantajlarButonEmoji :"🎇"}`)
                .setStyle(ButtonStyle.Primary)
        );
    
    const existingMessage = await channel.messages.fetch({ limit: 1 }).then(messages => messages.first());
    
    if (existingMessage) {
        existingMessage.edit({ embeds: [embed], components: [roooow] });
    } else {
        channel.send({ embeds: [embed], components: [roooow] });
    }
    client.on('interactionCreate', async interaction => {
        if (!interaction.isButton()) return;
    
        const { customId } = interaction; 
    
        if (customId === 'kontrol') {
            const booster = guild.members.cache.find(member => member.id === interaction.user.id && member.premiumSinceTimestamp);
            
            if (booster) {
                await interaction.reply({ content: `Sunucuya <t:${Math.floor(booster.premiumSinceTimestamp / 1000)}> tarihinde takviye yaptı!`, ephemeral: true });
            } else {
                await interaction.reply({ content: 'Takviye yok!', ephemeral: true });
            }
        } else if (customId === 'bilgi') {
            const embed = new EmbedBuilder()
            .setAuthor({name:guild.name,iconURL:guild.iconURL({dynamic:true})})
            .setDescription(`${config.AvantajMetin}`)

            await interaction.reply({embeds:[embed] , ephemeral: true });
        }
    });
    
};

async function updateBilgi() {
    const channel = await client.channels.fetch(config.BilgiEmbedKanal);
    const embed = new EmbedBuilder()
        .setTitle(`${config.BilgiEmbedBaşlık}`)
        .setDescription(`${config.BilgiEmbedMetin}`)
        .setImage(`${config.BilgiEmbedResim}`)
        .setColor(`${config.BilgiEmbedRenk}`);

        const menuOptions = config.BilgiMenüSecenekleri.map(item => ({
            label: item.label,
            description: item.description,
            value: item.value
        }));

        const menü = new ActionRowBuilder()
        .addComponents(
        new StringSelectMenuBuilder()
        .setCustomId("menu")
        .setPlaceholder(`${config.BilgiMenüBaşlık}`)
        .setOptions(menuOptions)
        );
    
    const existingMessage = await channel.messages.fetch({ limit: 1 }).then(messages => messages.first());
    
    if (existingMessage) {
        existingMessage.edit({ embeds: [embed],components: [menü] });
    } else {
        channel.send({ embeds: [embed],components: [menü] });
    }
   
    
};



client.on('interactionCreate', async interaction => {
    if (!interaction.isSelectMenu()) return;

    const selectedValue = interaction.values[0];

    const selectedItem = config.BilgiMenüSecenekleri.find(item => item.value === selectedValue);

    if (selectedItem && selectedItem.embed) {
        const embed = new EmbedBuilder()
            .setTitle(selectedItem.embed.title)
            .setDescription(selectedItem.embed.description)
            .setColor(selectedItem.embed.color);

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
});

const { GiveawaysManager } = require('vante-giveaways');
    
client.giveawaysManager = new GiveawaysManager(client, { 
  default: {
      botsCanWin: true,
      embedColor: '#0a0000',
      buttonEmoji: '🎉',
      buttonStyle: ButtonStyle.Secondary,
  },
}); 

client.giveawaysManager.on('giveawayJoined', (giveaway, member, interaction) => {
  return interaction.reply({ content: `🎉 Tebrikler **${member}**, çekilişe katıldınız`, ephemeral: true })
});

client.giveawaysManager.on('giveawayLeaved', (giveaway, member, interaction) => {
  return interaction.reply({ content: `🎉 **${member}**, çekilişten başarıyla çıktınız`, ephemeral: true })
});





client.login(token);

