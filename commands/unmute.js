const Discord = require("discord.js")
require('dotenv').config();
const {prefix} = require("../config.json")
const ownerID = process.env.OWNERID_ID
const MUTE_ROLE = process.env.MUTE_ROLE
module.exports ={
 name: "unmute",
    description: "unmute a mentioned user",
    async execute(messageCreate){
        try{
        const args = (messageCreate.content.slice(prefix.length).trim().split(/ +/g))
        if(!messageCreate.member.permissions.has(Discord.PermissionsBitField.Flags.ManageMessages)){
            let nopermission = new Discord.EmbedBuilder()
            .setTitle(`Uh oh!`)
            .setDescription(`You do not have the permission to execute this command. This incident will be reported!`)
            .setColor("Red")
            return messageCreate.reply({embeds: [nopermission]});
        }
        const muterole = messageCreate.guild.roles.cache.find(MUTE_ROLE);
        if(!muterole){
            let norole = new Discord.EmbedBuilder()
            .setTitle(`No mute role found!`)
            .setDescription(`The mute role was not found. Please contact a server administrator / owner if this error occurs.`)
            .setFooter({text: `Tried to find role with id: ${roleid}`})
            .setColor("Red")
        }

        let member = messageCreate.mentions.members.first();
         if(!member){
            let invalidmember = new Discord.EmbedBuilder()
            .setTitle(`Can't find member`)
            .setDescription(`Is the user in the guild? Does the user exist? I can't mute someone who isn't in the server :/`)
            .setColor("Red")
            return messageCreate.reply({embeds: [invalidmember]});
        }
        
        let unmute = new Discord.EmbedBuilder()
        .setTitle(`Successfully issued **UNMUTE** to ${member.user.username}`)
        .addFields(          
            { name: 'Moderator', value: `${messageCreate.author.tag}`, inline: true }
        )
     messageCreate.reply({embeds: [unmute]}).catch(e => {messageCreate.channel.send(`Couldn't send unmute embed${member.user.username}: ${e}`)})
    await member.roles.remove(muterole).catch(e => {messageCreate.channel.send(`Couldn't unmute ${member.user.username}: ${e}`)});
           let unmuted = new Discord.EmbedBuilder()
           .setTitle(`Unmuted in ${messageCreate.guild}!`)
            member.send({embeds: [unmuted]}).catch(e => {messageCreate.channel.send(`Couldn't send unmute embed to ${member.user.username}: ${e}`)})
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