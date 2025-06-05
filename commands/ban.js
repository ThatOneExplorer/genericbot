const Discord = require("discord.js")
require('dotenv').config();
const mongoose = require("mongoose")
const punishments = require("../models/ModSchema");
const moment = require("moment");
const { prefix } = require("../config.json")
const ownerID = process.env.OWNERID_ID
module.exports ={
    name: "ban",
    description: "bans a mentioned user",
    async execute(messageCreate){
        try{
        const args = (messageCreate.content.slice(prefix.length).trim().split(/ +/g))
        const currenttime = moment(Date.now()).format('DD/MM/YY');
        if(!messageCreate.member.permissions.has(Discord.PermissionsBitField.Flags.BanMembers)){
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
        
        let member = messageCreate.mentions.members.first() || messageCreate.guild.members.cache.get(args[1])

        if(!member){
            let invalidmember = new Discord.EmbedBuilder()
            .setTitle(`Can't find member`)
            .setDescription(`Is the user in the guild? Does the user exist? I can't ban someone who isn't in the server :/`)
            .setColor("Red")
            return messageCreate.reply({embeds: [invalidmember]});
        }

        let reason = args.slice(2).join(" ")
        if(!reason){
            let noreason = new Discord.EmbedBuilder()
            .setTitle(`No reason provided`)
            .setDescription(`You need to provide a reason to ban them for :/`)
            .setColor("Red")
            return messageCreate.reply({embeds: [noreason]})
        }

        if(!member.bannable){
let notbannable = new Discord.EmbedBuilder()
.setTitle(`Can not ban this user`)
.setDescription(`This user could not be banned.`)
.setColor("Red")
 return messageCreate.reply({embeds: [notbannable]})
}
function generatePunishmentCode(length = 8) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters[randomIndex];
    }
    
    return code;
}

// Example Usage:
const punishmentCode = generatePunishmentCode(10); 
        let data =  await punishments.findOne({
            GuildID: messageCreate.guild.id,
            UserID: member.id
        })
    
        if(data){
        data.Punishments.unshift ({
            PunishmentType: 'Ban',
            Moderator: messageCreate.author.id,
            Reason: reason,
            Date: currenttime,
            ID: punishmentCode
        });
        data.save();
        }
        
        else if (!data){
            let newData = new punishments({
        GuildID: messageCreate.guild.id,
        UserID: member.id,
        Punishments : [{
        PunishmentType: 'Ban',
        Moderator: messageCreate.author.id,
        Reason: reason,
        Date: currenttime,
        ID: punishmentCode
        }, ],
            });
            newData.save();
        }

        let ban = new Discord.EmbedBuilder()
        .setTitle(`Successfully issued **BAN** to ${member.user.username}`)
        .addFields(
            { name: 'Moderator', value: `${messageCreate.author.tag}`, inline: true }, { name: 'Reason', value: `${reason}`, inline: true },
        )        
        .setColor("Green")
     
    messageCreate.reply({embeds: [ban]})
    let bandm = new Discord.EmbedBuilder()
    .setTitle(`You have been **BANNED** from ${messageCreate.guild.name}!`)
    .addFields(
        { name: 'Moderator', value: `${messageCreate.author.tag}`, inline: true }, { name: 'Reason', value: `${reason}`, inline: true },
    )
.setFooter({text: `Punishment ID: ${punishmentCode}`})
    await member.send({embeds: [bandm]}).catch(e => {messageCreate.channel.send(`Error occured while trying to dm ${member.username}: ${e}`)})
    member.ban({reason:`${reason}`});
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