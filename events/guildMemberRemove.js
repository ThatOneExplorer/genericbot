const Discord = require('discord.js')
const ownerID = process.env.OWNERID_ID
require('dotenv').config();
const generic_server = process.env.GENERIC_SERVER
module.exports = {
	name: 'guildMemberRemove',
	async execute(member) {
try{
    console.log(`${member.user.tag} has left ${member.guild.name}`)
        const server = member.client.guilds.cache.find(g => g.id === generic_server);
        const membercount = server.channels.cache.find(ch => ch.id === '864306096004399148');
    await server.members.fetch()
    let membernum = server.memberCount
        membercount.setName(`Members: ${server.memberCount} `)
        const generalchat = server.channels.cache.find(ch => ch.id === '864306096806428721');
        generalchat.send(`<@${member.id}> has just left the server :(`).catch(e => console.log(e))
    } catch(e){
        console.log(e)
        let errorembed = new Discord.EmbedBuilder()
        .setTitle(`An error has occured!`)
        .setDescription(`An error has occured while trying to perform this action, the owner of this bot has been notified.`)
         .setColor("Red")
       await messageCreate.reply({embeds: [errorembed]})
       const owner = messageCreate.guild.members.cache.get(ownerID)
       return owner.send(`${e}`)
    }

    }
}