const moment = require("moment")
require('dotenv').config();
const mongoose = require("mongoose")
const Open = require("../models/ModMailSchema");
const Discord = require('discord.js')
const prefix = require("../config.json")
const ownerID = process.env.OWNERID_ID
const generic_server = process.env.GENERIC_SERVER
const THREAD_CATEGORY_ID = "864306096624893973";
module.exports = {
	name: 'messageCreate',
	async execute(messageCreate) {
        try{
        const currenttime = moment(Date.now()).format('DD/MM/YY'); 
        const args = (messageCreate.content.slice(prefix.length).trim().split(/ +/g))
        const server = messageCreate.client.guilds.cache.find(g => g.id === generic_server);
        if(!server){
            return console.log(`Could not find guild with ID ${generic_server}`);
        }
        const channel = await messageCreate.client.channels.cache.find(channel => channel.name === `${messageCreate.author.id}`);
        const isLink = new RegExp(/https?:\/\/\S+/g).test(messageCreate.content);

        
    if(!messageCreate.guild){ 
        console.log("recieved DM embed")
  if(messageCreate.author.bot){
    console.log("is bot")
      return;
  }
  else if(!messageCreate.author.bot){
console.log("is not bot")
        if(!channel){
console.log("ticket channel does not exist")
        const threadcat = await messageCreate.client.channels.fetch(THREAD_CATEGORY_ID).catch(e => {console.log(`There was an error: ${e}`)});
        const ticket = await server.channels.create({name: `${messageCreate.author.id}`, parent: threadcat}).catch(e => {console.log(`There was an error: ${e}`)});
        
       let ticketembed = new Discord.EmbedBuilder()
.setAuthor({name: `${messageCreate.author.tag}`})
.setTitle(`Modmail Incoming!`)
.addFields(
    {name: `User:`, value: `${messageCreate.author.username}`},
    {name: `UserID:`, value:`${messageCreate.author.id}`}
)

await ticket.send(`@everyone`).catch(e => {console.log(`There was an error: ${e}`)});
await ticket.send({embeds: [ticketembed]}).catch(e => {console.log(`There was an error: ${e}`)});
ticket.send(`**FROM: ${messageCreate.author.username}** - ${messageCreate.content}`).catch(e => {console.log(`There was an error: ${e}`)});
if (messageCreate.attachments.size > 0) {
    await ticket.send({ files: messageCreate.attachments.map(a => a.url) });
}
messageCreate.author.send({content: `Thank's for opening a support thread! Your message has been sent. A member of staff will be with you soon to assist you, please have patience.`})
   }

  else if(channel){
    const channel = await messageCreate.client.channels.cache.find(channel => channel.name === `${messageCreate.author.id}`);
     // console.log(channel)
     channel.send({content: `**FROM: ${messageCreate.author.username}** - ${messageCreate.content}`}).catch(e => {console.log(`There was an error: ${e}`)});
    }
console.log(messageCreate.author.id)
console.log(server.name)
  }
}


if (messageCreate.channel.parentId === THREAD_CATEGORY_ID){
    const ticketuser =  messageCreate.client.users.cache.get(messageCreate.channel.name)
    if(messageCreate.content === prefix + "list"){
     
}
if(messageCreate.content === "!w"){
    messageCreate.delete().catch(O_o=>{}); 
    messageCreate.channel.send({content: `**FROM: ${messageCreate.author.username}** - Hello there! You have successfully reached ${messageCreate.guild.name} Staff team! I'm ${messageCreate.author.username}from the staff team, How can i assist you? `}).catch(e => {console.log(`There was an error: ${e}`)});
   ticketuser.send({content: `**FROM: ${messageCreate.author.username}** - Hello there! You have successfully reached ${messageCreate.guild.name} Staff team! I'm ${messageCreate.author.username} from the staff team, How can i assist you? `}).catch(e => {console.log(`There was an error: ${e}`)});
}

   if(messageCreate.content === "!close"){
        

      await messageCreate.channel.send(`Closing this thread in 5 seconds!`).catch(e => {console.log(`There was an error: ${e}`)});
       setTimeout(() =>{
          
 ticketuser.send(`This thread has now been closed! Feel free to reopen another thread if you require more assistance`).catch(e => {console.log(`There was an error: ${e}`)});

 messageCreate.channel.delete();

      }, 5000)

    }

    if(messageCreate.content.startsWith("!r")){
        let messagereplything = args.slice(1).join(' ');
        messageCreate.delete().catch(O_o=>{}); 
        ticketuser.send({content: `**FROM: ${messageCreate.author.username}** - ${messagereplything}`}).catch(e => {console.log(`There was an error: ${e}`)});
        messageCreate.channel.send({content: `**FROM: ${messageCreate.author.username}** - ${messagereplything}`}).catch(e => {console.log(`There was an error: ${e}`)});
        }
        if(messageCreate.content.startsWith("!ar")){
            let messagereplything = args.slice(1).join(' ');
            messageCreate.delete().catch(O_o=>{}); 
            ticketuser.send({content: `**FROM: Anonymous Staff** - ${messagereplything}`}).catch(e => {console.log(`There was an error: ${e}`)});
            messageCreate.channel.send({content: `**FROM: Anonymous Staff** - ${messagereplything}`}).catch(e => {console.log(`There was an error: ${e}`)});
            }
        
}
const { censor } = require('./censor.json');
const { whitelist } = require('./whitelist.json');
if(messageCreate.author.bot) return;

console.log(`${messageCreate.author.username}, ${currenttime}: ${messageCreate.content}`)


const lm = messageCreate.content.toLowerCase();

const includedBadWord = censor.some(
                    (element) => lm.indexOf(element) !== -1
);
const ignorebadword = whitelist.some((element) => lm.indexOf(element) !== -1)

const censoralert = await messageCreate.client.channels.fetch("864306096234692615").catch(e => {console.log(`There was an error: ${e}`)});

if(includedBadWord){
    console.log("bad word recieved")
    if(!messageCreate.guild){
        return console.log("not in guild");
    }
if(messageCreate.member.permissions.has(Discord.PermissionsBitField.Flags.ManageMessages)){
    return console.log("has manage messages permissions ");
}
    if(ignorebadword){
        return console.log("ignoring");
    }
    if(isLink){
        return console.log("is link");
    }
console.log(`bad word recieved`)
    const alert = new Discord.EmbedBuilder()
           .setTitle("Censor Alert Triggered")
           .addFields(
             { name: "Author", value: `<@${messageCreate.author.id}>`, inline: true },
             { name: "New Content", value: messageCreate.content },
             { name: "Message Link", value: `[Jump to Message](${messageCreate.url})` }
           )
           .setColor("Red");
    
      await censoralert.send({embeds: [alert]}).catch(e => {console.log(`There was an error: ${e}`)})
      await messageCreate.author.send(`You can't send that here!`).catch(e => {console.log(`There was an error: ${e}`)})
     if (messageCreate.deletable) {
          await messageCreate.delete().catch(e => console.log(`Delete failed: ${e}`));
        }
    }
    else if (!includedBadWord){
    return;
    }

if(!messageCreate.author.bot){
    return console.log(`${messageCreate.author.username}: @${currenttime} : ${messageCreate.content}`)
}
} catch(e){
    console.log(e)
    let errorembed = new Discord.EmbedBuilder()
    .setTitle(`An error has occured!`)
    .setDescription(`An error has occured while trying to perform this action, the owner of this bot has been notified.`)
     .setColor("Red")
   await messageCreate.reply({embeds: [errorembed]})
   const owner = messageCreate.guild.members.cache.get(ownerID)
   return owner.send(`${e}`)
}
    }
}
