const Discord = require("discord.js");
const mongoose = require("mongoose");
const Censor = require("../models/censorSchema");
const whitelist = require("../models/whitelistSchema");
const THREAD_CATEGORY_ID = process.env.THREAD_CATEGORY_ID;
const moment = require("moment");
require('dotenv').config();
const prefix = require("../config.json");
const OWNER_ID= process.env.OWNER_ID;
const GENERIC_SERVER = process.env.GENERIC_SERVER;
const ALERT_CHANNEL = process.env.ALERT_CHANNEL_ID;

module.exports = {
	name: 'messageCreate',
	async execute(messageCreate) {
        const owner = await messageCreate.client.users.fetch(OWNER_ID).catch(() => {});
        const currenttime = moment(Date.now()).format('DD/MM/YY'); 
        const args = (messageCreate.content.slice(prefix.length).trim().split(/ +/g));
        const server = messageCreate.client.guilds.cache.get(GENERIC_SERVER);
        try {
            if(messageCreate.author.bot) return;
            if(!server) return console.log(`Could not find guild with ID ${GENERIC_SERVER}`);
            const channel = await messageCreate.client.channels.cache.find(ch => ch.name === `${messageCreate.author.id}`);
            const isLink = /https?:\/\/\S+/g.test(messageCreate.content);
            if(!messageCreate.guild){ 
              
                if(!channel){
                    const threadcat = await messageCreate.client.channels.fetch(THREAD_CATEGORY_ID).catch(() => {});
                    const ticket = await server.channels.create({name: `${messageCreate.author.id}`, parent: threadcat}).catch(() => {});
                    let ticketembed = new Discord.EmbedBuilder()
                        .setAuthor({name: `${messageCreate.author.tag}`})
                        .setTitle(`Modmail Incoming!`)
                        .addFields(
                            {name: `User:`, value: `${messageCreate.author.username}`},
                            {name: `UserID:`, value:`${messageCreate.author.id}`}
                        );
                    await ticket.send(`@everyone`).catch(() => {});
                    await ticket.send({embeds: [ticketembed]}).catch(() => {});
                    ticket.send(`**FROM: ${messageCreate.author.username}** - ${messageCreate.content}`).catch(() => {});
                    if (messageCreate.attachments.size > 0) {
                        await ticket.send({ files: messageCreate.attachments.map(a => a.url) });
                    }
                    messageCreate.author.send({content: `Thank's for opening a support thread! Your message has been sent. A member of staff will be with you soon to assist you, please have patience.`}).catch(() => {});
                } else {
                    const channel = await messageCreate.client.channels.cache.find(ch => ch.name === `${messageCreate.author.id}`);
                    channel.send({content: `**FROM: ${messageCreate.author.username}** - ${messageCreate.content}`}).catch(() => {});
                    if (messageCreate.attachments.size > 0) {
                        await channel.send({ files: messageCreate.attachments.map(a => a.url) });
                    }
                }
            }

            if (messageCreate.channel.parentId === THREAD_CATEGORY_ID) {
                let ticketuser;
                try {
                    ticketuser = await messageCreate.client.users.fetch(messageCreate.channel.name);
                } catch (err) {
                    console.log(`Failed to fetch user: ${err}`);
                    return messageCreate.channel.send(`⚠️ Failed to fetch the user for this thread.`);
                }

                const owner = await messageCreate.client.users.fetch(OWNER_ID).catch(() => null);

                const errorNotify = async (error) => {
                    messageCreate.reply(`❌ An error occurred while trying to send message to user. It is likely that they have either left the server or blocked the bot.`);
                };

                if (messageCreate.content === "!w") {
                    const staffIntro = `**FROM: ${messageCreate.author.username}** - Hello there! You have successfully reached ${messageCreate.guild.name} Staff team! I'm ${messageCreate.author.username} from the staff team, how can I assist you?`;
                    try {
                        await ticketuser.send({ content: staffIntro });
                    } catch (error) {
                        return errorNotify(error);
                    }
                    await messageCreate.channel.send({ content: staffIntro }).catch(() => {});
                    await messageCreate.delete().catch(() => {});
                }

                if (messageCreate.content === "!close") {
                    await messageCreate.channel.send(`Closing this thread in 5 seconds!`).catch(() => {});
                    setTimeout(async () => {
                        try {
                            await ticketuser.send(`This thread has now been closed! Feel free to reopen another thread if you require more assistance.`);
                        } catch (error) {
                            errorNotify(error);
                        }
                        messageCreate.channel.delete().catch(() => {});
                    }, 5000);
                }

                if (messageCreate.content.startsWith("!r")) {
                    const reply = messageCreate.content.split(" ").slice(1).join(" ");
                    try {
                        await ticketuser.send({ content: `**FROM: ${messageCreate.author.username}** - ${reply}` });
                        if (messageCreate.attachments.size > 0) {
                            await ticketuser.send({ files: messageCreate.attachments.map(a => a.url) });
                        }
                    } catch (error) {
                        return errorNotify(error);
                    }
                    await messageCreate.channel.send({ content: `**FROM: ${messageCreate.author.username}** - ${reply}` }).catch(() => {});
                    if (messageCreate.attachments.size > 0) {
                        await messageCreate.channel.send({ files: messageCreate.attachments.map(a => a.url) });
                    }
                    await messageCreate.delete().catch(() => {});
                }

                if (messageCreate.content.startsWith("!ar")) {
                    const reply = messageCreate.content.split(" ").slice(1).join(" ");
                    try {
                        await ticketuser.send({ content: `**FROM: Anonymous Staff** - ${reply}` });
                        if (messageCreate.attachments.size > 0) {
                            await ticketuser.send({ files: messageCreate.attachments.map(a => a.url) });
                        }
                    } catch (error) {
                        return errorNotify(error);
                    }
                    await messageCreate.channel.send({ content: `**FROM: Anonymous Staff** - ${reply}` }).catch(() => {});
                    if (messageCreate.attachments.size > 0) {
                        await messageCreate.channel.send({ files: messageCreate.attachments.map(a => a.url) });
                    }
                    await messageCreate.delete().catch(() => {});
                }
            }

            const lm = messageCreate.content.toLowerCase();

            const doc = await Censor.findOne({ GuildID: messageCreate.guild?.id });
            const badWords = doc?.Words || [];

            const whitelistDoc = await whitelist.findOne({ GuildID: messageCreate.guild?.id });
            const whitelistWords = whitelistDoc?.Words || [];

            const includedBadWord = badWords.some(word => new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(lm));
            const ignorebadword = whitelistWords.some(word => new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(lm));

            console.log("Censor words:", badWords);
            console.log("Whitelist words:", whitelistWords);
            console.log("Is message a link? ", isLink);
            console.log("Contains censor word? ", includedBadWord);
            console.log("Contains whitelist word? ", ignorebadword);

            const censoralert = await messageCreate.client.channels.fetch(ALERT_CHANNEL).catch(() => {});

            if (includedBadWord && !ignorebadword && !isLink){
                if (!messageCreate.guild) return;
                if (messageCreate.member.permissions.has(Discord.PermissionsBitField.Flags.ManageMessages)) return;
                const alert = new Discord.EmbedBuilder()
                    .setTitle("Censor Alert Triggered")
                    .addFields(
                        { name: "Author", value: `<@${messageCreate.author.id}>`, inline: true },
                        { name: "Message Content", value: messageCreate.content },
                        { name: "Message Link", value: `[Jump to Message](${messageCreate.url})` }
                    )
                    .setColor("Red");
                if(!censoralert){
                    return console.log(`Censor alert channel ${ALERT_CHANNEL} not found`)
                }
                if(censoralert) await censoralert.send({ embeds: [alert] }).catch(() => {});
                await messageCreate.author.send(`You can't send that here!`).catch(() => {});
                if (messageCreate.deletable) await messageCreate.delete().catch(() => {});
            } else if (!includedBadWord && !messageCreate.author.bot) {
                console.log(`${messageCreate.author.username}: @${currenttime} : ${messageCreate.content}`);
            }
        } catch (e){
            console.log(e);
            if(owner) owner.user.send(`${e}`).catch(() => {});
        }
    }
}
