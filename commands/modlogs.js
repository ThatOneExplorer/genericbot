const Discord = require("discord.js")
const mongoose = require("mongoose")
const punishments = require("../models/ModSchema");
const {prefix} = require("../config.json")
const ownerID = process.env.OWNERID_ID
module.exports = {
    name: "modlogs",
    description: "gets modlogs of a user",
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
        
    else if (data) {
        const modloguser = messageCreate.guild.members.cache.get(`${data.UserID}`);
        let embeds = [];
        let modlogembed = new Discord.EmbedBuilder()
            .setTitle(`Modlogs retrieved for (${data.UserID})`)
            .setTimestamp();
    
        let charCount = 0;
        let fieldCount = 0;
    
        let punishments = data.Punishments;
        punishments.forEach((Punishments) => {
            let fieldName = Punishments.PunishmentType || "Unknown Punishment";   
            let fieldValue = `**Reason:** ${Punishments.Reason || "No reason provided."}`;
    
            // Check if adding this field exceeds the limits
            if (charCount + fieldName.length + fieldValue.length > 5900 || fieldCount >= 25) {
                embeds.push(modlogembed);  // Push the current embed
                modlogembed = new Discord.EmbedBuilder()
                    .setTitle(`Modlogs retrieved for ${modloguser.user.tag} (${data.UserID})`)
                    .setTimestamp();
                charCount = 0;
                fieldCount = 0;
            }
    
            // Add the field
            modlogembed.addFields({ name: `**Date:** (${Punishments.Date}) **Type:** (${fieldName}) **ID:** (${Punishments.ID})`, value: fieldValue, inline: false });
            fieldCount++;
        });
        // Push the last embed if needed
        embeds.push(modlogembed);
    
        // Send all embeds
        for (const embed of embeds) {
            await messageCreate.reply({ embeds: [embed] });
        }
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
    