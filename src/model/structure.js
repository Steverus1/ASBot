const { prefix, token, debug } = require('../../config.json')
const storage = require('./storage.js');

class Structure {
	constructor(name, initState) {
        this.name=name
        this.statePromise = storage.getItem(name)
        this.state = undefined
        this.initState = initState;
    }

    async isInit(){
        this.state =  await this.statePromise
        if(this.state == undefined){
            return false
        }
        this.init = true
        return true
    }

    async reset(){
        await storage.setItem(this.name,undefined)
        this.state = undefined
    }

    async start(){
        if(this.state == undefined){
            this.state = this.initState();
            await storage.setItem(this.name, this.state)
            return this
        }
        return this
    }

    async save(){
        await storage.setItem(this.name,this.state)
    }
}

module.exports = Structure;