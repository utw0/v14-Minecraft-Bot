const { EmbedBuilder, PermissionsBitField,ActionRowBuilder,ButtonBuilder,ButtonStyle } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Config = require("../../config")
const random = require('random-number-csprng');
const { loadImage, createCanvas } = require('canvas');
 exports.commandBase = {
  prefixData: {
  name: "ship",
  aliases: ["ship"]
  },
  slashData: new SlashCommandBuilder()
    .setName("ship")
    .setDescription("Ship"),
    cooldown: 5000,
  prefixRun: async (client, message, args) => {
    let şarkı = [
        'https://open.spotify.com/track/2SGltWNsdjCjyf6eh3iM0g?si=c49bb2c15ac343f5',
        'https://open.spotify.com/track/0ywlnV6QEZneCbbqLev6qL?si=a94d3ae7328b476c',
        'https://open.spotify.com/track/0JkZUrGmvzpX4yP8CoqItc?si=c5b35b77a6804b43',
        'https://open.spotify.com/track/0yrqfgfaQs222WGcZMvIFA?si=3219a4f749884702',
        'https://open.spotify.com/track/2911GW6Gdfuc3CQ2HrLDn6?si=a590bce4552f40a0',
        'https://open.spotify.com/track/3ZGUpGjkL9D5wjMWd7wFB5?si=ed9b59544f6a4eab',
        'https://open.spotify.com/track/38j60DwttFNYk2GmCTIUod?si=2ab67840f1a84dd0',
        'https://open.spotify.com/track/6KmThLltgcLO058vNzxvMV?si=2a89388eeb42414c',
        'https://open.spotify.com/track/26EzdCBOvRJljcc2zYOEVP?si=e4c5cd109369406e',
        'https://open.spotify.com/track/7hrjh79DQVNwGTL3EgrBi4?si=c4e24bf978ea457c',
        'https://open.spotify.com/track/11AkXmBdjwu4upt22GjJrG?si=76fe1e69c3224af3',
        'https://open.spotify.com/track/6ZvKnJSendvbZGiVMmgIdp?si=c3fb586f7c0142b2',
        'https://open.spotify.com/track/0kjy0Qk3anB4t1dNIL7No3?si=8f9cea3da1e146e3',
        'https://open.spotify.com/track/3jDcUArWhSonfHpK3QXJug?si=2b4db33b15784b89',
        'https://open.spotify.com/track/4uoXb2toU8zWD27TpJS7Yk?si=1a6217915dd5422f',
        'https://open.spotify.com/track/4UohOvkgmCt3p0PYOPnHjN?si=8f0199b91b164724',
        'https://open.spotify.com/track/04RR90pc7GMGHfELXfuX2Z?si=56154d8544164a7b',
        'https://open.spotify.com/track/6CcJMwBtXByIz4zQLzFkKc?si=a76b6157d1c6480b',
        'https://open.spotify.com/track/1GvNBnLOlRKZYS93fdEN9h?si=9e3a97956b3d4046',
        'https://open.spotify.com/track/0wr0JTOlgZVYccny0GlL4T?si=432cd351bee74708',
        'https://open.spotify.com/track/3bKMzeLEDmPHzDMWplhdtP?si=4d28a63f8a3a4a67',
        'https://open.spotify.com/track/5SFBaOi2ELB2P5tFzmcD73?si=713b86f5e0d64a62',
        'https://open.spotify.com/track/2pPJA6IEl9iyXtVyrE06cT?si=05e234d20ad645b7',
        'https://open.spotify.com/track/6nhJ2KSi1rKGX75frHpkXK?si=7bd37d56f85f4148',
        'https://open.spotify.com/track/5XMAeSjjinBwKjdANxHbeZ?si=87ec32afe2994536',
        'https://open.spotify.com/track/0slHapEcgmGP0kwfqQLLmP?si=4bf5c78418ef4136',
        "https://open.spotify.com/track/7nGlBIG5iKwZPhexUb0mDD?si=c3c06880ad224d28",
        "https://open.spotify.com/track/3dlDT2CbBppXXW8t4C3At3?si=7622f533c802495a",
        "https://open.spotify.com/track/4h7Aqh6zN4dyomF7nwAvgR?si=f617f3cf8abd48aa",
        "https://open.spotify.com/track/0ehYCsSBVw1xSeP9V5jh1y?si=25a10acb153041d3",
        "https://open.spotify.com/track/0HaUKznmctMKvXbRCnEv5F?si=0e02526c48474a27",
        "https://open.spotify.com/track/7rLmkWvFxdunGPDACf9t9i?si=44058737891248aa",
        "https://open.spotify.com/track/4MjVQ6D5mFhmREOmRVEm4t?si=b5e05af064394626"



    ]
    let shipcik = message.mentions.users.first() || client.guilds.cache.get("1066294816851374100").members.cache.get(args[0])

    if (shipcik && shipcik.id === message.author.id) {
     message.reply({content:"**O kadar mı yalnızsın agam ya**"})
        return;
    }
    if (shipcik && shipcik.id === '136619876407050240') {
        message.reply('Iyy ertu mu adskogfkdsoghsf siktirgit');
        return;
    }
    if (shipcik && shipcik.id === '136619876407050240') {
        message.reply('Iyy ertu mu adskogfkdsoghsf siktirgit');
        return;
    }
    if (!shipcik || message.author.id === shipcik.id) {
        shipcik = message.guild.members.cache
       .random();
    }
  
    shipcik = message.guild.members.cache.get(shipcik.id)
    const percent = await random(15, 100);
    let Row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
        .setLabel("Tanış!")
        .setDisabled(percent <= 40 && percent >= 10 ? true : false)
        .setCustomId("test")
        .setStyle(ButtonStyle.Success),

        new ButtonBuilder()
        .setLabel("Sizin Şarkınız")
        .setDisabled(percent <= 40 && percent >= 10 ? true : false)
        .setCustomId("test2")
        .setStyle(ButtonStyle.Primary),

        new ButtonBuilder()
        .setLabel("Sil")
        .setEmoji(await emojiBul("Sil") !== null ? await emojiBul("Sil") : "🗑️")
        .setDisabled(percent <= 40 && percent >= 10 ? false : true)
        .setCustomId("test3")
        .setStyle(ButtonStyle.Secondary)
        
    )
    const canvas = createCanvas(691, 244);

    const context = canvas.getContext('2d');

    context.fillStyle = '#3c3c3c';
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = '#e31b23';
    context.fillRect(263, 194, 167, -((percent / 100) * 147));

    const backgroundBuffer = await loadImage('https://i.hizliresim.com/89qs297.png');
    context.drawImage(backgroundBuffer, 0, 0);

    const authorAvatarBuffer = await loadImage(message.author.displayAvatarURL({ extension: 'png', size: 4096 }));
    const targetAvatarBuffer = await loadImage(shipcik.displayAvatarURL({ extension: 'png', size: 4096 }));
    context.drawImage(authorAvatarBuffer, 42, 38, 170, 170);
    context.drawImage(targetAvatarBuffer, 480, 38, 170, 170);

    context.fillStyle = '#ffffff';
    context.textAlign = 'center';
    context.font = 'normal 42px Kanit';
    context.fillText(`%${percent}`, 348, 130);

    message.channel.send({
        components: [Row] ,content: `[ **${shipcik.displayName}** & **${message.member.displayName}** ]\n**${(createContent((percent * 100) / 100))}**`,files: [{ attachment: canvas.toBuffer(), name: "ship.png" }],
    

    })
    .then(async (msg) => {
        var filter = (i) => (i.user.id === message.author.id || i.user.id === shipcik.user.id) && i.isButton();
        let collector = msg.createMessageComponentCollector({filter: filter ,max:2})
        collector.on('collect', async (i) => {
            if (i.customId === "test") {
                const randomIntroductionMessages = [
                    `Merhaba! \`${i.user.username}\`, seninle güzel bir sohbet etmek istiyor. ☕`,
                    `\`Selam! Umarım günün harika geçiyordur. Birlikte vakit geçirelim mi?\``,
                    `Hey! Adım \`${i.user.username}\` ve sana daha yakından tanımak isterim.`,
                    `\`Selam! Birbirimize daha yakından bakalım mı?\``,
                ];
            
                const randomMessage = randomIntroductionMessages[Math.floor(Math.random() * randomIntroductionMessages.length)];
            
                i.reply({ content: randomMessage });
            }
            if(i.customId == "test2") {
                let şarkıcık;
                şarkıcık= Math.floor((Math.random()*şarkı.length))
                let love = şarkı[şarkıcık]
                i.reply({content: `${love}`, ephemeral: true})
               
            }
            if(i.customId == "test3") {
                message.delete().then(i.message.delete()) 
            }
        })
    
    }
    )
  },
  
}


function createContent(num) {
    if (num < 10) return 'Bizden olmaz...';
    if (num < 20) return 'Çok farklıyız...';
    if (num < 30) return 'Eksik bir şeyler var...';
    if (num < 40) return 'Sıradan biri gibi...';
    if (num < 50) return 'Aslında hoş biri...';
    if (num < 60) return 'Fena değil...';
    if (num < 70) return "Bi'kahveye ne dersin?";
    if (num < 80) return 'Çiğköfte & milkshake yapalım mı?';
    if (num < 90) return 'Beraber film izleyelim mi?';
    
    return 'Ev boş?';
    }