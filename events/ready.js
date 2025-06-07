const packageJSON = require("../package.json");
const Discord = require('discord.js')
const { prefix } = require("../config.json")
const ownerID = process.env.OWNERID_ID
const moment = require ("moment")
const currenttime = moment(Date.now()).format('DD/MM/YY HH:mm:ss');
const generic_server = process.env.GENERIC_SERVER
const member_count = process.env.MEMBER_COUNT
const ready_channel = process.env.READY_CHANNEL
const {modlogall} = require ("../utils/modlogall.js");
const {membercount} = require("../utils/membercount.js");
const {checkmc} = require ("../utils/checkmc.js");
module.exports = {
	name: 'ready',
	once: true,

	async execute(client) {
		const server = await client.guilds.cache.get(generic_server);
		if(!server){
			return console.log(`Server not found`)
		}
		try{
			let guilds = client.guilds.cache.map(guild => "Guild name" +  "    " + "     " + guild.name + "    " + "     " + `Guild id` +  "    " + "     " + guild.id)
			console.log(guilds)
			const discordJSVersion = packageJSON.dependencies["discord.js"];
			client.user.setActivity(`Slava generic! My prefix is ${prefix}`)
			console.log(`Connected to discord, Successfully logged as ${client.user.username}, Runtime Enviorement Version (Node)${process.version} using discord.js version: ${discordJSVersion}`)
		    await membercount(client);
			await modlogall(client);

			let readyembed = new Discord.EmbedBuilder()
				.setTitle(`Bot initialised and ready!`)
				.setColor("Green")
				.setFooter({text: `${currenttime}`})
			let readychannel = server.channels.cache.get(ready_channel)
			readychannel.send({embeds: [readyembed]});

			await checkmc(client)
          setInterval(() => {
			  checkmc(client);
		  }, 300000);

		} catch(e){
		console.error(e);
	try {
		const owner = await client.users.fetch(ownerID);
		if (owner) {
			await owner.send(`Error in ready event: \`\`\`${e}\`\`\``);
		}
	} catch (dmErr) {
		console.warn("Couldn't DM owner:", dmErr);
	}
		}
	}
}
