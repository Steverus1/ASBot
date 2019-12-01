const { prefix, token, debug } = require('../config.json')
const BaseCommand = require("./command.js");
const Params = require("./tools/params.js")

const execute = async (message, params, as) => {
    r = Params.Resources(params[0], params[1], params[2])
    rmax = Params.getNumber(params[3])
    as.setResources(r,rmax)
    message.channel.sendMessage(as.toString())
}

class Set extends BaseCommand {
	constructor() {
        super()
        this.name = 'set'
        this.shortDescription = 'set data'
        this.longDescription = [
            "Use this to set resources on the structure",
            'example "$set 15 20 30k 100k" will put the stock at 15 metal 20 gas and 30 0000 cristal',
            "and the max at of each at 100 000"
        ]
    
        this.execute=execute
    }



}

module.exports = Set;