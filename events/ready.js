const packageJSON = require("../package.json");
const Discord = require('discord.js')
const { prefix } = require("../config.json")
const ownerID = process.env.OWNERID_ID
const punishments = require("../models/ModSchema");
const moment = require ("moment")
const currenttime = moment(Date.now()).format('DD/MM/YY HH:mm:ss');
module.exports = {
	name: 'ready',
	async execute(client, messageCreate) {
	const server = await client.guilds.cache.find(g => g.id == "864306095388229632");
	const owner = server.members.cache.get(ownerID)
	try{
	let guilds = client.guilds.cache.map(guild => "Guild name" +  "    " + "     " + guild.name + "    " + "     " + `Guild id` +  "    " + "     " + guild.id)
	console.log(guilds)
	const membercount = await server.channels.cache.find(ch => ch.id === '864306096004399148');
const discordJSVersion = packageJSON.dependencies["discord.js"];
await server.members.fetch()
let membernum = server.memberCount
    membercount.setName(`Members: ${membernum}`)
client.user.setActivity(`Slava generic! My prefix is ${prefix}`)
console.log(`Connected to discord, Successfully logged as ${client.user.username}, Runtime Enviorement Version (Node)${process.version} using discord.js version: ${discordJSVersion}`)
await server.members.fetch(); // Fetch all members to ensure they're cached

const members = server.members.cache.filter(member => !member.user.bot); // Ignore bots

for (const member of members.values()) {
	let data = await punishments.findOne({
		GuildID: server.id,
		UserID: member.id
	});
   if(data){
	console.log(`${member.user.tag} already has existing modlog`)
   }
	if (!data) {
		await punishments.create({
			GuildID: server.id,
			UserID: member.id,
			Punishments: [] // Initialize with an empty array
		});
		console.log(`Initialized modlog for ${member.user.tag}`);
	}
}
console.log("All members initialized in modlog!");
let readyembed = new Discord.EmbedBuilder()
.setTitle(`Bot initialised and ready!`)
.setColor("Green")
.setFooter({text: `${currenttime}`})
let readychannel = server.channels.cache.find(ch => ch.id == "1355718490673119355")
readychannel.send({embeds: [readyembed]})
		} catch(e){
			console.log(e)
            owner.send(`${e}`)
		}
    }
}