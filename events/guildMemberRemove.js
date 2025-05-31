const Discord = require('discord.js');
require('dotenv').config;
const ownerID = process.env.OWNERID_ID;
const generic_server = process.env.GENERIC_SERVER;
const MEMBER_COUNT = process.env.MEMBER_COUNT;
const GENERAL_CHAT = process.env.GENERAL_CHAT;
const MEMBER_ROLE=process.env.MEMBER_ROLE;
module.exports = {
	name: 'guildMemberRemove',
	async execute(member) {
try{
    console.log(`${member.user.tag} has left ${member.guild.name}`)
        const server = member.client.guilds.cache.get(generic_server);
        const membercount = server.channels.cache.get(MEMBER_COUNT);
    await server.members.fetch()
    let membernum = server.memberCount
        membercount.setName(`Members: ${server.memberCount} `)
        const generalchat = server.channels.cache.get(GENERAL_CHAT);
        generalchat.send(`<@${member.id}> has just left the server :(`).catch(e => console.log(e))
    } catch(e){
        console.log(e)
        let errorembed = new Discord.EmbedBuilder()
        .setTitle(`An error has occured!`)
        .setDescription(`An error has occured while trying to perform this action, the owner of this bot has been notified.`)
         .setColor("Red")
       await messageCreate.reply({embeds: [errorembed]})
       const owner = messageCreate.guild.members.cache.get(ownerID)
       return owner.user.send(`${e}`)
    }

    }
}