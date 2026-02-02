require('dotenv').config();
const ownerID = process.env.OWNERID_ID;
const generic_server = process.env.GENERIC_SERVER
const mongoose = require("mongoose");
const Economy = require("../models/econschema");

async function checkecon(client, member) {
    const server = await  client.guilds.cache.get(generic_server);
		if(!server){
			return console.log(`Server not found`)
		}
		const owner = server.members.cache.get(ownerID)
    try {
        const members = server.members.cache.filter(member => !member.user.bot);

			for (const member of members.values()) {
        let data = await Economy.findOne({
            GuildID: member.guild.id,
            UserID: member.id
        });

        if (data) {
            console.log(`${member.user.tag} already has an economy profile.`);
        } else {
            console.log(`${member.user.tag} does NOT have an economy profile.`);
            
             let newData = new Economy({
                GuildID: member.guild.id,
                UserID: member.id,
                balance: {
                    pounds: 0,
                    shillings: 0,
                    pence: 0
                },
                econStats: []
            });

            await newData.save();
            console.log(`Created economy entry for ${member.user.tag}`);
        }
    }
    } catch (e) {
        console.log(e);
        const owner = member.guild.members.cache.get(ownerID);
        owner?.send(e.toString());
    }
}

module.exports = { checkecon };
