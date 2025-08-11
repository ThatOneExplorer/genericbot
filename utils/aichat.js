let generalMessages = [];
const GENERAL_CHANNEL_ID = process.env.GENERAL_CHAT;
const AI_CHANNEL_ID = process.env.AI_CHANNEL;

async function preloadMessages(client) {
    const channel = client.channels.cache.get(GENERAL_CHANNEL_ID);
    if (!channel || !channel.isTextBased()) return;

    let messages = [];
    let lastId;
    const limit = 500;

    while (messages.length < limit) {
        const options = { limit: Math.min(100, limit - messages.length) };
        if (lastId) options.before = lastId;

        const fetchedMessages = await channel.messages.fetch(options);
        if (fetchedMessages.size === 0) break;

        messages = messages.concat(Array.from(fetchedMessages.values()));
        lastId = fetchedMessages.last().id;
    }


    messages.reverse().forEach(message => {
        if (message.author.bot) return;
        if (!message.content || message.content.trim().length === 0) return;
        if (message.attachments.size > 0) return;
        if (message.embeds.length > 0) return;
        if (/https?:\/\//i.test(message.content)) return;
        if (message.content.startsWith("!")) return;
        if (message.content.length > 2000) return;
        generalMessages.push(message.content);
    });
}

async function AIchat(message) {
    if (message.author.bot) return;

    if (message.channel.id === GENERAL_CHANNEL_ID) {
        if (!message.content || message.content.trim().length === 0) return;
        if (message.attachments.size > 0) return;
        if (message.embeds.length > 0) return;
        if (/https?:\/\//i.test(message.content)) return;
        if (message.content.startsWith("!")) return;
        if (message.content.length > 2000) return;
        generalMessages.push(message.content);
        if (generalMessages.length > 500) generalMessages.shift();
    }

    if (message.channel.id === AI_CHANNEL_ID) {
        if (generalMessages.length === 0) return message.reply("Shut up");
        const randomMessage = generalMessages[Math.floor(Math.random() * generalMessages.length)];
        
        message.reply(randomMessage).catch(() => {});
    }
}

module.exports = { AIchat, preloadMessages };
