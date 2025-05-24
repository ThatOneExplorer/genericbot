const axios = require("axios");
const { parseStringPromise } = require("xml2js");
const { prefix } = require("../config.json");
const Discord = require("discord.js");
const ownerID = process.env.OWNERID_ID
module.exports = {
    name: "station",
    description: "Get information about any Irish Rail station.",
    async execute(messageCreate) {
        const args = messageCreate.content.slice(prefix.length).trim().split(/ +/g);
        const stationName = args.slice(1).join(" ").toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
        
        const url = "https://api.irishrail.ie/realtime/realtime.asmx/getAllStationsXML";

        try {
            const response = await axios.get(url, {
                headers: {
                    "User-Agent": "Mozilla/5.0",
                    "Accept": "application/xml"
                }
            });

            const jsonData = await parseStringPromise(response.data);

            if (!jsonData.ArrayOfObjStation || !jsonData.ArrayOfObjStation.objStation) {
                return messageCreate.reply("❌ No station data available at the moment.");
            }

            const stations = jsonData.ArrayOfObjStation.objStation;

            // If no station name is provided, list all available stations
            if (!stationName) {
                let stationList = stations.map(station => station.StationDesc[0]).join(", ");
                return messageCreate.reply(`📍 **Available Stations:**\n${stationList}`);
            }

            // Search for the requested station
            const station = stations.find(s => s.StationDesc[0].toLowerCase() === stationName.toLowerCase());

            if (!station) {
                return messageCreate.reply(`❌ No station found with the name **${stationName}**.`);
            }

            // Format station details 
            let embed = new Discord.EmbedBuilder()
                .setTitle(`📍 Station Info: ${station.StationDesc[0]}`)
                .setColor("Green")
                .addFields(
                    { name: "🚆 Station Code", value: station.StationCode[0], inline: true },
                    { name: "🆔 Station ID", value: station.StationId[0], inline: true },
                    { name: "📍 Latitude", value: station.StationLatitude[0], inline: true },
                    { name: "📍 Longitude", value: station.StationLongitude[0], inline: true }
                );

            messageCreate.channel.send({ embeds: [embed] });

        } catch (error) {
            console.log(e)
            let errorembed = new Discord.EmbedBuilder()
            .setTitle(`An error has occured!`)
            .setDescription(`An error has occured while trying to perform this action, the owner of this bot has been notified.`)
             .setColor("Red")
           await messageCreate.reply({embeds: [errorembed]})
           const owner = messageCreate.guild.members.cache.get(ownerID)
           return owner.send(`${e}`)
        }
    },
};