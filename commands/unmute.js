const Discord = require("discord.js");
require('dotenv').config();
const punishments = require("../models/ModSchema");
const { prefix } = require("../config.json");
const MUTE_ROLE = process.env.MUTE_ROLE;

module.exports = {
    name: "unmute",
    description: "Unmute a mentioned user",
    async execute(messageCreate) {
        try {
            if (!messageCreate.member.permissions.has(Discord.PermissionsBitField.Flags.ManageMessages))
                return messageCreate.reply({ embeds: [new Discord.EmbedBuilder().setTitle("No permission").setColor("Red")] });

            const member = messageCreate.mentions.members.first() || messageCreate.guild.members.cache.get(messageCreate.content.slice(prefix.length).trim().split(/ +/g)[1]);
            if (!member) return messageCreate.reply({ embeds: [new Discord.EmbedBuilder().setTitle("No member found").setColor("Red")] });

            const muterole = messageCreate.guild.roles.cache.get(MUTE_ROLE);
            if (muterole) await member.roles.remove(muterole).catch(() => {});

            const data = await punishments.findOne({ GuildID: messageCreate.guild.id, UserID: member.id });
            if (data && data.CurrentMute) {
                data.CurrentMute = null;
                await data.save();
            }

            const embed = new Discord.EmbedBuilder().setTitle(`Unmuted ${member.user.username}`).setColor("Green");
            await messageCreate.reply({ embeds: [embed] });

            await member.send({ embeds: [new Discord.EmbedBuilder().setTitle(`You have been unmuted in ${messageCreate.guild.name}`).setColor("Green")] }).catch(() => {});

        } catch (e) {
            console.error(e);
        }
    }
};