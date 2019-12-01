const { prefix, token, debug } = require('../config.json')
const Alliance = require('./model/alliance.js')

class BaseCommand {
    constructor() {
        this.name = "debug"
        this.shortDescription = 'someone should describe this'
        this.longDescription = ['//TODO add documentation']
        this.execute =  (message, params, as) => debug && message.channel.send("implement me")
    }

    help(message){
        message.channel.send(["**"+this.name+"**"].concat(this.longDescription).join("\n"))
    }

    async eval(message){
        let { result, params, help } = this.isMatch(message)
        debug && console.log(this.name + " evaluating: " + result)
        return result && await this._execute(message, params, help)
    }

    isMatch(message){
        let tmpParams = message.content.split(" ").slice(1)
        let params = []
        for(let param of tmpParams)
            if(param != undefined)
                params.push(param)
        return {
            result : message.content.substr(1).startsWith(this.name),
            params : params,
            help : params[0] == "help"
        }
    }

    async _execute(message, params, help){
        if(help){
            this.help(message)
            return true
        }
        let as = new Alliance(message.channel.name)
        if(await as.isInit() || this.name == "subscribe"){
            as.tick()
            await this.execute(message, params, as)
            await as.save();
            return true
        }
        message.channel.send("Please subscribe the channel: $help for help")
        return true
    }
}

module.exports = BaseCommand;