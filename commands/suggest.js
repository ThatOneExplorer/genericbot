const Discord = require("discord.js")
const {prefix} = require("../config.json")
const ownerID = process.env.OWNERID_ID
module.exports = {
    name: "suggest",
    description: "suggestion command",

    async execute(messageCreate){
try{
        const args = (messageCreate.content.slice(prefix.length).trim().split(/ +/g))

    if(!args[1]){
        let notype = new Discord.EmbedBuilder()
        .setTitle(`No suggestion type provided!`)
    .setDescription(`You need to provide a type of suggestion based on what suggestion you are giving! Available options are **server** or **bot**.`)
    .setFooter({text: `!suggest <type> <suggestion>`})
    .setColor("Red")
    return messageCreate.reply({embeds: [notype]})
    };

    let type = args[1].toLowerCase()

let suggestion = args.slice(2).join(" ")
if(!suggestion){
    let nosuggestion = new Discord.EmbedBuilder()
    .setTitle(`No suggestion provided!`)
    .setDescription(`Please provide a suggestion for the staff to review!`)
    .setColor("Red")
   return messageCreate.reply({embeds: [nosuggestion]})
}

let suggestions = messageCreate.guild.channels.cache.find(ch => ch.id === ("1219403495472631868"))

if(type === "server"){

   let suggestione = new Discord.EmbedBuilder()
    .setTitle(`New **${type}** suggestion!`)
    .setDescription(`${suggestion}`)
    .setFooter({text: `Submitted by ${messageCreate.author.tag} (${messageCreate.author.id})`})
     .setColor("Green")
     
await suggestions.send({embeds: [suggestione]})

let sent = new Discord.EmbedBuilder()
.setTitle(`Sent suggestion!`)
.setDescription(`Your suggestion has been sent for review! Please be patient while it's under review. You may get a response via dms in regards to your suggestion, please make sure your dms are on open!`)
.setColor("Green")
return messageCreate.reply({embeds: [sent]})
}

else if (type === "bot"){
    let suggestionb = new Discord.EmbedBuilder()
.setTitle(`New **${type}** suggestion!`)
.setDescription(`${suggestion}`)
.setFooter({text: `Submitted by ${messageCreate.author.tag} (${messageCreate.author.id})`})
 .setColor("Blurple")
 
await suggestions.send({embeds: [suggestionb]})

let sent = new Discord.EmbedBuilder()
.setTitle(`Sent suggestion!`)
.setDescription(`Your suggestion has been sent for review! Please be patient while it's under review. You may get a response via dms in regards to your suggestion, please make sure your dms are on open!`)
.setColor("Green")
return messageCreate.reply({embeds: [sent]})

}
if (type !== "server" || "bot"){

  let invalidtype = new Discord.EmbedBuilder()
  .setTitle(`Invalid type provided!`)
  .setDescription(`${args[1]} is not a valid suggestion type! Please choose from **server** or **bot**. `)
  .setColor("Red")

  messageCreate.reply({embeds: [invalidtype]})
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
