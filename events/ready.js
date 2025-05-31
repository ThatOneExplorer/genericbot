const packageJSON = require("../package.json");
const Discord = require('discord.js')
const { prefix } = require("../config.json")
const ownerID = process.env.OWNERID_ID
const punishments = require("../models/ModSchema");
const moment = require ("moment")
const currenttime = moment(Date.now()).format('DD/MM/YY HH:mm:ss');
const generic_server = process.env.GENERIC_SERVER
const member_count = process.env.MEMBER_COUNT
const ready_channel = process.env.READY_CHANNEL
const MINECRAFT_HOST = process.env.MINECRAFT_HOST
const MINECRAFT_STATUS = process.env.MINECRAFT_STATUS
const MINECRAFT_PLAYER_COUNT = process.env.MINECRAFT_PLAYER_COUNT
const mcs = require("node-mcstatus")

module.exports = {
	name: 'ready',
	once: true,

	async execute(client) {
		const server = await client.guilds.cache.get(generic_server);
		if(!server){
			return console.log(`Server not found`)
		}
		const owner = server.members.cache.get(ownerID)
		try{
			let guilds = client.guilds.cache.map(guild => "Guild name" +  "    " + "     " + guild.name + "    " + "     " + `Guild id` +  "    " + "     " + guild.id)
			console.log(guilds)
			const membercount = await server.channels.cache.get(member_count);
			const discordJSVersion = packageJSON.dependencies["discord.js"];
			await server.members.fetch()
			let membernum = server.memberCount
			membercount.setName(`Members: ${membernum}`)
			client.user.setActivity(`Slava generic! My prefix is ${prefix}`)
			console.log(`Connected to discord, Successfully logged as ${client.user.username}, Runtime Enviorement Version (Node)${process.version} using discord.js version: ${discordJSVersion}`)
			await server.members.fetch();

			const members = server.members.cache.filter(member => !member.user.bot);

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
						Punishments: []
					});
					console.log(`Initialized modlog for ${member.user.tag}`);
				}
			}
			console.log("All members initialized in modlog!");
			let readyembed = new Discord.EmbedBuilder()
				.setTitle(`Bot initialised and ready!`)
				.setColor("Green")
				.setFooter({text: `${currenttime}`})
			let readychannel = server.channels.cache.get(ready_channel)
			readychannel.send({embeds: [readyembed]})

			

			async function checkMCStatus() {
	try {
		const result = await mcs.statusJava(MINECRAFT_HOST);
		let STATUS = client.channels.cache.get(MINECRAFT_STATUS);
		let PLAYER_COUNT = client.channels.cache.get(MINECRAFT_PLAYER_COUNT);
        console.log(result)
		if (result.online == false ) {
			if (STATUS) await STATUS.setName(`Server Status: Offline 🔴`);
			if (PLAYER_COUNT) await PLAYER_COUNT.setName(`Player Count: Unavailable`);
			return;
		}

		if (PLAYER_COUNT) await PLAYER_COUNT.setName(`Player Count: ${result.players.online} / ${result.players.max}`);
		if (STATUS) await STATUS.setName(`Server Status: Online 🟢`);
	} catch (error) {
		console.error("Error checking MC server status:", error);
		try {
			const owner = await server.members.fetch(ownerID).catch(() => null);
			if (owner) await owner.user.send(`Error checking MC server status: ${error}`).catch(() => {});
		} catch (e) {
			console.error("Failed to notify owner about MC status error:", e);
		}
	}
}


			// Run once immediately on ready
			checkMCStatus();

			// Run every 5 minutes
			setInterval(checkMCStatus, 300000);

		} catch(e){
			console.log(e)
			owner.send(`${e}`)
		}
	}
}
