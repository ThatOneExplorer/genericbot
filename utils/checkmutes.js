const punishments = require("../models/ModSchema");
const ms = require("ms");

async function checkmutes(client) {
    const allMutes = await punishments.find({
        "Punishments.PunishmentType": "Mute"
    });

    for (const doc of allMutes) {
        const guild = client.guilds.cache.get(doc.GuildID);
        if (!guild) continue;

        const member = await guild.members.fetch(doc.UserID).catch(() => null);
        if (!member) continue;

        const muteRole = guild.roles.cache.get(process.env.MUTE_ROLE);
        if (!muteRole) continue;

        for (const punishment of doc.Punishments) {
            if (punishment.PunishmentType === "Mute" && punishment.UnmuteAt) {
                const timeRemaining = punishment.UnmuteAt - Date.now();
 console.log(`[MUTE] User: ${member.user.tag} (${member.id}) in guild "${guild.name}" (${guild.id})`);
                console.log(`        Punishment ID: ${punishment.ID}`);
                console.log(`        Reason: ${punishment.Reason}`);
                console.log(`        Unmute in: ${timeRemaining > 0 ? ms(timeRemaining, { long: true }) : 'EXPIRED'}`);
                if (timeRemaining <= 0) {
                    await member.roles.remove(muteRole).catch(console.error);
                    doc.Punishments = doc.Punishments.filter(p => p.ID !== punishment.ID);
                    await doc.save();
                } else {
                    setTimeout(async () => {
                        try {
                            await member.roles.remove(muteRole);
                            await member.send({
                                embeds: [{
                                    title: `You've been unmuted in ${guild.name}`,
                                    color: 0x00ff00
                                }]
                            }).catch(() => {});

                            let current = await punishments.findOne({ GuildID: doc.GuildID, UserID: doc.UserID });
                            if (current) {
                                current.Punishments = current.Punishments.filter(p => p.ID !== punishment.ID);
                                await current.save();
                            }
                        } catch (e) {
                            console.error(`Failed to unmute ${member.user?.tag}`, e);
                        }
                    }, timeRemaining);
                }
            }
        }
    }
}
module.exports = {checkmutes}
