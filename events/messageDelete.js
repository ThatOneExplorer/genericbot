const Discord = require ("discord.js")
module.exports = {
  name: "messageDelete",
  async execute(messageDelete) {
      const LOGS_CHANNEL = process.env.LOGS_CHANNEL
		let logchannel = messageDelete.guild.channels.cache.get(LOGS_CHANNEL)
        let messagedelete = new Discord.EmbedBuilder()
          .setTitle(`Message deleted`)
          .addFields(
            { name: `Message Content`, value: `${messageDelete.content || "*No text content*"}`},
            {name: `Message by`, value: `${messageDelete.author}`},
            {name: `Link:`, value: `${messageDelete.url || "N/A"}`}
          )
          .setColor("Orange");

        if (messageDelete.attachments.size > 0) {
            const attachmentUrls = messageDelete.attachments.map(att => att.url).join("\n")
            messagedelete.addFields({ name: "Attachments", value: attachmentUrls })
        }

    if (!logchannel) {
      console.warn(`Log channel with ID ${LOGS_CHANNEL} not found in guild ${messageDelete.guild.id}`);
      return; 
    }
        await logchannel.send({embeds: [messagedelete] });
  }
};

