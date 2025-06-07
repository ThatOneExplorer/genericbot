const Discord = require("discord.js");
require('dotenv').config();

const THREAD_CATEGORY_ID = process.env.THREAD_CATEGORY_ID;
const OWNER_ID = process.env.OWNER_ID;
const GENERIC_SERVER = process.env.GENERIC_SERVER;

async function modmail(messageCreate) {
    try {
        if (messageCreate.author.bot) return;

        const server = messageCreate.client.guilds.cache.get(GENERIC_SERVER);
        if (!server) return console.log(`Could not find guild with ID ${GENERIC_SERVER}`);

        const existingChannel = messageCreate.client.channels.cache.find(
            ch => ch.name === `${messageCreate.author.id}`
        );

        if (!messageCreate.guild) {
            if (!existingChannel) {
                const threadcat = await messageCreate.client.channels.fetch(THREAD_CATEGORY_ID).catch(() => {});
                const ticket = await server.channels.create({
                    name: `${messageCreate.author.id}`,
                    parent: threadcat?.id || THREAD_CATEGORY_ID
                }).catch(() => {});
                if (!ticket) return;
                const ticketembed = new Discord.EmbedBuilder()
                    .setAuthor({ name: `${messageCreate.author.tag}` })
                    .setTitle(`Modmail Incoming!`)
                    .addFields(
                        { name: `User:`, value: `${messageCreate.author.username}` },
                        { name: `UserID:`, value: `${messageCreate.author.id}` }
                    );

                await ticket.send(`@everyone`).catch(() => {});
                await ticket.send({ embeds: [ticketembed] }).catch(() => {});
                await ticket.send(`**FROM: ${messageCreate.author.username}** - ${messageCreate.content}`).catch(() => {});
                if (messageCreate.attachments.size > 0) {
                    await ticket.send({ files: messageCreate.attachments.map(a => a.url) }).catch(() => {});
                }
                await messageCreate.author.send({
                    content: `Thanks for opening a support thread! A staff member will be with you shortly.`
                }).catch(() => {}); 
                messageCreate.react("✅")
            } else {
                await existingChannel.send({ content: `**FROM: ${messageCreate.author.username}** - ${messageCreate.content}` }).catch(() => {});
                messageCreate.react("✅")
                if (messageCreate.attachments.size > 0) {
                    await existingChannel.send({ files: messageCreate.attachments.map(a => a.url) }).catch(() => {});
                }
            }
        }

        if (messageCreate.guild && messageCreate.channel.parentId === THREAD_CATEGORY_ID) {
            let ticketuser;
            try {
                ticketuser = await messageCreate.client.users.fetch(messageCreate.channel.name);
            } catch (err) {
                await messageCreate.channel.send(`⚠️ Failed to fetch the user for this thread.`);
                return;
            }

            const errorNotify = async () => {
                await messageCreate.reply(`❌ Could not send message. The user may have left or blocked the bot.`);
            };

            if (messageCreate.content === "!w") {
                const staffIntro = `**FROM: ${messageCreate.author.username}** - Hello there! You have successfully reached ${messageCreate.guild.name} Staff team! I'm ${messageCreate.author.username}, how can I assist you?`;
                try {
                    await ticketuser.send({ content: staffIntro });
                } catch {
                    return errorNotify();
                }
                await messageCreate.channel.send({ content: staffIntro }).catch(() => {});
                await messageCreate.delete().catch(() => {});
            }

            if (messageCreate.content === "!close") {
                await messageCreate.channel.send(`Closing this thread in 5 seconds!`).catch(() => {});
                setTimeout(async () => {
                    try {
                        await ticketuser.send(`This thread has now been closed. Feel free to open another if needed.`);
                    } catch {
                        await errorNotify();
                    }
                    await messageCreate.channel.delete().catch(() => {});
                }, 5000);
            }

            if (messageCreate.content.startsWith("!r")) {
                const reply = messageCreate.content.split(" ").slice(1).join(" ");
                if (!reply) return messageCreate.reply(`Can not send empty response!`);
                try {
                    await ticketuser.send({ content: `**FROM: ${messageCreate.author.username}** - ${reply}` });
                    if (messageCreate.attachments.size > 0) {
                        await ticketuser.send({ files: messageCreate.attachments.map(a => a.url) });
                    }
                } catch {
                    return errorNotify();
                }
                await messageCreate.channel.send({ content: `**FROM: ${messageCreate.author.username}** - ${reply}` }).catch(() => {});
                if (messageCreate.attachments.size > 0) {
                    await messageCreate.channel.send({ files: messageCreate.attachments.map(a => a.url) });
                }
                await messageCreate.delete().catch(() => {});
            }

            if (messageCreate.content.startsWith("!ar")) {
                const reply = messageCreate.content.split(" ").slice(1).join(" ");
                if (!reply) return messageCreate.reply(`Can not send empty response!`);
                try {
                    await ticketuser.send({ content: `**FROM: Anonymous Staff** - ${reply}` });
                    if (messageCreate.attachments.size > 0) {
                        await ticketuser.send({ files: messageCreate.attachments.map(a => a.url) });
                    }
                } catch {
                    return errorNotify();
                }
                await messageCreate.channel.send({ content: `**FROM: Anonymous Staff** - ${reply}` }).catch(() => {});
                if (messageCreate.attachments.size > 0) {
                    await messageCreate.channel.send({ files: messageCreate.attachments.map(a => a.url) });
                }
                await messageCreate.delete().catch(() => {});
            }
        }

    } catch (error) {
        console.error("Modmail error:", error);
        try {
            const owner = await messageCreate.client.users.fetch(OWNER_ID);
            await owner.send(`Modmail error:\n\`\`\`${error.stack || error.message}\`\`\``).catch(() => {});
        } catch {}
    }
}

module.exports = { modmail };