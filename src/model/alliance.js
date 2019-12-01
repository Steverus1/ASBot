const { prefix, token, debug } = require('../../config.json')
const Structure = require('./structure.js');
const StatusView = require('./view/statusView.js');
const moment = require('moment');

const initState = () => {return {resources : {m:0,g:0,c:0},rmax:12000, players : {}, streams : {}, freights : [], queue : [], last : new moment()}}
class Alliance extends Structure{
	constructor(name) {
        super(name, initState)

    }

    tick(){
        if(this.state == undefined){
            return
        }
        let tmpMoment = this.state.last
        console.log(this.state.freights)
        this.state.freights = this.state.freights.sort((it,itb) => it.data[4]-itb.data[4])
        this.state.last = new moment()
        let diff = moment.duration(this.state.last.diff(tmpMoment)).asMilliseconds()
        for(let it of this.state.freights){
            it.data[4]-=diff
        }
        let it = this.getTotalStream()
        this.state.resources.m+=it.m * diff / (60 * 60 * 1000)
        this.state.resources.g+=it.g * diff / (60 * 60 * 1000)
        this.state.resources.c+=it.c * diff / (60 * 60 * 1000)
        while(this.state.freights.length > 0 && this.state.freights[0].data[4]< 0){
            this.state.resources.m+=this.state.freights[0].data[1]
            this.state.resources.g+=this.state.freights[0].data[2]
            this.state.resources.c+=this.state.freights[0].data[3]
            this.state.freights = this.state.freights.slice(1)
        }
        if(this.state.resources.m > this.state.rmax){
            this.state.resources.m = this.state.rmax
        }
        if(this.state.resources.g > this.state.rmax){
            this.state.resources.g = this.state.rmax
        }
        if(this.state.resources.c > this.state.rmax){
            this.state.resources.c = this.state.rmax
        }
        
    }

    setResources(r, rmax){
        this.state.resources = r
        this.state.rmax = rmax
    }

    setStream(playerID, playerName,r){
        if(this.state.players[playerID] == undefined){
            this.state.players[playerID] = playerName
        }
        this.state.streams[this.state.players[playerID]] = r
    }

    addTransit(playerID, playerName,r, duration){
        if(this.state.players[playerID] == undefined){
            this.state.players[playerID] = playerName
        }
        this.state.freights.push({
            time:moment(),
            data:[this.state.players[playerID], r.m, r.g, r.c, duration]
        })
    }

    getTotalStream(){
        let r = {m:0,g:0,c:0}
        console.log(this.state.streams)
        for(let [key, it] of Object.entries(this.state.streams)){        
                let it = this.state.streams[key];
                console.log(it)
                r.m+=it.m 
                r.g+=it.g 
                r.c+=it.c 
        }
        return r
    }

    toString(){
        
        return "```" + new StatusView(this.state.freights.map(it => it.data),this.state.resources, this.state.rmax, this.getTotalStream()).display() + "```"
    }

}

module.exports = Alliance;