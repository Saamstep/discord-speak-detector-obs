const Discord = require('discord.js');
const OBSWebSocket = require('obs-websocket-js');
const assert = require('assert');

const obs = new OBSWebSocket();
const client = new Discord.Client();

client.config = require('./config.json');

const connect = (live) => { 
    assert(live != null);
    live.join().then(c => c.voice.setSelfMute(true));
    console.log(`[Bot] Connected to ${live.name}`);
}

const disconnect = (live) => {
    live.leave();
    console.log("[Bot] Disconnected from voice channel.");
}

const permCheck = (msg) => {
    assert(msg != null);
    return msg.member.roles.cache.has(msg.guild.roles.cache.find(r => r.name == client.config.perms || r.id == client.config.perms).id);
}

obs.connect({address: client.config.websocket}).catch(e => console.error("[OBS] " + e.error));

obs.on('ConnectionClosed', (data) => {
    console.log("[OBS] Retrying in 10 seconds...");
    setTimeout(() => {
        obs.connect({address: client.config.websocket}).catch(e => console.error("[OBS] " + e.error));
    }, 10000);

});

obs.on('ConnectionOpened', (data) => {
    console.log("[OBS] Connected");
});

obs.on('AuthenticationFailure', (data) => {
    console.log("[OBS] Authentication to the websocket has failed please try again.");
    process.exit(1);
})

client.on('ready', () => {
    let guild = client.guilds.cache.get(client.config.guild);
    let vc =  guild.channels.cache.get(client.config.liveChannelID);

    assert(vc != null);
    assert(guild != null);

    connect(vc);

    for(i in client.config.casters) {
        assert(client.config.casters != null);
        obs.send("SetSceneItemRender", {"scene-name": client.config.scene_name, source: client.config.casters[i], render: false}).catch(e => console.error("[OBS] " + e.error));
    }

    client.user.setPresence({status: 'invisible'});

    console.log("[Bot] Initalized");
});

client.on('message', msg => {
    if(msg.author.bot) return;
    
    if(msg.content.startsWith(client.config.prefix + "join") && permCheck(msg)) {
        let vc =  msg.guild.channels.cache.get(client.config.liveChannelID);
        assert(vc != null);
        connect(vc);
    }

    if(msg.content.startsWith(client.config.prefix + "leave") && permCheck(msg)) {
        let vc =  msg.guild.channels.cache.get(client.config.liveChannelID);
        assert(vc != null);
        disconnect(vc);
    }
});

client.on('guildMemberSpeaking', (member, speaking) => {
    let guild = client.guilds.cache.get(client.config.guild).catch(e => console.error("[Bot] " + e));
    assert(guild != null);

    if(member.guild.id != guild.id) return;
    if(client.config.casters.some(usr => member.user.id == usr)) {
        obs.send("SetSceneItemRender", {"scene-name": client.config.scene_name, source: member.user.id, render: speaking.bitfield == 1}).catch(e => console.error("[OBS] " + e.error));
    }
});

client.login(client.config.token).catch(e => console.error("[Bot] " + e));

