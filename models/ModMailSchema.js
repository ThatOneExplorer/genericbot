const mongoose = require("mongoose")

let ModMailSchema = new mongoose.Schema ({
UserID: String,
Open: String,
})

const MessageModel = module.exports = mongoose.model('ModMail', ModMailSchema);