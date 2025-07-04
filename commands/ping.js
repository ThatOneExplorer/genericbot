const Discord = require("discord.js")
require('dotenv').config();
module.exports = {
name: "ping",
description: "returns ping to discord's API",

async execute(messageCreate){
try{
let ping = new Discord.EmbedBuilder()
.setTitle(`Pong!`)
.addFields(    
    {name: `Latency`, value: `${Date.now() - messageCreate.createdTimestamp}ms.`}
)

messageCreate.reply({embeds: [ping]})
} catch(e){
    console.log(e)
    let errorembed = new Discord.EmbedBuilder()
    .setTitle(`An error has occured!`)
    .setDescription(`An error has occured while trying to perform this action, the owner of this bot has been notified.`)
     .setColor("Red")
   await messageCreate.reply({embeds: [errorembed]})
 try {
    const owner = await messageCreate.guild.members.fetch(ownerID);
    if (owner && owner.user) {
        await owner.user.send(`${e}`);
    } else {
        console.warn("Owner not found or DMs unavailable.");
    }
} catch (err) {
    console.warn("Failed to send error to owner:", err);
}
}
}
}