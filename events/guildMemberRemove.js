const {membercount} = require("../utils/membercount")

require('dotenv').config;
module.exports = {
	name: 'guildMemberRemove',
	async execute(member, client) {
   await membercount(member, client)
    }

    }
