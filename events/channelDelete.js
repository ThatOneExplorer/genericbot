const Discord = require("discord.js");

module.exports = {
  name: 'channelDelete',
  async execute(channel) {
    const logchannel = channel.guild.channels.cache.get(process.env.LOGS_CHANNEL);
    if (!logchannel) {
      console.warn(`Log channel not found in guild ${channel.guild.id}`);
      return;
    }

    const embed = new Discord.EmbedBuilder()
      .setTitle(`Channel Deleted: #${channel.name}`)
      .addFields(
        { name: `ID`, value: `${channel.id}`}
      )
      .setColor("Red");

    await logchannel.send({ embeds: [embed] });
  }
};