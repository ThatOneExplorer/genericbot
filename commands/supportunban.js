const Discord = require("discord.js");
require('dotenv').config();
const supportban = require('../models/supportbanSchema');
const { prefix } = require("../config.json");
const ownerID = process.env.OWNERID_ID;

module.exports = {
    name: "supportunban",
    description: "removes a support ban from a mentioned user",
    async execute(messageCreate) {
        try {
            const args = messageCreate.content.slice(prefix.length).trim().split(/ +/g);

            if (!messageCreate.member.permissions.has(Discord.PermissionsBitField.Flags.BanMembers)) {
                let nopermission = new Discord.EmbedBuilder()
                    .setTitle(`Uh oh!`)
                    .setDescription(`You do not have permission to execute this command. This incident will be reported!`)
                    .setColor("Red");
                return messageCreate.reply({ embeds: [nopermission] });
            }

            if (!args[1]) {
                let nomember = new Discord.EmbedBuilder()
                    .setTitle(`No member provided`)
                    .setDescription(`You need to mention a user or provide an ID to perform this action!`)
                    .setColor("Red");
                return messageCreate.reply({ embeds: [nomember] });
            }

            let member = messageCreate.mentions.members.first() || messageCreate.guild.members.cache.get(args[1]);

            if (!member) {
                let invalidmember = new Discord.EmbedBuilder()
                    .setTitle(`Can't find member`)
                    .setDescription(`Is the user in the guild? Does the user exist?`)
                    .setColor("Red");
                return messageCreate.reply({ embeds: [invalidmember] });
            }

            const bannedRecord = await supportban.findOne({ userId: member.id });

            if (!bannedRecord) {
                let notBanned = new Discord.EmbedBuilder()
                    .setTitle(`User not support banned`)
                    .setDescription(`${member.user.tag} is not currently banned from support.`)
                    .setColor("Yellow");
                return messageCreate.reply({ embeds: [notBanned] });
            }

            await supportban.deleteOne({ userId: member.id });

            let unbanEmbed = new Discord.EmbedBuilder()
                .setTitle(`Successfully removed **SUPPORT BAN** from ${member.user.username}`)
                .setColor("Green");

            messageCreate.reply({ embeds: [unbanEmbed] });

            try {
                await member.send({
                    embeds: [
                        new Discord.EmbedBuilder()
                            .setTitle(`Your support ban has been lifted in ${messageCreate.guild.name}!`)
                            .setDescription(`You can now open support threads again.`)
                            .setColor("Green")
                    ]
                });
            } catch {
                messageCreate.channel.send(`Could not DM ${member.user.tag}, but the support ban was removed.`);
            }
        } catch (e) {
            console.log(e);
            let errorembed = new Discord.EmbedBuilder()
                .setTitle(`An error has occurred!`)
                .setDescription(`An error occurred while trying to perform this action. The bot owner has been notified.`)
                .setColor("Red");
            await messageCreate.reply({ embeds: [errorembed] });
        try {
    const owner = await messageCreate.guild.members.fetch(ownerID);
    if (owner && owner.user) {
        await owner.user.send(`${e}`);
    } else {
        console.warn("Owner not found or DMs unavailable.");
    }
} catch (err) {
    console.warn("Failed to send error to owner:", err);
}
        }
    }
};
