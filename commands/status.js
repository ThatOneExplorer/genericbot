const Discord = require("discord.js")
const ownerID = process.env.OWNERID_ID
module.exports ={
    name: "status",
    description: "Changes activity status",
    async execute(messageCreate, prefix){
        try{
        const args = (messageCreate.content.slice(prefix.length).trim().split(/ +/g))
        if(!messageCreate.member.permissions.has(Discord.PermissionsBitField.Flags.BanMembers)){
            let nopermission = new Discord.EmbedBuilder()
            .setTitle(`Uh oh!`)
            .setDescription(`You do not have the permission to execute this command. This incident will be reported!`)
            .setColor("Red")
            return messageCreate.reply({embeds: [nopermission]});
        }


        let content = args.slice(1).join(" ")
        if(!content){
            let nocontent = new Discord.EmbedBuilder()
            .setTitle(`No message provided`)
            .setDescription(`You need to provide a status message!`)
            .setColor("Red")
            return messageCreate.reply({embeds: [nocontent]})
        }
        let successembed = new Discord.EmbedBuilder()
        .setTitle(`Status message changed!`)
        .setDescription(`Successfully set activity status to ${content}`)
        .setColor("Green")
    await messageCreate.client.user.setActivity(`${content}`)
    messageCreate.channel.send({embeds: [successembed]})
   
        

} catch(e){
    console.log(e)
    let errorembed = new Discord.EmbedBuilder()
    .setTitle(`An error has occured!`)
    .setDescription(`An error has occured while trying to perform this action, the owner of this bot has been notified.`)
     .setColor("Red")
   await messageCreate.reply({embeds: [errorembed]})
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
}