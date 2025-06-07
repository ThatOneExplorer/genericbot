const moment = require("moment");
require('dotenv').config();

const MEMBER_COUNT = process.env.MEMBER_COUNT;
const GENERIC_SERVER = process.env.GENERIC_SERVER;
const OWNERID_ID = process.env.OWNERID_ID;

async function membercount(client, member) {
	try {
		const server = client.guilds.cache.get(GENERIC_SERVER);
		if (!server) throw new Error("Server not found");

		await server.members.fetch();

		const memberCountChannel = server.channels.cache.get(MEMBER_COUNT);
		if (!memberCountChannel) {
			throw new Error("Invalid member count channel");
		}

		const memberCount = server.memberCount;
		const currentTime = moment(Date.now()).format('DD/MM/YY');
		await memberCountChannel.setName(`Members: ${memberCount}`);

	} catch (error) {
		console.error("Error updating member count:", error);
		try {
			const owner = await client.users.fetch(OWNERID_ID);
			await owner.send(`Error in membercount.js: \`\`\`${error.message}\`\`\``);
		} catch (dmErr) {
			console.warn("Couldn't DM owner:", dmErr);
		}
	}
}

module.exports = { membercount };
