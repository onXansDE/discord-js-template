const Discord = require("discord.js");
const {
    client
} = require("./index.js");
const fs = require("fs");
const ytdl = require("ytdl-core")

module.exports = {
    connections: new Discord.Collection(),
    async joinvoice(channel, force) {
        if (force) {
            try {
                channel.join().then(con => {
                    this.connections.set(channel.guild.id, con);
                })
            } catch {
                console.log("Error joining Voice channel.");
            }
        } else {
            if (!this.connections.has(channel.guild.id)) {
                try {
                    var con = channel.join();
                } catch {
                    console.log("Error joining Voice channel.");
                }
                connections.set(channel.guild.id, con);
            }
        }
    },
    async leavevoice(guild) {
        const con = this.connections.get(guild.id);
        if(con) {
            con.disconnect();
            this.connections.delete(guild.id);
            return;
        }
    },
    async playaudiofile(guild,file) {
        const con = this.connections.get(guild.id);
        if(con) {
            con.play(file);
            return;
        }
    },
    async playyoutube(guild,url) {
        const con = this.connections.get(guild.id);
        if(con) {
            con.play(ytdl(url));
            return;
        }
    },
    async addqueueyoutube(guild,url, member) {
        const con = this.connections.get(guild.id);
        if(con) {
            con.queue.set(member, url);
            return;
        }
    },
    async stopaudio(guild) {
        const con = this.connections.get(guild.id);
        if(con) {
            con.dispatcher.destroy();
            return;
        }
    },
    async pause(guild) {
        const con = this.connections.get(guild.id);
        if(con) {
            con.dispatcher.pause();
            return;
        }
    },
    async resume(guild) {
        const con = this.connections.get(guild.id);
        if(con) {
            con.dispatcher.resume();
            return;
        }
    },
    async setvolume(guild, volume) {
        const con = this.connections.get(guild.id);
        if(con) {
            con.dispatcher.setVolume(volume);
            return;
        }
    },
}