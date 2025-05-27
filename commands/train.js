const axios = require("axios");
require("dotenv").config();
const { parseStringPromise } = require("xml2js");
const { prefix } = require("../config.json");
const Discord = require("discord.js");
const moment = require("moment");

const ownerID = process.env.OWNERID_ID;
const translinkAPI = process.env.TRANSLINK_API;
const MAX_TRAINS = 5;
const DEBUG = process.env.DEBUG === "true";

function getTranslinkHeaders() {
    return {
        "User-Agent": "Mozilla/5.0",
        "X-API-TOKEN": translinkAPI
    };
}

module.exports = {
    name: "train",
    description: "Get real-time train updates for an Irish Rail station (with Translink fallback).",

    async execute(messageCreate) {
        const args = messageCreate.content.slice(prefix.length).trim().split(/ +/g);
        const [command, ...queryParts] = args;

        if (!queryParts.length) {
            return messageCreate.reply("Please provide a station name! Example: `!train Dublin`");
        }

        const station = queryParts.join(" ").toLowerCase().replace(/\b\w/g, char => char.toUpperCase());

        if (["Drogheda", "Dundalk", "Dublin Connolly"].includes(station)) {
            return this.fetchIrishRailData(station, messageCreate);
        }

        const stopFinderUrl = `https://opendata.translinkniplanner.co.uk/Ext_API/XML_STOPFINDER_REQUEST?ext_macro=sf&type_sf=any&name_sf=${encodeURIComponent(station)}&outputFormat=rapidJSON`;

        try {
            const stopResponse = await axios.get(stopFinderUrl, {
                timeout: 10000,
                headers: getTranslinkHeaders()
            });

            const stopData = stopResponse.data?.locations;
            if (!stopData?.length) {
                return this.fetchIrishRailData(station, messageCreate);
            }

            const bestMatch = stopData.reduce((prev, current) =>
                prev.matchQuality > current.matchQuality ? prev : current
            );

            const stationID = bestMatch?.id;
            if (!stationID) {
                return messageCreate.reply(`❌ No station ID found for **${station}**.`);
            }

            const now = moment.utc();
            const date = now.format("YYYYMMDD");
            const time = now.format("HHmm");
            const departureUrl = `https://opendata.translinkniplanner.co.uk/Ext_API/XML_DM_REQUEST?ext_macro=dm&type_dm=any&name_dm=${stationID}&itdDate=${date}&itdTime=${time}&lsShowTrainsExplicit=1&useRealtime=1`;

            const departureResponse = await axios.get(departureUrl, {
                timeout: 10000,
                headers: getTranslinkHeaders()
            });

            const departures = departureResponse.data?.stopEvents;
            if (!departures?.length) {
                await messageCreate.reply("No Translink departures found. Checking Irish Rail...");
                return this.fetchIrishRailData(station, messageCreate);
            }

            const nowTime = moment.utc();
            const railDepartures = departures
                .filter(d => d.transportation?.name === "Rail")
                .filter(d => {
                    const planned = moment.utc(d.departureTimePlanned);
                    const estimated = d.departureTimeEstimated ? moment.utc(d.departureTimeEstimated) : null;
                    return (estimated && estimated.isSameOrAfter(nowTime)) || planned.isSameOrAfter(nowTime);
                });

            if (!railDepartures.length) {
                await messageCreate.reply("No upcoming trains on Translink. Checking Irish Rail...");
                return this.fetchIrishRailData(station, messageCreate);
            }

            const locationName = railDepartures[0]?.location?.name || "Unknown Location";
            const embed = new Discord.EmbedBuilder()
                .setTitle(`Translink - ${locationName}`)
                .setColor("Blue")
                .setFooter({ text: "Transport Information supplied by Translink Opendata API" });

            railDepartures.slice(0, MAX_TRAINS).forEach(departure => {
                const plannedTime = moment.utc(departure.departureTimePlanned).local().format("HH:mm");
                const estimatedTime = departure.departureTimeEstimated
                    ? moment.utc(departure.departureTimeEstimated).local().format("HH:mm")
                    : "Unknown";

                embed.addFields({
                    name: `🚉 Train to ${departure.transportation?.destination?.name || "Unknown"} from ${departure.transportation?.origin?.name || "Unknown"}`,
                    value: `🕒 Due: ${plannedTime}\n` +
                           `⏱️ Expected: ${estimatedTime}\n` +
                           `🛤 Platform: ${departure.location?.properties?.platform || "N/A"}\n` +
                           `🚆 Operator: ${departure.transportation?.operator?.name || "Unknown"}`,
                    inline: false
                });

                if (DEBUG) {
                    console.log(JSON.stringify(departure, null, 2));
                }
            });

            return messageCreate.channel.send({ embeds: [embed] });

        } catch (error) {
            console.error("Translink error:", error);

            if (error.code === "ECONNABORTED") {
                await messageCreate.reply("Translink API request timed out. Trying Irish Rail...");
            }

            return this.fetchIrishRailData(station, messageCreate);
        }
    },

    async fetchIrishRailData(station, messageCreate) {
        const url = `https://api.irishrail.ie/realtime/realtime.asmx/getStationDataByNameXML?StationDesc=${encodeURIComponent(station)}`;

        try {
            const response = await axios.get(url, {
                timeout: 10000,
                headers: {
                    "User-Agent": "Mozilla/5.0",
                    "Accept": "application/xml"
                }
            });

            const jsonData = await parseStringPromise(response.data);
            const trains = jsonData.ArrayOfObjStationData?.objStationData?.slice(0, MAX_TRAINS);

            if (trains?.length) {
                const embed = new Discord.EmbedBuilder()
                    .setTitle(`🚆 Irish Rail - ${station}`)
                    .setColor("Green");

                trains.forEach(train => {
                    embed.addFields({
                        name: `Train to ${train.Destination[0]} (${train.Traintype[0]}) ${train.Traincode[0]}`,
                        value: `🕒 Due: ${train.Exparrival[0]}\n⏱️ Expected: ${train.Expdepart[0]}\n🚦 Status: ${train.Status[0]}`,
                        inline: false
                    });
                });

                return messageCreate.channel.send({ embeds: [embed] });
            } else {
                return messageCreate.reply(`No real-time data available for **${station}**.`);
            }
        } catch (error) {
            console.error("Irish Rail error:", error);

            const errorembed = new Discord.EmbedBuilder()
                .setTitle("❌ An error has occurred!")
                .setDescription("Something went wrong. The bot owner has been notified.")
                .setColor("Red");

            await messageCreate.reply({ embeds: [errorembed] });

            const owner = messageCreate.guild?.members?.cache?.get(ownerID);
            if (owner) {
                owner.send(`Train command error:\n\`\`\`${error.stack || error.message}\`\`\``);
            }
        }
    }
};
