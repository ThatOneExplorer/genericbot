const moment = require("moment");
const mongoose = require("mongoose");
const Open = require("../models/ModMailSchema");
require('dotenv').config();
const Discord = require("discord.js");
const { prefix } = require("../config.json");
const ownerID = process.env.OWNER_ID
const generic_server = process.env.GENERIC_SERVER
const THREAD_CATEGORY_ID = "864306096624893973";

module.exports = {
  name: "messageUpdate",
  async execute(oldMessage, newMessage) {
    try {
      const currenttime = moment(Date.now()).format("DD/MM/YY");
      if (newMessage.author.bot || !newMessage.guild) return;
      const server = newMessage.client.guilds.cache.find(g => g.id === generic_server);
      if(!server){
          return console.log(`Could not find guild with ID ${generic_server}`);
      }
    
      const isLink = /https?:\/\/\S+/gi.test(newMessage.content);

      const { censor } = require("./censor.json");
      const { whitelist } = require("./whitelist.json");

      const contentLower = newMessage.content.toLowerCase();
      const includedBadWord = censor.some(word => contentLower.includes(word));
      const ignoreBadWord = whitelist.some(word => contentLower.includes(word));

      if (includedBadWord && !ignoreBadWord && !isLink) {
        const censoralert = await newMessage.client.channels
          .fetch("864306096234692615")
          .catch(e => console.log(`Censor channel fetch error: ${e}`));
        if (!censoralert) return console.warn("Censor alert channel not found");

        const embed = new Discord.EmbedBuilder()
          .setTitle("Censor Alert Triggered (Edited Message)")
          .addFields(
            { name: "Author", value: `<@${newMessage.author.id}>`, inline: true },
            {name: "Old Content", value: oldMessage.content},
            { name: "New Content", value: newMessage.content },
            { name: "Message Link", value: `[Jump to Message](${newMessage.url})` }
          )
          .setColor("Red");

        await censoralert.send({ embeds: [embed] }).catch(console.log);
        await newMessage.channel
          .send(`<@${newMessage.author.id}>, you can't say that here!`)
          .catch(console.log);

        if (newMessage.deletable) {
            if(newMessage.member.permissions.has(Discord.PermissionsBitField.Flags.ManageMessages)){
                return console.log("has manage messages permissions ");
            }
          await newMessage.delete().catch(e => console.log(`Delete failed: ${e}`));
        }
      }
    } catch (e) {
      console.log(`Error in messageUpdate: ${e}`);
      const errorembed = new Discord.EmbedBuilder()
        .setTitle("An error has occurred!")
        .setDescription("An error occurred while moderating an edited message. The bot owner has been notified.")
        .setColor("Red");

      try {
        await newMessage.reply({ embeds: [errorembed] });
        const owner = await newMessage.client.users.fetch(ownerID);
        await owner.send(`Censor error (on edit):\n\`\`\`${e.stack || e}\`\`\``);
      } catch (sendError) {
        console.log("Failed to notify owner:", sendError);
      }
    }
  },
};
