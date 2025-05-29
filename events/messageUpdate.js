const moment = require("moment");
const Censor = require("../models/censorSchema");
const Whitelist = require("../models/whitelistSchema");
const Discord = require("discord.js");
const { prefix } = require("../config.json");
const ownerID = process.env.OWNER_ID;
const generic_server = process.env.GENERIC_SERVER;
const ALERT_CHANNEL = process.env.ALERT_CHANNEL_ID;

module.exports = {
  name: "messageUpdate",
  async execute(oldMessage, newMessage) {
    console.log("message update received");
    try {
      if (newMessage.author.bot || !newMessage.guild) return;

      const server = newMessage.client.guilds.cache.get(generic_server);
      if (!server) {
        console.log("Generic server not found");
        return;
      }

      const censorDoc = await Censor.findOne({ GuildID: newMessage.guild.id });
      const whitelistDoc = await Whitelist.findOne({ GuildID: newMessage.guild.id });

      const censorWords = censorDoc?.Words || [];
      const whitelistWords = whitelistDoc?.Words || [];

      console.log("Censor words:", censorWords);
      console.log("Whitelist words:", whitelistWords);

      if (!newMessage.content) {
        console.log("No new message content");
        return;
      }

      const contentLower = newMessage.content.toLowerCase();

      const isLink = /https?:\/\/\S+/gi.test(contentLower);
      console.log("Is message a link? ", isLink);

      const containsCensorWord = censorWords.some(word => {
        const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\b${escaped}\\b`, 'i');
        return regex.test(contentLower);
      });

      const containsWhitelistWord = whitelistWords.some(word => {
        const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\b${escaped}\\b`, 'i');
        return regex.test(contentLower);
      });

      console.log("Contains censor word? ", containsCensorWord);
      console.log("Contains whitelist word? ", containsWhitelistWord);
      const censorChannel = await newMessage.client.channels.fetch(ALERT_CHANNEL).catch(() => null);
      if (!censorChannel) {
        console.log("Censor alert channel not found");
        return;
      }

      if (containsCensorWord && !containsWhitelistWord && !isLink) {
        const embed = new Discord.EmbedBuilder()
          .setTitle("Censor Alert Triggered (Edited Message)")
          .addFields(
            { name: "Author", value: `<@${newMessage.author.id}>`, inline: true },
            { name: "Old Content", value: oldMessage.content || "No old content available" },
            { name: "New Content", value: newMessage.content || "No new content available" },
            { name: "Message Link", value: `[Jump to Message](${newMessage.url})` }
          )
          .setColor("Red");
 if (newMessage.member.permissions.has(Discord.PermissionsBitField.Flags.ManageMessages)){
  return;
 }
        await censorChannel.send({ embeds: [embed] }).catch(() => {});
        await newMessage.author.send(`You can't say that here!`).catch(() => {});

        if (newMessage.deletable) {
          await newMessage.delete().catch(() => {});
          console.log("Message deleted.");
        } else {
          console.log("Message not deletable.");
        }
      } else {
        console.log("No censor condition met, skipping deletion and alert.");
      }
    } catch (error) {
      console.log("Error in messageUpdate event:", error);
      const errorembed = new Discord.EmbedBuilder()
        .setTitle("An error has occurred!")
        .setDescription("An error occurred while moderating an edited message. The bot owner has been notified.")
        .setColor("Red");

      try {
        await newMessage.reply({ embeds: [errorembed] });
        const owner = await newMessage.client.users.fetch(ownerID);
        await owner.send(`Censor error (on edit):\n\`\`\`${error.stack || error}\`\`\``);
      } catch {
        console.log("Could not notify bot owner via DMs");
      }
    }
  },
};
