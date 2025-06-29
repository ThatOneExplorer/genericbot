const mongoose = require('mongoose');

const supportbanSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('supportban', supportbanSchema);