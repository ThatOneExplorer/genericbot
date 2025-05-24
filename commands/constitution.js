const Discord = require("discord.js")
const ownerID = process.env.OWNERID_ID
const { discordSort } = require("discord.js");
module.exports = {
	name: 'constitution',
	description: 'creates a constitution list',

	async execute(messageCreate) { 
        try{
        let list = new Discord.EmbedBuilder()
        .setTitle(`Please select a option from the box below!`)
        .setFooter({text: `Click the article you wish to view of the Constitution of the Generic Nation`})
         .setColor("Green")
     
        const row = new Discord.ActionRowBuilder()
                 .addComponents(
                     new Discord.StringSelectMenuBuilder()
                         .setCustomId('constitutionlist')
                         .setPlaceholder('Select a command group by clicking this button!')
                         .addOptions([
                             {
                                 label: 'Article 1 (The Nation)',
                                 description: 'Click here to view Article 1 of the Constitution of the Generic Nation',
                                 value: 'A1',
                             },
                             {
                                 label: 'Article 2 (The Government)',
                                 description: 'Click here to view Article 2 of the Constitution of the Generic Nation',
                                 value: 'A2',
                             },
                             {
                                 label: 'Article 3 (The First Generic Faith)',
                                 description: 'Click here to view Article 3 of the Constitution of the Generic Nation',
                                 value: 'A3',
                             },
                             {
                                 label: 'Article 4 (The Rights Of Citzens)',
                                 description: 'Click here to view Article 4 of the Constitution of the Generic Nation',
                                 value: 'A4',
                             },
                             {
                                label: 'Article 5 (The Wrongs Of Citizens)',
                                description: 'Click here to view Article 5 of the Constitution of the Generic Nation',
                                value: 'A5',
                             },
                             {
                                label: 'Article 6 (The Law Courts)',
                                description: 'Click here to view Article 6 of the Constitution of the Generic Nation',
                                value: 'A6',
                             },

                         ]),    
                 );
                // messageCreate.reply({embeds: [list], components: [row]})
                
                let constembed = new Discord.EmbedBuilder()
                .setTitle(`THE CONSTITUTION OF THE ETERNAL AND SOVEREIGN GENERIC NATION`)
                .setURL(`https://docs.google.com/document/d/1USHg468qcpwbGCwhJ1bElw45bXyzLEtLsqqAX3fkti8/edit?usp=sharing`)

                messageCreate.reply({embeds: [constembed]})
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