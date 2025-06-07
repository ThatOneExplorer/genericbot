const { Client, Collection, Partials,EmbedBuilder, messageCreate, PermissionsBitField, MessageActionRow, MessageButton, GatewayIntentBits, IntentsBitField} = require('discord.js');
require('dotenv').config();
const { prefix } = require("./config.json")
const connection_string = process.env.CONNECTION_STRING;
const token = process.env.DISCORD_TOKEN
const ownerID = process.env.OWNERID_ID
const generic_server = process.env.GENERIC_SERVER
const { moment } = require("moment")
const client = new Client({ partials: [Partials.Channel], intents: [
IntentsBitField.Flags.Guilds,
IntentsBitField.Flags.GuildMembers,
IntentsBitField.Flags.GuildMessages,
IntentsBitField.Flags.MessageContent,
IntentsBitField.Flags.DirectMessages
] });
const fs = require('fs');
const { mongoose } = require('mongoose');
client.commands = new Collection();
    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
 const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

mongoose.set('strictQuery', false)
mongoose.connect(connection_string, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
}).then(()=>{
console.log(`Connected to MongoDB`)
}).catch((err) =>{
console.log(err)
})

client.login(token)

client.on("messageCreate", async messageCreate => {
	if(!messageCreate.guild){
		return;
	}
const args = messageCreate.content.slice(prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();

	if (!client.commands.has(command)) return;
	try {
		console.log(command)
		client.commands.get(command).execute(messageCreate, args,);
	} catch (error) {
		console.error(error);
		messageCreate.reply('there was an error trying to execute that command!');
	}
 });

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
 for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	console.log(`[EVENT REGISTERED] ${event.name}`);

	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}
function clean(text) {
	if (typeof(text) === "string")
	  return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
	else
		return text;
  }

  client.on("messageCreate", async messageCreate =>{

	const args = messageCreate.content.split(" ").slice(1);

if (messageCreate.content === (prefix + "restart")) {
	  if(messageCreate.author.id !== ownerID)
		  return;
try{
 await messageCreate.channel.send("Resarting!")
await console.log(`Restarted by ${messageCreate.author.username}`)
return process.exit();
}
catch (err) {
	messageCreate.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
  }
}
});

client.on("messageCreate", async messageCreate => {
	const args = messageCreate.content.split(" ").slice(1);
   
	if (messageCreate.content.startsWith(prefix + "eval")) {
	  if(messageCreate.author.id !== ownerID) return;
	  try {
		const code = args.join(" ");
		let evaled = eval(code);
   
		if (typeof evaled !== "string")
		  evaled = require("util").inspect(evaled);
   
		messageCreate.channel.send(clean(evaled), {code:"xl"});
	  } catch (err) {
		messageCreate.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
	  }
	}
});

client.on('messageCreate', messageCreate => {
     if (messageCreate.content === '!welcome') {
		if(!messageCreate.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
			return;
		}
		client.emit('guildMemberAdd', messageCreate.member);
	}

	else if (messageCreate.content === '!leave') {
		if(!messageCreate.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
			return;
		}
		client.emit('guildMemberRemove', messageCreate.member);
	}
});