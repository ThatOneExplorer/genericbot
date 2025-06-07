const Discord = require("discord.js");
const Censor = require("../models/censorSchema");
const whitelist = require("../models/whitelistSchema");
const moment = require("moment");
require('dotenv').config();
const OWNER_ID = process.env.OWNER_ID;
const GENERIC_SERVER = process.env.GENERIC_SERVER;
const ALERT_CHANNEL = process.env.ALERT_CHANNEL_ID;

async function censorfunction(message) {
  if (message.author.bot) return;

  const owner = await message.client.users.fetch(OWNER_ID).catch(() => {});
  const currenttime = moment().format('DD/MM/YY');

  try {
      console.log(`${message.author.username}: @${currenttime} : ${message.content}`);
    const server = message.client.guilds.cache.get(GENERIC_SERVER);
    if (!server) return console.log(`Could not find guild with ID ${GENERIC_SERVER}`);

    const isLink = /https?:\/\/\S+/g.test(message.content);
    const lm = message.content.toLowerCase();

    const doc = await Censor.findOne({ GuildID: message.guild?.id });
    const badWords = doc?.Words || [];

    const whitelistDoc = await whitelist.findOne({ GuildID: message.guild?.id });
    const whitelistWords = whitelistDoc?.Words || [];

    const includedBadWord = badWords.some(word => new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(lm));
    const ignorebadword = whitelistWords.some(word => new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(lm));

    if (includedBadWord && !ignorebadword && !isLink) {
      if (!message.guild) return;
    //  if (message.member.permissions.has(Discord.PermissionsBitField.Flags.ManageMessages)) return;

      const censoralert = await message.client.channels.fetch(ALERT_CHANNEL).catch(() => null);
      if (!censoralert) {
        console.log(`Censor alert channel ${ALERT_CHANNEL} not found`);
        return;
      }

      const alert = new Discord.EmbedBuilder()
        .setTitle("Censor Alert Triggered")
        .addFields(
          { name: "Author", value: `<@${message.author.id}>`, inline: true },
          { name: "Message Content", value: message.content },
          { name: "Message Link", value: `[Jump to Message](${message.url})` }
        )
        .setColor("Red");

      await censoralert.send({ embeds: [alert] }).catch(() => {});
      await message.author.send(`You can't send that here!`).catch(() => {});
      if (message.deletable) await message.delete().catch(() => {});
    } 
    

  } catch (error) {
    console.error(error);
    if (owner) owner.send(`${error}`).catch(() => {});
  }
}

module.exports = { censorfunction };
