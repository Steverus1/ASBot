const Discord = require('discord.js')
const { prefix, token, debug, version } = require('./config.json')
const client = new Discord.Client()
const commands = []
const msg = [
    `__**Starborne Transit Tracker Help**__ _(v.${version})_`,
    "Allows tracking of resources inbound to the AS",
    "Write $command help for more info",
    "__Commands__:"]
loadCommands = (tmpCommands) => {
    console.log(tmpCommands)
    tmpCommands.forEach(function (Command) {
        Command = require('./src/' + Command);
        commands.push(new Command());
    });
};

client.once('ready', ()=> {
    console.log('Ready!')
})

client.on('message',async message => {
    if(message.content.startsWith(prefix)){
        text = message.content.substr(1)
        console.log("message received: "+ text)
        if(text == "help"){
            help = msg.concat([])
            commands.forEach( it => help.push("**"+it.name+"**: "+it.shortDescription))
            message.channel.send(help.join("\n")) 
            return
        }
        target = undefined
        for (let c of commands){
            if(await c.eval(message)){
                target = c
                break
            }
        }
        console.log(target)
        if( target == undefined){
            message.channel.send(text+ " command not found type $help") 
        }
    }
})

loadCommands(["command.js", "status.js","subscribe.js","set.js","send.js", "stream.js","rank.js","fixstream.js"]);
client.login(token);