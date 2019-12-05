const { prefix, token, debug } = require('../config.json')
const BaseCommand = require("./command.js");
const Params = require("./tools/params.js")

const execute = async (message, params, as) => {
    r = Params.Resources(params[0], params[1], params[2])
    as.fixStream(r)
    message.channel.sendMessage(as.toString())
}

class FixStream extends BaseCommand {
	constructor() {
        super()
        this.name = 'fixstream'
        this.shortDescription = 'set total stream to as to this value'
        this.longDescription = [
            "use this command with the value currently streamed to the as to update the streaming to the as",
            'example "$fixstream 2k 2k 2k" will set the total streaming to the structure to 2k'
        ]
        this.execute=execute
    }
}

module.exports = FixStream;