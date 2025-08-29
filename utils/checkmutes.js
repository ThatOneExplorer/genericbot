const punishments = require("../models/ModSchema");

async function checkmutes(client) {
    const now = Date.now();
    const mutedUsers = await punishments.find({ "CurrentMute.UnmuteAt": { $lte: now } });

    for (const doc of mutedUsers) {
        const guild = client.guilds.cache.get(doc.GuildID);
        if (!guild) continue;

        const member = await guild.members.fetch(doc.UserID).catch(() => null);
        if (!member) continue;

        const muteRole = guild.roles.cache.get(process.env.MUTE_ROLE);
        if (muteRole) await member.roles.remove(muteRole).catch(() => {});

        await member.send({
            embeds: [{ title: `You've been unmuted in ${guild.name}`, color: 0x00ff00 }]
        }).catch(() => {});

        doc.CurrentMute = null;
        await doc.save();
    }
}

module.exports = { checkmutes };