const Discord = require("discord.js")
const { prefix } = require("../config.json")
require('dotenv').config();
const ownerID = process.env.OWNER_ID
module.exports = {
    name: "unban",
    value: "unbans a user",
    
    async execute(messageCreate){
         try{
                const args = (messageCreate.content.slice(prefix.length).trim().split(/ +/g))
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
                
            let member = messageCreate.mentions.members.first() || args[1] 
                const bans = await messageCreate.guild.bans.fetch();
const bannedUser = bans.get(member);
if(!bannedUser){
    let notbanned = new Discord.EmbedBuilder()
    .setTitle(`Uh oh!`)
    .setDescription(`${member} is not banned.`)
    .setColor("Red")
    return messageCreate.reply({embeds: [notbanned]})
}

try{messageCreate.guild.members.unban(member)
let unbanned = new Discord.EmbedBuilder()
.setTitle(`${member} has been unbanned!`)
.setDescription(`Successfully unbanned <@${member}>`)
.setColor("Green")
messageCreate.reply({embeds: [unbanned]})
} catch(error){
    console.error("Unban error:", error);
                
                            const errorembed = new Discord.EmbedBuilder()
                                .setTitle("❌ An error has occurred!")
                                .setDescription("Something went wrong. The bot owner has been notified.")
                                .setColor("Red");
                
                            await messageCreate.reply({ embeds: [errorembed] });
                
                            const owner = messageCreate.guild?.members?.cache?.get(ownerID);
                            if (owner) {
                                owner.user.send(`Unban command error:\n\`\`\`${error.stack || error.message}\`\`\``);
                            }
            }
    
            } catch(error){
                 console.error("Unban error:", error);
                
                            const errorembed = new Discord.EmbedBuilder()
                                .setTitle("❌ An error has occurred!")
                                .setDescription("Something went wrong. The bot owner has been notified.")
                                .setColor("Red");
                
                            await messageCreate.reply({ embeds: [errorembed] });
                
                            const owner = messageCreate.guild?.members?.cache?.get(ownerID);
                            if (owner) {
                                owner.user.send(`Unban command error:\n\`\`\`${error.stack || error.message}\`\`\``);
                            }
            }
    }
}