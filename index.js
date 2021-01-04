const Discord = require("discord.js");
const config = require("./config.json");
const fs = require("fs");

var client = new Discord.Client({partials: ["MESSAGE","CHANNEL","REACTION"]});

client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection();

// Startup
client.once("ready", () => {
    console.log("Ready! Logged in as %s",client.user.tag);

    var cmdfiles = fs.readdirSync('./commands').filter(file => file.endsWith('js'));
    for(const file of cmdfiles) {
        var cmd = require(`./commands/${file}`);
        client.commands.set(cmd.key, cmd);
        client.cooldowns.set(cmd.key, new Discord.Collection());
    }
});

//Message
client.on("message", (msg) => {
    if(msg.author.bot) return; // Message is from a Bot

    //Command
    if(msg.content.startsWith(config.prefix)) {

        const args = msg.content.slice(config.prefix.length).trim().split(" ");
        const cmdm = args.shift().toLowerCase();

        const cmd = client.commands.get(cmdm) || client.commands.find((c => c.aliases.includes(cmdm)));

        if (!cmd) {
            // Command not found
            var response = new Discord.MessageEmbed()
                            .setTitle(`Command not found`)
                            .setDescription(`This command does not exist.\nUse ${config.prefix}help to get a list of commands.`)
                            .setColor(12918816);
            msg.channel.send(response);
            return;
        };
        //Check Guild
        if(!cmd.guild && msg.channel.type == "text") {
            // Command is not executable inside dms
            var response = new Discord.MessageEmbed()
                            .setTitle(`Command is not executable in Guilds`)
                            .setDescription(`Please send this command by DM.`)
                            .setColor(12918816);
            msg.channel.send(response);
            return;
        }

        //Check DM
        if(!cmd.dm && msg.channel.type == "dm") {
            // Command is not executable inside dms
            var response = new Discord.MessageEmbed()
                            .setTitle(`Command is not executable in DMs`)
                            .setDescription(`Please send this command to a text channel inside a guild.`)
                            .setColor(12918816);
            msg.channel.send(response);
            return;
        }

        if(cmd.roles.length) {
            if(msg.channel.type == "text") {
                var perm = false;
                for(const r of cmd.roles) {
                    if(msg.member.roles.cache.find(role => role.id == r)) {
                        perm = true;
                        break;
                    }
                }
                if(!perm) {
                    var response = new Discord.MessageEmbed()
                            .setTitle(`Command with permissions`)
                            .setDescription(`A specific permission is needed to use this command.\nPlease ask the server admin if you think this is an error!`)
                            .setColor(12918816);
                    msg.channel.send(response);
                    return;
                }
            } else {
                var response = new Discord.MessageEmbed()
                            .setTitle(`Command with permissions`)
                            .setDescription(`A specific permission is needed to use this command.\nSo it can only be executed in Guilds.`)
                            .setColor(12918816);
                msg.channel.send(response);
                return;
            }
        }

        //Check arguments
        if(args.length < cmd.args) {
            // Not enough arguments
            var response = new Discord.MessageEmbed()
                            .setTitle(`Incorrect Arguments`)
                            .setDescription(`Correct usage: ${config.prefix}${cmdm} ${cmd.usage}`)
                            .setColor(12918816);
            msg.channel.send(response);
            return;
        };

        try {

            const now = Date.now();
            const times = client.cooldowns.get(cmd.key);
            const cooldownAmount = (cmd.cooldown || 3) * 1000;
            if(times.has(msg.author.id)) {
                const expiration = times.get(msg.author.id) + cooldownAmount;

                if (now < expiration) {
                    //Cooldown not expired
                    const timeLeft = (expiration - now) / 1000;
                    var response = new Discord.MessageEmbed()
                                    .setTitle(`Cooldown`)
                                    .setDescription(`Please wait ${timeLeft.toFixed(0)} more seconds before executing this command again.`)
                                    .setColor(12918816);
                    msg.channel.send(response);
                    return;
                } else {
                    times.delete(msg.author.id);
                }
            }

            cmd.run(msg, args);

            times.set(msg.author.id, now);
        } catch (error) {
            console.error(error);
            // Error while executing command
        }
    }
});




client.login(config.token);