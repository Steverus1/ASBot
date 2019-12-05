const { prefix, token, debug } = require('../config.json')
const BaseCommand = require("./command.js");

const execute = async (message, params, as) => {
    message.channel.send(as.rankDisplay())
}

class Rank extends BaseCommand {
	constructor() {
        super()
        this.name = 'rank'
        this.shortDescription = 'display resource ranking'
        this.execute = execute;
    }
}

module.exports = Rank;