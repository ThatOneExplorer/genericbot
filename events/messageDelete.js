const Discord = require ("discord.js")
module.exports = {
  name: "messageDelete",
  async execute(messageDelete) {
      const LOGS_CHANNEL = process.env.LOGS_CHANNEL
		let logchannel = messageDelete.guild.channels.cache.get(LOGS_CHANNEL)
        let messagedelete = new Discord.EmbedBuilder()
          .setTitle(`Message deleted`)
          .addFields(
            { name: `Message Content`, value: `${messageDelete.content}`},
            {name: `Message by`, value: `${messageDelete.author}`},
            {name: `Link:`, value: `${messageDelete.url}`}
          )
          .setColor("Orange");
    if (!logchannel) {
      console.warn(`Log channel with ID ${LOG_CHANNEL} not found in guild ${member.guild.id}`);
      return; 
    }
        await logchannel.send({embeds: [messagedelete] });
  }
};
