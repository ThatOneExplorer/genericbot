const Discord = require("discord.js")
const {ownerID} = require("../config.json")
module.exports = {
    name: "create",
    description: "creates an embed button given below",

    async execute(messageCreate){
        try{
        if(!messageCreate.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)){
            return;
        }
 
 let embed = new Discord.MessageEmbed()
.setTitle(`Continent`)
.setDescription(`Pick an option from dropdown below to get that continets role!`)
.setColor("BLUE")

const row = new Discord.MessageActionRow()

.addComponents(
    new Discord.MessageSelectMenu()
        .setCustomId('Continent')
        .setPlaceholder('Select a continent role!')
        .addOptions([
            {
                label: 'Europe',
                description: 'Clicking this will give you the Europe role',
                value: 'europe',
            },
            {
                label: 'Americas',
                description: 'Clicking this will give you the Americas role',
                value: 'americas',
            },
            {
                label: 'Oceania',
                description: 'Clicking this will give you the Oceania role',
                value: 'oceania',
            },
            {
               label: 'Africa',
               description: 'Clicking this will give you the Africa role',
               value: 'africa',
            },
            {
                label: 'Asia',
                description: 'Clicking this will give you the Asia role',
                value: 'asia'
            },
        ]),
);
messageCreate.channel.send({embeds: [embed], components: [row] });
        }catch(e){
            messageCreate.channel.send(`${e}`)
        console.log(e)
        }
    }
}