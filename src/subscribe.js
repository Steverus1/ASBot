const { prefix, token, debug } = require('../config.json')
const BaseCommand = require("./command.js");

const execute = async (message, params, as) => {
    state = await as.start()
    if(params[0] == "stop"){
        await as.reset()
        state = "channel data deleted"
    }
    debug && message.channel.send(state.toString())
}

class Subscribe extends BaseCommand {
	constructor() {
        super()
        this.name = 'subscribe'
        this.shortDescription = 'allow to start the tracking on this channel'
        this.longDescription = ["Use this command to subscribe the current channel", "Use stop to reset all data"]
        this.execute = execute
    }
}

module.exports = Subscribe;