const ownerID = process.env.OWNERID_ID
const punishments = require("../models/ModSchema");
const moment = require ("moment")

const generic_server = process.env.GENERIC_SERVER


	async function modlogall(client) {
		const server = await client.guilds.cache.get(generic_server);
		if(!server){
			return console.log(`Server not found`)
		}
		const owner = server.members.cache.get(ownerID)
		try{
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
		} catch(e){
			console.log(e)
			owner.send(`${e}`)
		}
	}
module.exports = {modlogall}
