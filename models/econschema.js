const mongoose = require("mongoose");

const EconSchema = new mongoose.Schema({
  GuildID: { type: String, required: true },
  UserID: { type: String, required: true },


  balance: {
    pounds: { type: Number, default: 3 },
    shillings: { type: Number, default: 0 },
    pence: { type: Number, default: 0 }
  },

  econStats: {
    type: Array,
    default: []
  }
});

module.exports = mongoose.model("Economy", EconSchema);
