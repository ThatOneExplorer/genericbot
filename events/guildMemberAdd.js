const { membercount } = require("../utils/membercount.js")
const { checkmodlog } = require ("../utils/checkmodlog.js")
const { welcome } = require ("../utils/welcome")
const Discord = require("discord.js")
module.exports = {
	name: 'guildMemberAdd',
	async execute(member){
		await membercount(member.client, member);
		await checkmodlog(member);
		await welcome(member);

		const LOGS_CHANNEL = process.env.LOGS_CHANNEL
		let logchannel = member.guild.channels.cache.get(LOGS_CHANNEL)

		const createdAt = member.user.createdAt;
		const now = new Date();
		const diff = now - createdAt;
		const age = msToTime(diff);

		function msToTime(duration) {
			const years = Math.floor(duration / (1000 * 60 * 60 * 24 * 365));
			const months = Math.floor((duration % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
			const days = Math.floor((duration % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));

			let result = "";
			if (years) result += `${years}y `;
			if (months) result += `${months}mo `;
			if (days) result += `${days}d`;

			return result.trim() || "0d";
		}
		
let isbot = member.user.bot
		let newmember = new Discord.EmbedBuilder()
			.setTitle(`Member joined: ${member.user.tag}`)
			.addFields(
				{ name: `Created at:`, value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:F>`},
				{ name: `Account age:`, value: `${age}`},
				{ name: `Joined at:`, value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>`},
				{name: `Bot?`, value: `${isbot}`}, 
			)
			.setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
			.setColor("Green");
if (!logchannel) {
  console.warn(`Log channel with ID ${LOG_CHANNEL} not found in guild ${member.guild.id}`);
  return; 
}
		await logchannel.send({embeds: [newmember] });
	}
}