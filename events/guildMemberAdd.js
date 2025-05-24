const moment = require("moment")
const Discord = require('discord.js')
const {ownerID} = require("../config.json")
const mongoose = require("mongoose")
const punishments = require("../models/ModSchema");
module.exports = {
	name: 'guildMemberAdd',
	async execute(member){
		const server = member.client.guilds.cache.find(g => g.id ==="864306095388229632");
		const membercount = server.channels.cache.find(ch => ch.id === '864306096004399148');
	await server.members.fetch()
	let membernum = server.memberCount
const currenttime = moment(Date.now()).format('DD/MM/YY');
membercount.setName(`Members: ${server.memberCount} `)
const generalchat = server.channels.cache.find(ch => ch.id === '864306096806428721');
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
				let roleid = "864306095416541192"
				const memberrole = member.guild.roles.cache.find(role => role.id === roleid);
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
}
    }
}