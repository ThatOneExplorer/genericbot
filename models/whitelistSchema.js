const mongoose = require('mongoose');
const whitelistSchema = new mongoose.Schema({
  GuildID: {
    type: String,
    required: true,
    unique: true
  },
  Words: {
    type: [String],
    default: []
  }
});

module.exports = mongoose.model('whitelist', whitelistSchema);
