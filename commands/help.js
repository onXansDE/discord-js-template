const Discod = require("discord.js");
const config = require("../config.json");

module.exports = {
    key: 'help',
    args: 0,
    usage: "[command]",
    guild: true,
    dm: true,
    cooldown: 5,
    aliases: ["commands","cmds"],
    description: 'List all commands or infos about a specific command',

    run(message, arguments) {
        const { commands } = message.client;

        const response = new Discod.MessageEmbed().setColor(12959520);

        if(!arguments.length) {
            response.setTitle(`Help - Command List`);
            var dsc = "Here is a list of all my Commands:\n";
            for(const cmdkey of commands.keyArray()) {
                var cmd = commands.get(cmdkey);
                dsc += `${config.prefix}${cmd.key} ${cmd.usage} - ${cmd.description}\n`;
            }
            response.setDescription(dsc);
            
            if(message.channel.type == "text") {
                const response2 = new Discod.MessageEmbed()
                                .setTitle(`Information`)
                                .setDescription(`I sent you a list of all commands by DM`)
                                .setColor(12959520);
                message.channel.send(response2);
            }
        } else {
            var cmd = commands.get(arguments[0]);

            if(!cmd) {
                response.setTitle(`Command not found`);
                response.setDescription(`This command does not exist.\nUse ${config.prefix}help to get a list of commands.`)
                response.setColor(12918816);
            } else {
                response.setTitle(`${cmd.key} Command`);
                response.setDescription(`**Description**: ${cmd.description}\n**Usage**: ${config.prefix}${cmd.key} ${cmd.usage}\n**Cooldown**: ${cmd.cooldown} seconds\n**Aliases**: ${cmd.aliases.join(", ")}`);
                
                if(message.channel.type == "text") {
                    const response2 = new Discod.MessageEmbed()
                                    .setTitle(`Information`)
                                    .setDescription(`I sent you information about this command by DM`)
                                    .setColor(12959520);
                    message.channel.send(response2);
                }
            }
        }

        message.author.send(response);
    }
}