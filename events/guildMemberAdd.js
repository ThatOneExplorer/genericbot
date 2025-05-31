const moment = require("moment");
const Discord = require('discord.js');
require('dotenv').config();
const ownerID = process.env.OWNERID_ID;
const generic_server = process.env.GENERIC_SERVER;
const MEMBER_COUNT = process.env.MEMBER_COUNT;
const GENERAL_CHAT = process.env.GENERAL_CHAT;
const MEMBER_ROLE=process.env.MEMBER_ROLE;
const mongoose = require("mongoose")
const punishments = require("../models/ModSchema");
const messageCreate = require("./messageCreate");
module.exports = {
	name: 'guildMemberAdd',
	async execute(member){
		const server = member.client.guilds.cache.get(generic_server);
		const membercount = server.channels.cache.get(MEMBER_COUNT)
	await server.members.fetch()
	let membernum = server.memberCount
const currenttime = moment(Date.now()).format('DD/MM/YY');
membercount.setName(`Members: ${server.memberCount} `)
const generalchat = server.channels.cache.get(GENERAL_CHAT);
		try{
			console.log(`${member.user.tag} has just joined ${member.guild.name}`)
				let data = await punishments.findOne({
					GuildID: member.guild.id,
					UserID: member.id
				})
				if(data){
				console.log(`${member.user.tag} already has existing modlogs`)
				} else if (!data){
					console.log(`${member.user.tag} does not have existing modlogs`)
					let newData = new punishments({
				GuildID: member.guild.id,
				UserID: member.id,
					});
					await newData.save()
					console.log(`created database entry for ${member.user.tag}`);
				}
				
				const memberrole = member.guild.roles.cache.get(MEMBER_ROLE);
				member.roles.add(memberrole)
let welcome = new Discord.EmbedBuilder()
.setTitle(`Welcome ${member.user.tag}!`)
.setDescription(`
<#864306096624893979> - Rules channel **Please Read**
<#966732416154750976> - Important announcements regarding the server
<#864306096806428721> - The main chat for the server

If you require further assistance or have any questions. Feel free to get in touch with one of our staff members by sending this bot a DM!
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
	const owner = member.guild.members.cache.get(ownerID)
	owner.user.send(e)
}
    }
}