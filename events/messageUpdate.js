const { censorfunction } = require("../utils/censorfunction");

module.exports = {
  name: "messageUpdate",
  async execute(oldMessage, newMessage) {
    
    if (!newMessage || !newMessage.content || newMessage.author?.bot) return;

    await censorfunction(newMessage);
  }
};
