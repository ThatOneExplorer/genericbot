const Discord = require("discord.js");
require('dotenv').config();
const punishments = require("../models/ModSchema");
const moment = require("moment");
const { prefix } = require("../config.json");
const MUTE_ROLE = process.env.MUTE_ROLE;
const ms = require("ms");

module.exports = {
    name: "mute",
    description: "Mute a mentioned user",
    async execute(messageCreate) {
        try {
            const args = messageCreate.content.slice(prefix.length).trim().split(/ +/g);
            const currenttime = moment(Date.now()).format('DD/MM/YY');

            if (!messageCreate.member.permissions.has(Discord.PermissionsBitField.Flags.ManageMessages))
                return messageCreate.reply({ embeds: [new Discord.EmbedBuilder().setTitle("Uh oh!").setDescription("You do not have permission.").setColor("Red")] });

            const member = messageCreate.mentions.members.first() || messageCreate.guild.members.cache.get(args[1]);
            if (!member) return messageCreate.reply({ embeds: [new Discord.EmbedBuilder().setTitle("No member found").setColor("Red")] });

            const time = args[2];
            if (!time) return messageCreate.reply({ embeds: [new Discord.EmbedBuilder().setTitle("No time provided").setColor("Red")] });

            const reason = args.slice(3).join(" ");
            if (!reason) return messageCreate.reply({ embeds: [new Discord.EmbedBuilder().setTitle("No reason provided").setColor("Red")] });

            const muterole = messageCreate.guild.roles.cache.get(MUTE_ROLE);
            if (!muterole) return messageCreate.reply({ embeds: [new Discord.EmbedBuilder().setTitle("Mute role not found").setColor("Red")] });

            const generatePunishmentCode = (length = 10) => {
                const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                let code = '';
                for (let i = 0; i < length; i++) code += chars[Math.floor(Math.random() * chars.length)];
                return code;
            };

            const punishmentCode = generatePunishmentCode();
            const unmuteAt = Date.now() + ms(time);

            let data = await punishments.findOne({ GuildID: messageCreate.guild.id, UserID: member.id });

            if (data) {
                data.CurrentMute = { UnmuteAt: unmuteAt, Reason: reason, Moderator: messageCreate.author.id, ID: punishmentCode };
                data.markModified('CurrentMute');
                data.Punishments.unshift({ PunishmentType: 'Mute', Moderator: messageCreate.author.id, Time: time, Reason: reason, Date: currenttime, ID: punishmentCode });
                await data.save();
            } else {
                const newData = new punishments({
                    GuildID: messageCreate.guild.id,
                    UserID: member.id,
                    CurrentMute: { UnmuteAt: unmuteAt, Reason: reason, Moderator: messageCreate.author.id, ID: punishmentCode },
                    Punishments: [{ PunishmentType: 'Mute', Moderator: messageCreate.author.id, Time: time, Reason: reason, Date: currenttime, ID: punishmentCode }]
                });
                await newData.save();
            }

            await member.roles.add(muterole).catch(() => {});

            const muteEmbed = new Discord.EmbedBuilder().setTitle(`Muted ${member.user.username} for ${time}`).addFields(
                { name: 'Moderator', value: messageCreate.author.tag, inline: true },
                { name: 'Reason', value: reason, inline: true }
            ).setColor("Green");
            await messageCreate.reply({ embeds: [muteEmbed] });

            const dmEmbed = new Discord.EmbedBuilder().setTitle(`You have been muted in ${messageCreate.guild.name} for ${time}`).addFields(
                { name: 'Moderator', value: messageCreate.author.tag, inline: true },
                { name: 'Reason', value: reason, inline: true }
            ).setFooter({ text: `Punishment ID: ${punishmentCode}` });
            await member.send({ embeds: [dmEmbed] }).catch(() => {});

        } catch (e) {
            console.error(e);
        }
    }
};
