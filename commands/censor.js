const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const prefix = require("../config.json").prefix;
const Censor = require("../models/censorSchema");

module.exports = {
  name: "censor",
  description: "adds, removes and inspects the censor list",

  async execute(messageCreate) {
    const args = messageCreate.content.slice(prefix.length).trim().split(/ +/g);
    const subcommand = args[1];
    const word = args[2]?.toLowerCase();

    if (!messageCreate.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      return messageCreate.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Uh oh!")
            .setDescription("You do not have the permission to execute this command.")
            .setColor("Red")
        ]
      });
    }

    if (!subcommand || !["add", "remove", "list"].includes(subcommand)) {
      return messageCreate.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Uh oh!")
            .setDescription("Please provide a valid subcommand: `add`, `remove`, or `list`.")
            .setFooter({ text: "!censor add/remove/list [word]" })
            .setColor("Red")
        ]
      });
    }

    let doc = await Censor.findOne({ GuildID: messageCreate.guild.id });
    if (!doc) {
      doc = new Censor({ GuildID: messageCreate.guild.id, Words: [] });
    }

    if (subcommand === "add") {
      if (!word) return messageCreate.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle(`Uh oh!`)
            .setDescription(`Please provide a word to be added to the censor list.`)
            .setColor("Red")
        ]
      });
      if (doc.Words.includes(word)) {
        return messageCreate.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle(`Uh Oh!`)
              .setDescription(`That word is already in the censor list!`)
              .setColor("Red")
          ]
        });
      }
      doc.Words.push(word);
      await doc.save();
      return messageCreate.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Word Added")
            .setDescription(`Successfully added "${word}" to the censor list.`)
            .setColor("Green")
        ]
      });
    }

    if (subcommand === "remove") {
      if (!word) return messageCreate.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle(`Uh oh!`)
            .setDescription(`Please provide a word to be removed from the censor list.`)
            .setColor("Red")
        ]
      });
      if (!doc.Words.includes(word)) {
        return messageCreate.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle(`Uh Oh!`)
              .setDescription(`That word is not in the censor list!`)
              .setColor("Red")
          ]
        });
      }
      doc.Words = doc.Words.filter(w => w !== word);
      await doc.save();
      return messageCreate.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Word Removed")
            .setDescription(`Removed "${word}" from the censor list.`)
            .setColor("Orange")
        ]
      });
    }

    if (subcommand === "list") {
      if (!doc.Words.length) {
        return messageCreate.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle(`Censor List for ${messageCreate.guild.name}`)
              .setDescription("No words currently censored.")
              .setColor("Blue")
          ]
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
            new EmbedBuilder()
              .setTitle(`Censor List for ${messageCreate.guild.name} (Part ${counter})`)
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
          new EmbedBuilder()
            .setTitle(`Censor List for ${messageCreate.guild.name} (Part ${counter})`)
            .setDescription(currentDescription)
            .setColor("Blue")
        );
      }

      for (const embed of embeds) {
        await messageCreate.reply({ embeds: [embed] });
      }
    }
  }
};