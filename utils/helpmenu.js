const Discord = require('discord.js')
require('dotenv').config();
const ownerID = process.env.OWNERID_ID
    async function helpmenu(interaction) {
try{
        console.log(`Recieved interaction in ${interaction.guild.name}`)
        if (interaction.customId === 'Help'){
                console.log("Recieved Interaction! (Help)")
                if(interaction.values[0] === "first_option"){
            let Moderation = new Discord.EmbedBuilder()
            .setTitle(`Moderation Commands!`)
            .addFields(
                {name: `Warn`, value: `Warns a mentioned user`},
                {name: `Mute`, value: `Mutes a mentioned user`},
                {name: `Kick`, value: `Kicks a mentioned user from the server`},
                {name: `Ban`, value: `Bans a mentioned user from the server`},
                {name: `Modlogs`, value: `Retrieves a user's modlogs from database`},
                {name: `Delete`, value: `Delete an entry from a users modlogs`},
                {name: `Purge`, value: `Bulk deletes a given amount of messages`},
                {name: "Censor", value: `Modify and view the censorlist`},
                {name: "Whitelist", value: `Modify and view the whitelist`}
            )
            .setColor("Orange")
        interaction.update({embeds: [Moderation]});
            }
            else if (interaction.values[0] === "second_option"){
                let Fun = new Discord.EmbedBuilder()
            .setTitle(`Fun Commands!`)
            .addFields(
                {name: `8ball`, value: `Ask the 8ball a question and it will respond!`},
                {name: `Train`, value: `Gathers real-time information of arrivals / departures at a given station on the irish rail network`},
                {name: `Station`, value: `Provides information on a given station on the irish rail network`}
            )
            .setColor("Blurple")
            
            interaction.update({embeds: [Fun]})
            }
            if(interaction.values[0] === "third_option"){
                let Misc= new Discord.EmbedBuilder()
                .setTitle(`Misc. Commands!`)
                .addFields(
                    {name: `Suggest`, value: `Have any suggestions for the server? A suggestion for a video? Or any other suggestion? This command will forward your suggestion to the staff team!`},
                    {name: `Ping`, value: `Pings Discord's API and gets a response`},
                    {name: "Constitution", value: "Creates a menu to display constitution articles"},
                    {name: "Mc", value: "Provides info on the minecraft server"}
                    
                )
                .setColor("Yellow")
                interaction.update({embeds: [Misc]})
            }

            if(interaction.values[0] === "fourth_option"){
                let Support = new Discord.EmbedBuilder()
                .setTitle(`Support Info!`)
                .setDescription(`Require support or assistance from a staff member? DM this bot (Genericbot) to create a support thread to contact the staff team in a private setting! Note, abuse of this feature will result in punishment.`)
                .setColor("Green")
                interaction.update({embeds: [Support]})
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
   return owner.user.send(`${e}`)
}
    }
module.exports = {helpmenu}
