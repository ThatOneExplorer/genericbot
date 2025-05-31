const Discord = require ("discord.js")
require('dotenv').config();
const moment = require("moment")
const {prefix} = require("../config.json")
const ownerID = process.env.OWNERID_ID
module.exports = {
    name: "purge",
    description: "chunk deletes messages with a given number",

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

        let deletevalue = args[1]
        if (!deletevalue){
            let novalue = new Discord.EmbedBuilder()
            .setTitle(`Uh Oh!`)
            .setDescription(`You need to let me know how many messages to purge!`)
            .setFooter({text: `!purge <value>`})
            return messageCreate.reply({embeds: [novalue]});
        }

        let purgeembed = new Discord.EmbedBuilder()
        .setColor('Green')
        .setTitle(`Succesfully Purged ${deletevalue} messages`)
    
      let purgeamount = parseInt(args[1]) + 1;
      console.log(purgeamount)
      if (purgeamount > 100){
        return messageCreate.reply(`I can not purge more than 100 messages at a time.`)
      }
   await messageCreate.channel.bulkDelete(purgeamount).catch(error => messageCreate.reply(`${error}`))
        messageCreate.channel.send({embeds: [purgeembed]})
          .catch(error => messageCreate.reply(`Couldn't delete messages because of: ${error}`));
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