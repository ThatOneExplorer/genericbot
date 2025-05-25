const Discord = require("discord.js")
require('dotenv').config();
const ownerID = process.env.OWNERID_ID
module.exports = {
    name: "help",
    description: "implements discord.js v13 select menu for a help command",

    async execute(messageCreate){
try{
   let help = new Discord.EmbedBuilder()
   .setTitle(`Please select a option from the box below!`)
   .setFooter({text: `Click the "Select Help" button attached to this embed, and select the category you want help with!`})
    .setColor("Green")

   const row = new Discord.ActionRowBuilder()
			.addComponents(
				new Discord.StringSelectMenuBuilder()
					.setCustomId('Help')
					.setPlaceholder('Select a command group by clicking this button!')
					.addOptions([
						{
							label: 'Moderation',
							description: 'Clicking this will give you a list of Moderation commands! (Only usable by staff members)',
							value: 'first_option',
						},
						{
							label: 'Fun',
							description: 'Clicking this will give you a list of Fun commands!',
							value: 'second_option',
						},
						{
							label: 'Misc',
							description: 'Clicking this will give you a list of Misc commands!',
							value: 'third_option',
						},
						{
							label: 'Support',
							description: 'Clicking this will give you info on the Support feature!',
							value: 'fourth_option',
						},
					]),
			);
            messageCreate.reply({embeds: [help], components: [row]})
		} catch(e){
			console.log(e)
			let errorembed = new Discord.EmbedBuilder()
			.setTitle(`An error has occured!`)
			.setDescription(`An error has occured while trying to perform this action, the owner of this bot has been notified.`)
			 .setColor("Red")
		   await messageCreate.reply({embeds: [errorembed]})
		   const owner = messageCreate.guild.members.cache.get(ownerID)
		   return owner.send(`${e}`)
		}		
    }
}