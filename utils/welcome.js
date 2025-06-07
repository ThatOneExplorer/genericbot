const moment = require("moment");
const Discord = require('discord.js');
require('dotenv').config();
const generic_server = process.env.GENERIC_SERVER;
const GENERAL_CHAT = process.env.GENERAL_CHAT;
const MEMBER_ROLE=process.env.MEMBER_ROLE;
const currenttime = moment(Date.now()).format('DD/MM/YY HH:mm:ss');
    async function welcome(member){
      try{
	const server = member.client.guilds.cache.get(generic_server);
    const generalchat = server.channels.cache.get(GENERAL_CHAT)
                const memberrole = member.guild.roles.cache.get(MEMBER_ROLE);
                member.roles.add(memberrole)
let welcome = new Discord.EmbedBuilder()
.setTitle(`Welcome ${member.user.tag}!`)
.setDescription(`
<#864306096624893979> - Rules channel **Please Read**
<#966732416154750976> - Important announcements regarding the server
<#${GENERAL_CHAT}> - The main chat for the server

If you require further assistance or have any questions. Feel free to get in touch with one of our staff members by sending a message in this DM channel!
`)
.setFooter({text: `Joined on ${currenttime}, Join Position: ${server.memberCount}`})
.setImage(`https://media.discordapp.net/attachments/1157399937932333178/1220125895881396224/makesweet-pd91dt.gif?ex=6776600a&is=67750e8a&hm=6d08ef4993668917e0527223b105a9f4377f99df9ee771ab6444b6058330dbd8&`)

let welcomemain = new Discord.EmbedBuilder()
.setTitle(`${member.user.tag} has just joined the server!`)
.setDescription(`Welcome to ${member.guild.name}! Please feel free to DM any staff member if you need help with anything!`)
.setFooter({text: `Joined on ${currenttime}, Join Position: ${server.memberCount}`})
.setThumbnail(`https://media.discordapp.net/attachments/1157399937932333178/1220125895881396224/makesweet-pd91dt.gif?ex=6776600a&is=67750e8a&hm=6d08ef4993668917e0527223b105a9f4377f99df9ee771ab6444b6058330dbd8&`)

    await member.send({embeds: [welcome]})
generalchat.send({content: `<@${member.id}> has just joined the server!`, embeds:[welcomemain]}).catch(e => console.log(e))
} catch(e){
    console.log(e)
    const ownerID = process.env.OWNERID_ID;
    const owner = member.guild.members.cache.get(ownerID)
  await owner.send(`${e}`) 

}
    }
    
module.exports = {welcome}