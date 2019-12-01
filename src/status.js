const { prefix, token, debug } = require('../config.json')
const BaseCommand = require("./command.js");

const execute = async (message, params, as) => {
    message.channel.send(as.toString())
}

class Status extends BaseCommand {
	constructor() {
        super()
        this.name = 'status'
        this.shortDescription = 'display current status'
        this.execute = execute;
    }
}

module.exports = Status;