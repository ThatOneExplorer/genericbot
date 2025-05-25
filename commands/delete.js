const Discord = require("discord.js")
require('dotenv').config();
const mongoose = require("mongoose")
const punishments = require("../models/ModSchema");
const {prefix} = require("../config.json")
const ownerID = process.env.OWNERID_ID
module.exports = {
    name: "delete",
    description: "deletes a modlog entry",
    permission: "Discord.Permissions.FLAGS.KICK_MEMBERS",

    async execute(messageCreate){
try{
    const args = (messageCreate.content.slice(prefix.length).trim().split(/ +/g))
    let member = messageCreate.mentions.users.first() || messageCreate.guild.members.cache.get(args[1]) || args[1]

         if(!messageCreate.member.permissions.has(Discord.PermissionsBitField.Flags.KickMembers)){
        let nopermission = new Discord.EmbedBuilder()
        .setTitle(`Uh oh!`)
        .setDescription(`You do not have the permission to execute this command. This incident will be reported!`)
        .setColor("Red")
        return messageCreate.reply({embeds: [nopermission]});
         }
   if(!args[1]){
                   let nomember = new Discord.EmbedBuilder()
                       .setTitle(`No member provided`)
                       .setDescription(`You need to mention a user or provide an ID to perform this action!`)
                       .setColor("Red")
                      return messageCreate.reply({embeds: [nomember]})
               }
       let data =  await punishments.findOne({
           GuildID: messageCreate.guild.id,
           UserID: member.id || args[1],
       })
       if(!data){
           let invalidmember = new Discord.EmbedBuilder()
           .setTitle(`Can't find member`)
           .setDescription(`Is the user in the guild? Does the user exist?`)
           .setColor("Red")
           return messageCreate.reply({embeds: [invalidmember]});
       }
       
    if (!data.Punishments || data.Punishments.length === 0) {
        let nomodlogs = new Discord.EmbedBuilder()
            .setTitle(`No modlogs found!`)
            .setDescription(`Modlogs could not be found for ${member.username}`)
            .setColor("Green");
        return messageCreate.reply({ embeds: [nomodlogs] });
    }


if (!args[2]){
    let noid = new Discord.EmbedBuilder()
        .setTitle(`No ID provided`)
        .setDescription(`Please provide an ID to delete.`)
        .setColor("Red")
    return messageCreate.reply({embeds: [noid]})
}

const punishmentID = args[2];

    if(punishmentID.toLowerCase() === "all"){
        await punishments.updateOne(
            { GuildID: messageCreate.guild.id, UserID: member.id },
            { $unset: { Punishments: "" } }
        );

        let deleteall = new Discord.EmbedBuilder()
            .setTitle(`Punishments removed`)
            .setDescription(`All punishments for ${member.username} have been removed.`)
            .setColor("Green")
       return messageCreate.reply({embeds: [deleteall]})
    }


// Find the punishment entry
let punishmentIndex = data.Punishments.findIndex(p => p.ID === punishmentID);

if (punishmentIndex === -1) {
    return messageCreate.channel.send({
        embeds: [
            new Discord.EmbedBuilder()
                .setTitle("Punishment Not Found")
                .setDescription(`No punishment with ID **${punishmentID}** found.`)
                .setColor("Red"),
        ],
    });
}

// Remove the punishment from the array
data.Punishments.splice(punishmentIndex, 1);

// Save the updated data back to the database
await punishments.updateOne(
    { GuildID: messageCreate.guild.id, UserID: member.id },
    { $set: { Punishments: data.Punishments } }
);
let punishmentremoved = new Discord.EmbedBuilder()
.setTitle(`Punishment removed for ${member.username}!`)
.setDescription(`The punishment ${punishmentID} has been removed from the users modlogs.`)
messageCreate.reply({
    embeds: [punishmentremoved]
    
});
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