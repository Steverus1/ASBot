const { prefix, token, debug } = require('../config.json')
const BaseCommand = require("./command.js");
const Params = require("./tools/params.js")

const execute = async (message, params, as) => {
    r = Params.Resources(params[0], params[1], params[2])
    as.setStream(message.author.id,message.author.username,r)
    message.channel.sendMessage(as.toString())
}

class Stream extends BaseCommand {
	constructor() {
        super()
        this.name = 'stream'
        this.shortDescription = 'use streams'
        this.longDescription = [
            "Use this to send resources on the structure",
            'example "$stream 15 20 2k" will stream 15 metal/hour and 2 000 cristal/hour'
        ]
        this.execute=execute
    }
}

module.exports = Stream;