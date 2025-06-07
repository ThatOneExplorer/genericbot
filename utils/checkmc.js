const { ModalSubmitFields } = require("discord.js")
const moment = require ("moment")
const generic_server = process.env.GENERIC_SERVER;
const MINECRAFT_HOST = process.env.MINECRAFT_HOST
const MINECRAFT_STATUS = process.env.MINECRAFT_STATUS
const MINECRAFT_PLAYER_COUNT = process.env.MINECRAFT_PLAYER_COUNT
const mcs = require("node-mcstatus")

async function checkmc(client) {
    try {
        const result = await mcs.statusJava(MINECRAFT_HOST);
        let STATUS = client.channels.cache.get(MINECRAFT_STATUS);
        let PLAYER_COUNT = client.channels.cache.get(MINECRAFT_PLAYER_COUNT);
        console.log(result)
        if (result.online == false ) {
            if (STATUS) await STATUS.setName(`Server Status: Offline 🔴`);
            if (PLAYER_COUNT) await PLAYER_COUNT.setName(`Player Count: Unavailable`);
            return;
        }

        if (PLAYER_COUNT) await PLAYER_COUNT.setName(`Player Count: ${result.players.online} / ${result.players.max}`);
        if (STATUS) await STATUS.setName(`Server Status: Online 🟢`);

  } catch (error) {
    const server = client.guilds.cache.get(GENERIC_SERVER)
     const owner = server.members.cache.get(ownerID)
    console.error(error);
   if (owner) 
     owner.send(`${error}`).catch(() => {});
  }
}
module.exports = {checkmc}