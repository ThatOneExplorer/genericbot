const Discord = require("discord.js")

module.exports = {
  name: 'channelUpdate',
  async execute(oldChannel, newChannel) {
    const logchannel = newChannel.guild.channels.cache.get(process.env.LOGS_CHANNEL);
    if (!logchannel) {
      console.warn(`Log channel not found in guild ${newChannel.guild.id}`);
      return;
    }

    const changes = [];
    if (oldChannel.name !== newChannel.name) {
      changes.push({ name: "Name Change", value: `\`${oldChannel.name}\` ➜ \`${newChannel.name}\`` });
    }
    if ('topic' in oldChannel && oldChannel.topic !== newChannel.topic) {
      changes.push({ name: "Topic Change", value: `\`${oldChannel.topic || "None"}\` ➜ \`${newChannel.topic || "None"}\`` });
    }

    if (changes.length === 0) return;

    const embed = new Discord.EmbedBuilder()
      .setTitle(`Channel Updated: #${newChannel.name}`)
      .addFields(changes)
      .setColor("Yellow");

    await logchannel.send({ embeds: [embed] });
  }
};
