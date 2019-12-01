const { prefix, token, debug } = require('../config.json')
const BaseCommand = require("./command.js");
const Params = require("./tools/params.js")

const execute = async (message, params, as) => {
    r = Params.Resources(params[0], params[1], params[2])
    time = Params.Time(params[3])
    as.addTransit(message.author.id,message.author.username,r,time)
    message.channel.sendMessage(as.toString())
}

class Send extends BaseCommand {
	constructor() {
        super()
        this.name = 'send'
        this.shortDescription = 'send resource with freighters'
        this.longDescription = [
            "Use this to send resources on the structure",
            'example "$send 15 20 30k 1:00" will send a shipment arriving in 1hour'
        ]
        this.execute=execute
    }
}

module.exports = Send;