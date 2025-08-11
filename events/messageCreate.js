const { censorfunction } = require("../utils/censorfunction");
const { modmail } = require("../utils/modmail");
const {AIchat} = require("../utils/aichat")
module.exports = {
  name: "messageCreate",
  async execute(message) {
    await censorfunction(message); 
    await modmail(message);
    await AIchat(message);
  }
};