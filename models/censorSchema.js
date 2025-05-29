const mongoose = require('mongoose');
const censorSchema = new mongoose.Schema({
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

module.exports = mongoose.model('Censor', censorSchema);
