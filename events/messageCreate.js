const { censorfunction } = require("../utils/censorfunction");
const { modmail } = require("../utils/modmail");
module.exports = {
  name: "messageCreate",
  async execute(message) {
    await censorfunction(message); 
    await modmail(message)
  }
};