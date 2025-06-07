
require('dotenv').config();
const {helpmenu} = require ("../utils/helpmenu")
module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {
        console.log(`Recieved interaction in ${interaction.guild.name}`)
        if (interaction.customId === 'Help'){
            await helpmenu(interaction)
        }
    }
}

