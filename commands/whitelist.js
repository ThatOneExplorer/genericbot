const Discord = require("discord.js");
const prefix = require("../config.json").prefix;
const Whitelist = require("../models/whitelistSchema");

module.exports = {
  name: "whitelist",
  description: "adds, removes and inspects the whitelist",
  async execute(messageCreate) {
    if (!messageCreate.member.permissions.has(Discord.PermissionsBitField.Flags.ManageMessages)) {
      return messageCreate.reply({
        embeds: [
          new Discord.EmbedBuilder()
            .setTitle("Uh oh!")
            .setDescription("You do not have the permission to execute this command.")
            .setColor("Red"),
        ],
      });
    }

    const args = messageCreate.content.slice(prefix.length).trim().split(/ +/g);
    const subcommand = args[1];
    const word = args.slice(2).join(" ").toLowerCase();

    if (!subcommand || !["add", "remove", "list"].includes(subcommand)) {
      return messageCreate.reply({
        embeds: [
          new Discord.EmbedBuilder()
            .setTitle("Uh oh!")
            .setDescription("Please provide a valid subcommand: `add`, `remove`, or `list`.")
            .setFooter({ text: "!whitelist add/remove/list [word]" })
            .setColor("Red"),
        ],
      });
    }

    let doc = await Whitelist.findOne({ GuildID: messageCreate.guild.id });
    if (!doc) {
      doc = new Whitelist({ GuildID: messageCreate.guild.id, Words: [] });
    }

    if (subcommand === "add") {
      if (!word) {
        return messageCreate.reply({
          embeds: [
            new Discord.EmbedBuilder()
              .setTitle("Uh oh!")
              .setDescription("Please provide a word to add to the whitelist.")
              .setColor("Red"),
          ],
        });
      }
      if (doc.Words.includes(word)) {
        return messageCreate.reply({
          embeds: [
            new Discord.EmbedBuilder()
              .setTitle("Uh oh!")
              .setDescription(`"${word}" is already in the whitelist.`)
              .setColor("Red"),
          ],
        });
      }
      doc.Words.push(word);
      await doc.save();
      return messageCreate.reply({
        embeds: [
          new Discord.EmbedBuilder()
            .setTitle("Word Added")
            .setDescription(`Successfully added "${word}" to the whitelist.`)
            .setColor("Green"),
        ],
      });
    }

    if (subcommand === "remove") {
      if (!word) {
        return messageCreate.reply({
          embeds: [
            new Discord.EmbedBuilder()
              .setTitle("Uh oh!")
              .setDescription("Please provide a word to remove from the whitelist.")
              .setColor("Red"),
          ],
        });
      }
      if (!doc.Words.includes(word)) {
        return messageCreate.reply({
          embeds: [
            new Discord.EmbedBuilder()
              .setTitle("Uh oh!")
              .setDescription(`"${word}" is not in the whitelist.`)
              .setColor("Red"),
          ],
        });
      }
      doc.Words = doc.Words.filter((w) => w !== word);
      await doc.save();
      return messageCreate.reply({
        embeds: [
          new Discord.EmbedBuilder()
            .setTitle("Word Removed")
            .setDescription(`Removed "${word}" from the whitelist.`)
            .setColor("Orange"),
        ],
      });
    }

    if (subcommand === "list") {
      if (!doc.Words.length) {
        return messageCreate.reply({
          embeds: [
            new Discord.EmbedBuilder()
              .setTitle(`Whitelist for ${messageCreate.guild.name}`)
              .setDescription("No words currently whitelisted.")
              .setColor("Blue"),
          ],
        });
      }

      const maxEmbedDescriptionLength = 4096;
      let currentDescription = "";
      const embeds = [];
      let counter = 1;

      for (let i = 0; i < doc.Words.length; i++) {
        const wordLine = `${i + 1}. ${doc.Words[i]}\n`;

        if ((currentDescription + wordLine).length > maxEmbedDescriptionLength) {
          embeds.push(
            new Discord.EmbedBuilder()
              .setTitle(`Whitelist for ${messageCreate.guild.name} (Part ${counter})`)
              .setDescription(currentDescription)
              .setColor("Blue")
          );
          currentDescription = "";
          counter++;
        }
        currentDescription += wordLine;
      }

      if (currentDescription.length > 0) {
        embeds.push(
          new Discord.EmbedBuilder()
            .setTitle(`Whitelist for ${messageCreate.guild.name} (Part ${counter})`)
            .setDescription(currentDescription)
            .setColor("Blue")
        );
      }

      for (const embed of embeds) {
        await messageCreate.reply({ embeds: [embed] });
      }
    }
  },
};
