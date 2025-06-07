const { membercount } = require("../utils/membercount.js")
const { checkmodlog } = require ("../utils/checkmodlog.js")
const { welcome } = require ("../utils/welcome")
module.exports = {
	name: 'guildMemberAdd',
	async execute(member){
		await membercount(member)
		await checkmodlog(member)
		await welcome(member)
}
    }
