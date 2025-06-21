const {membercount} = require("../utils/membercount")

require('dotenv').config;
module.exports = {
	name: 'guildMemberRemove',
	async execute(member, client) {
   await membercount(member, client)

    const LOGS_CHANNEL = process.env.LOGS_CHANNEL
         let logchannel = messageDelete.guild.channels.cache.get(LOGS_CHANNEL)
           let memberremove = new Discord.EmbedBuilder()
             .setTitle(`Member left: ${member.user.tag}`)
             .addFields(
               { name: `Member left`, value: `${member.content}`},
               {name: `Message by`, value: `${member.author}`},
               {name: `Link:`, value: `${member.url}`}
             )
             .setColor("Green")
             .setThumbnail(member.user.displayAvatarURL({ dynamic: true }));
       if (!logchannel) {
         console.warn(`Log channel with ID ${LOG_CHANNEL} not found in guild ${member.guild.id}`);
         return; 
       }
           await logchannel.send({embeds: [memberremove] });
    }
    }
