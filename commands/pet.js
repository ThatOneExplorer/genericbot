const Discord = require("discord.js");
const ownerID = process.env.OWNERID_ID
module.exports = {
    name: "pet",
    description: "pets a user :3",
    async execute(messageCreate){
        try{
        let member = messageCreate.mentions.users.first();
        let list= [
            "pet's",
            "slides over and pets",
            "gives a head-pat to",
            "head-pats",
            "brutally touches and traumatises"
        ]
        const random = list[Math.floor (Math.random() * list.length) ]
        let emotelist= [
            "OwO",
            "UwU",
            ">.<",
            ":3",
        ]
        const randomemote = emotelist[Math.floor (Math.random() * emotelist.length) ]
        if(!member){
            return messageCreate.channel.send({content: "Who do you want to pet?"})
        }
        else if(member){
            return messageCreate.channel.send({content: `<@${messageCreate.author.id}> ${random} <@${member.id}> ${randomemote}`})
        }
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