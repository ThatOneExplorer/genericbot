const Discord = require("discord.js")
require('dotenv').config();
const mongoose = require("mongoose")
const punishments = require("../models/ModSchema");
const moment = require("moment");
const { prefix } = require("../config.json")
const ownerID = process.env.OWNERID_ID
const MUTE_ROLE = process.env.MUTE_ROLE
const ms = require("ms");
module.exports ={
    name: "mute",
    description: "mute a mentioned user",
    async execute(messageCreate){
        try{
        const args = (messageCreate.content.slice(prefix.length).trim().split(/ +/g))
        const currenttime = moment(Date.now()).format('DD/MM/YY');
        if(!messageCreate.member.permissions.has(Discord.PermissionsBitField.Flags.ManageMessages)){
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
            .setDescription(`Is the user in the guild? Does the user exist? I can't mute someone who isn't in the server :/`)
            .setColor("Red")
            return messageCreate.reply({embeds: [invalidmember]});
        }

        let time = args[2]
        if(!time){
            let invalidtime = new Discord.EmbedBuilder()
            .setTitle(`No time provided`)
            .setDescription(`You need to provide a time to mute them for, E.g 30m = 30 minutes`)
            .setColor("Red")
            return messageCreate.reply({embeds: [invalidtime]})
        }
        let reason = args.slice(3).join(" ")

        if(!reason){
            let noreason = new Discord.EmbedBuilder()
            .setTitle(`No reason provided`)
            .setDescription(`You need to provide a reason to mute them for :/`)
            .setColor("Red")
            return messageCreate.reply({embeds: [noreason]})
        }

        const muterole = messageCreate.guild.roles.cache.get(MUTE_ROLE);
        if(!muterole){
            let norole = new Discord.EmbedBuilder()
            .setTitle(`No mute role found!`)
            .setDescription(`The mute role was not found. Please contact a server administrator / owner if this error occurs.`)
            .setFooter({text: `Tried to find role with id: ${roleid}`})
            .setColor("Red")
            messageCreate.reply({embeds: [norole]})
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
            PunishmentType: 'Mute',
            Moderator: messageCreate.author.id,
            Time: time,
            Reason: reason,
            Date: currenttime,
            ID: punishmentCode
        });
        data.save();
        } else if (!data){
            let newData = new punishments({
        GuildID: messageCreate.guild.id,
        UserID: member.id,
        Punishments : [{
        PunishmentType: 'Mute',
        Moderator: messageCreate.author.id,
        Time: time,
        Reason: reason,
        Date: currenttime,
        ID: punishmentCode
        }, ],
            });
            newData.save();
        }

        let mute = new Discord.EmbedBuilder()
        .setTitle(`Successfully issued **MUTE** to ${member.user.username} for ${time}`)
        .addFields(
            { name: 'Moderator', value: `${messageCreate.author.tag}`, inline: true }, { name: 'Reason', value: `${reason}`, inline: true },
        )
     .setColor("Green")
    messageCreate.reply({embeds: [mute]})
    let mutedm = new Discord.EmbedBuilder()
    .setTitle(`You have been **MUTED** in ${messageCreate.guild.name} for ${time}!`)
    .addFields(
        { name: 'Moderator', value: `${messageCreate.author.tag}`, inline: true }, { name: 'Reason', value: `${reason}`, inline: true },
    )    
.setFooter({text: `Punishment ID: ${punishmentCode}`})
    await member.send({embeds: [mutedm]}).catch(e => {messageCreate.channel.send(`Error occured while trying to dm ${member.username}: ${e}`)})
        member.roles.add(muterole).catch(error => messageCreate.reply(`Sorry ${messageCreate.author}: ${error}`));
         setTimeout(function(){
            member.roles.remove(muterole);
           let unmuted = new Discord.EmbedBuilder()
           .setTitle(`Unmuted in ${messageCreate.guild}!`)
           member.send({embeds: [unmuted]}).catch(e => {messageCreate.channel.send(`Couldn't send unmute embed to ${member.user.username}: ${e}`)})
        }, ms(time));
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