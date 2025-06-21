const Discord = require("discord.js");

module.exports = {
  name: 'channelCreate',
  async execute(channel) {
    const logchannel = channel.guild.channels.cache.get(process.env.LOGS_CHANNEL);
    if (!logchannel) {
      console.warn(`Log channel not found in guild ${channel.guild.id}`);
      return;
    }

    const embed = new Discord.EmbedBuilder()
      .setTitle(`Channel Created: #${channel.name}`)
      .addFields(
        { name: `ID`, value: `${channel.id}`},
        { name: `Created At`, value: `<t:${Math.floor(channel.createdTimestamp / 1000)}:F>`}
      )
      .setColor("Green");

    await logchannel.send({ embeds: [embed] });
  }
};