const { messageLink } = require("discord.js");
const { censorfunction } = require("../utils/censorfunction");
const Discord = require ("discord.js")
module.exports = {
  name: "messageUpdate",
  async execute(oldMessage, newMessage) {
    
    if (!newMessage || !newMessage.content || newMessage.author?.bot) return;

    await censorfunction(newMessage);

    const LOGS_CHANNEL = process.env.LOGS_CHANNEL
		let logchannel = newMessage.guild.channels.cache.get(LOGS_CHANNEL)
        let messageedit = new Discord.EmbedBuilder()
          .setTitle(`Message edited`)
          .addFields(
            { name: `Old Message`, value: `${oldMessage.content}`},
            { name: `New Message`, value: `${newMessage.content}`},
            { name: `Message by`, value: `${newMessage.author}`},
            {name: `Link:`, value: `${newMessage.url}`}
          )
          .setColor("Orange");
    if (!logchannel) {
      console.warn(`Log channel with ID ${LOG_CHANNEL} not found in guild ${member.guild.id}`);
      return; 
    }
        await logchannel.send({embeds: [messageedit] });
  }
};
