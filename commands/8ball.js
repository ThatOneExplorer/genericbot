const {prefix} = require("../config.json")
require('dotenv').config();
const Discord = require('discord.js');
const ownerID = process.env.OWNERID_ID
module.exports = {
	name: '8ball',
	description: 'The bots invite link',
	async execute(messageCreate) { 
    try{
const args = (messageCreate.content.slice(prefix.length).trim().split(/ +/g))

const ballmessage = args.slice(1).join(' ');
const answers = [
        "Yes",
        "No",
        "Mabye",
        "Definetly",
        "Nope",
        "Ask again..."
        ]
         
        const random = answers[Math.floor (Math.random() * answers.length) ]
        
        let noquestionembed = new Discord.EmbedBuilder()
        .setColor('Blue')
        .setTitle(`${messageCreate.author.tag}, please ask me a question`)
        
        if(!ballmessage)  return messageCreate.channel.send({embeds: [noquestionembed]})
            let ballembed = new Discord.EmbedBuilder()
        .setTitle(`You have asked the 8 ball: "${ballmessage}"`)
        .setColor('Blue')
        .addFields(
          { name: `My reply is:`,   value:  `${random}`}
          )

        return messageCreate.reply({embeds: [ballembed]}) 
      } catch(e){
        console.log(e)
        let errorembed = new Discord.EmbedBuilder()
        .setTitle(`An error has occured!`)
        .setDescription(`An error has occured while trying to perform this action, the owner of this bot has been notified.`)
         .setColor("Red")
       await messageCreate.reply({embeds: [errorembed]})
       const owner = messageCreate.guild.members.cache.get(ownerID)
       return owner.user.send(`${e}`)
    }
    }
}