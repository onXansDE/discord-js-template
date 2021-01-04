const Discod = require("discord.js");
const config = require("../config.json");

module.exports = {
    key: 'ping',
    args: 0,
    usage: "",
    guild: true,
    dm: false,
    cooldown: 5,
    aliases: ["pn"],
    roles: [],
    description: 'A Template command',

    run(message, arguments) {
        message.reply("Pong!")
    }
}