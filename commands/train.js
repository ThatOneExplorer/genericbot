const axios = require("axios");
const { parseStringPromise } = require("xml2js");
const { prefix} = require("../config.json");
const ownerID = process.env.OWNERID_ID
const translinkAPI = process.env.TRANSLINK_API
const Discord = require("discord.js");
const moment = require("moment");

module.exports = {
    name: "train",
    description: "Get real-time train updates for an Irish Rail station (with Translink fallback).",
    async execute(messageCreate) {
        const args = messageCreate.content.slice(prefix.length).trim().split(/ +/g);

        if (!args[1]) {
            return messageCreate.reply("Please provide a station name! Example: `!train Dublin`");
        }

        const station = args.slice(1).join(" ").toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());

        // First check if the station is Drogheda or Dundalk (Irish Rail stations with priority)
        if (station === "Drogheda" || station === "Dundalk" || station === "Dublin Connolly") {
            await this.fetchIrishRailData(station, messageCreate); // Directly fetch from Irish Rail
        } else {
            // For all other stations, try Translink first
            const stopFinderUrl = `https://opendata.translinkniplanner.co.uk/Ext_API/XML_STOPFINDER_REQUEST?ext_macro=sf&type_sf=any&name_sf=${encodeURIComponent(station)}&outputFormat=rapidJSON`;

            try {
                const stopResponse = await axios.get(stopFinderUrl, {
                    timeout: 10000, // Set timeout to 10 seconds
                    headers: {
                        "User-Agent": "Mozilla/5.0",
                        "X-API-TOKEN": translinkAPI
                    }
                });

                console.log('StopFinder Response:', stopResponse.data); // Log the response for debugging

                const stopData = stopResponse.data?.locations;
                if (!stopData || stopData.length === 0) {
                    // If no Translink data is found, fallback to Irish Rail
                    return this.fetchIrishRailData(station, messageCreate);
                }

                // Try to find the best match based on `isBest` or the highest `matchQuality`
                const bestMatch = stopData.reduce((prev, current) => {
                    return (prev.matchQuality > current.matchQuality) ? prev : current;
                });

                const stationID = bestMatch.id;
                if (!stationID) {
                    return messageCreate.reply(`❌ No station ID found for **${station}**.`);
                }

                console.log('Resolved Station ID:', stationID); // Log the resolved station ID

                const now = moment.utc();
                const date = now.format('YYYYMMDD');     // e.g. 20250408
                const time = now.format('HHmm');         // e.g. 1340 (13:40 UTC)
                const departureUrl = `https://opendata.translinkniplanner.co.uk/Ext_API/XML_DM_REQUEST?ext_macro=dm&type_dm=any&name_dm=${stationID}&itdDate=${date}&itdTime=${time}&lsShowTrainsExplicit=1&useRealtime=1`;

                const departureResponse = await axios.get(departureUrl, {
                    timeout: 10000, // Set timeout to 10 seconds
                    headers: {
                        "X-API-TOKEN": translinkAPI,  // Include your API key
                        "User-Agent": "Mozilla/5.0",
                    }
                });

                console.log('Departure Response:', departureResponse.data);  // Log the entire departure response for debugging

                const departures = departureResponse.data?.stopEvents;
                if (!departures || departures.length === 0) {
                    return messageCreate.reply(`❌ No departures found for **${station}**.`);
                }
                const railDepartures = departures
                .filter(departure => departure.transportation?.name === 'Rail')
                .filter(departure => {
                    const now = moment.utc();
                    const planned = moment.utc(departure.departureTimePlanned);
                    const estimated = departure.departureTimeEstimated ? moment.utc(departure.departureTimeEstimated) : null;
                    return (estimated && estimated.isSameOrAfter(now)) || planned.isSameOrAfter(now);
                });
                if (railDepartures.length === 0) {
                    // If no rail services found from Translink, fallback to Irish Rail
                    return this.fetchIrishRailData(station, messageCreate);
                }

                const firstRailDepartureLocation = railDepartures[0]?.location?.name || 'Unknown Location';
                const embed = new Discord.EmbedBuilder()
                    .setTitle(`Translink - ${firstRailDepartureLocation}`)
                    .setColor("Blue")
                    .setFooter({text: `Transport Information supplied by Translink Opendata API`});

                let maxFields = 5; 
                let pageDepartures = railDepartures.slice(0, maxFields); 
                
                pageDepartures.forEach((departure) => {
                    const locationName = departure.location?.name || 'Unknown Location'; 
                    const direction = departure.transportation.destination.name || 'Unknown Direction';  
                    const trainName = departure.transportation.name || 'Unknown Train';  
                    const departureTimee = moment.utc(departure.departureTimePlanned).local().format('HH:mm')|| 'Unknown Time';  
                    const estimatedTime = moment.utc(departure.departureTimeEstimated).local().format('HH:mm') || 'Unknown Time';  

                    console.log(departure);
                    console.log(departure.transportation);
                    console.log(departure.location);
                    console.log(`Departure Time: ${departureTimee} | Estimated Time: ${estimatedTime}`);

                    embed.addFields({
                        name: `🚉 Train to ${direction} from ${departure.transportation.origin.name}`,
                        value: `🕒 Due: ${departureTimee}
                                Expected: ${estimatedTime}
                                Platform: ${departure.location.properties.platform}
                                This train is operated by ${departure.transportation.operator.name}`,
                        inline: false,
                    });
                });

                return messageCreate.channel.send({ embeds: [embed] });

            } catch (error) {
                console.error(error);
                
                // Handle timeout specifically
                if (error.code === 'ECONNABORTED') {
                    console.error('Translink API request timed out.');
                    messageCreate.reply(`Translink API request timed out, falling back on Irish Rail API`)
                }

                // In case of any error, fallback to Irish Rail
                return this.fetchIrishRailData(station, messageCreate);
            }
        }
    },

    // Fallback function to fetch Irish Rail data if no Translink data is found
    async fetchIrishRailData(station, messageCreate) {
        const url = `https://api.irishrail.ie/realtime/realtime.asmx/getStationDataByNameXML?StationDesc=${encodeURIComponent(station)}`;

        try {
            const response = await axios.get(url, {
                timeout: 10000, //timeout 10 seconds
                headers: {
                    "User-Agent": "Mozilla/5.0",
                    "Accept": "application/xml"
                }
            });

            const jsonData = await parseStringPromise(response.data);
            const trains = jsonData.ArrayOfObjStationData?.objStationData?.slice(0, 5);

            // ✅ If Irish Rail has trains
            if (trains && trains.length > 0) {
                const embed = new Discord.EmbedBuilder()
                    .setTitle(`🚆 Irish Rail - ${station}`)
                    .setColor("Green");

                trains.forEach(train => {
                    embed.addFields({
                        name: `Train to ${train.Destination[0]} (${train.Traintype[0]}) ${train.Traincode[0]}`,
                        value: `🚉 Due: ${train.Exparrival[0]}\n🕒 Expected: ${train.Expdepart[0]}\n🚦 Status: ${train.Status[0]}`,
                        inline: false
                    });
                });

                return messageCreate.channel.send({ embeds: [embed] });
            } else {
                messageCreate.reply(`No real-time data available for **${station}**.`);
            }
        } catch (error) {
            console.error(error);
            const errorembed = new Discord.EmbedBuilder()
                .setTitle("❌ An error has occurred!")
                .setDescription("Something went wrong. The bot owner has been notified.")
                .setColor("Red");

            await messageCreate.reply({ embeds: [errorembed] });

            const owner = messageCreate.guild.members.cache.get(ownerID);
            if (owner) owner.send(`Train command error:\n\`\`\`${error.stack || error.message}\`\`\``);
        }
    }
};