const discord = require("discord.js");
const dotenv = require("dotenv");
const mcs = require('node-mcstatus');
const { description } = require("./kick");
const OWNER_ID = process.env.OWNER_ID
module.exports = {
    name: "mc",
    description: "checks MC server status",

    async execute(messageCreate){
        const host ='generic.playit.gg';
      //  const port = 25565; 
     // const options = {query: true};
      try{ mcs.statusJava(host)
        .then((result) => {
            console.log(result)
            if(!result.online){
                let offlineembed = new discord.EmbedBuilder()
                    .setTitle(`Server Offline! 🔴`)
                    .setDescription(`The server is currently offline.`)
                    .setColor("Red")
                messageCreate.reply({embeds: [offlineembed]})
                return;
            }

            let playerNames = 'No players online';
            if (result.players.list && result.players.list.length > 0) {
                const allNames = result.players.list.map(p => p.name_clean).join(', ');
                if(allNames.length <= 1024) {
                    playerNames = allNames;
                } else {
                    const namesArr = allNames.split(', ');
                    let chunks = [];
                    let chunk = '';
                    for (const name of namesArr) {
                        if ((chunk + name + ', ').length > 1024) {
                            chunks.push(chunk.slice(0, -2));
                            chunk = '';
                        }
                        chunk += name + ', ';
                    }
                    if (chunk.length) chunks.push(chunk.slice(0, -2));
                    
                    let mcstatusembed = new discord.EmbedBuilder()
                        .setTitle(`MC Server Status!`)
                        .addFields(
                            {name: "Server Online?", value: `${result.online}`},
                            {name: "Host", value: `${result.host}`},
                            {name: "Version", value: `${result.version.name_clean}`},
                            {name: "Players", value: `${result.players.online} / ${result.players.max}`},
                            {name: "MOTD", value: `${result.motd.clean}`}
                        )
                        .setColor("Green");

                    messageCreate.reply({embeds: [mcstatusembed]}).then(() => {
                        for (const chunkText of chunks) {
                            let playerEmbed = new discord.EmbedBuilder()
                                .setTitle("Player List (continued)")
                                .setDescription(chunkText)
                                .setColor("Green");
                            messageCreate.channel.send({embeds: [playerEmbed]});
                        }
                    });
                    return;
                }
            }

            let mcstatusembed = new discord.EmbedBuilder()
                .setTitle(`MC Server Status!`)
                .addFields(
                    {name: "Server Online?", value: `${result.online}`},
                    {name: "MOTD", value: `${result.motd.clean}`},
                    {name: "Host", value: `${result.host}`},
                    {name: "Version", value: `${result.version.name_clean}`},
                    {name: "Players", value: `${result.players.online} / ${result.players.max}`},
                    {name: "Player List", value: playerNames},
                )
                .setColor("Green")

            messageCreate.reply({embeds: [mcstatusembed]})
        })
        .catch((error) => {
            console.log(error)
        })
    }catch(error){
            console.log(error)
            let errorembed = new Discord.EmbedBuilder()
            .setTitle(`An error has occured!`)
            .setDescription(`An error has occured while trying to perform this action, the owner of this bot has been notified.`)
             .setColor("Red")
           await messageCreate.reply({embeds: [errorembed]})
           const owner = messageCreate.guild.members.cache.get(ownerID)
           return owner.user.send(`${error}`)
    }
    }
}
