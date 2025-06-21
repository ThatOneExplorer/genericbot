const Discord = require("discord.js")
const ms = require("ms")
const { prefix } = require("../config.json")
module.exports = {
    name: "slowmode",
    description: "sets slowmode in channel",
    async execute(messageCreate){
        const args = (messageCreate.content.slice(prefix.length).trim().split(/ +/g))
 
    	 if(!messageCreate.member.permissions.has(Discord.PermissionsBitField.Flags.KickMembers)){
        let nopermission = new Discord.EmbedBuilder()
        .setTitle(`Uh oh!`)
        .setDescription(`You do not have the permission to execute this command. This incident will be reported!`)
        .setColor("Red")
        return messageCreate.reply({embeds: [nopermission]});

    }   
     if(!args[1]){
                let notime = new Discord.EmbedBuilder()
                    .setTitle(`No time provided`)
                    .setDescription(`How long should slowmode be?`)
                    .setColor("Red")
                   return messageCreate.reply({embeds: [notime]})
     }
let time = args[1]
let slowmodeDuration;
try {
    slowmodeDuration = ms(time) / 1000; // Convert ms to seconds
    if (isNaN(slowmodeDuration) || slowmodeDuration < 0 || slowmodeDuration > 21600) {
        throw new Error("Invalid range");
    }
} catch {
    let invalidTime = new Discord.EmbedBuilder()
        .setTitle(`Invalid time`)
        .setDescription(`Please provide a valid time (e.g., 5s, 10m, 1h). Max is 6 hours.`)
        .setColor("Red");
    return messageCreate.reply({ embeds: [invalidTime] });
}

await messageCreate.channel.setRateLimitPerUser(slowmodeDuration);

let success = new Discord.EmbedBuilder()
    .setTitle(`Slowmode Enabled`)
    .setDescription(`Slowmode has been set to \`${time}\` in this channel.`)
    .setColor("Green");

return messageCreate.reply({ embeds: [success] });
    }
}