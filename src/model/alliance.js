const { prefix, token, debug } = require('../../config.json')
const Structure = require('./structure.js');
const StatusView = require('./view/statusView.js');
const RankView = require('./view/rankView.js');
const moment = require('moment');
const numeral = require('numeral');

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
        this.state.last = new moment()
        let diff = moment.duration(this.state.last.diff(tmpMoment)).asMilliseconds()
        this.updateStreamContribution(diff)
        this.manageTransit(diff);
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

    manageTransit(diff){
        for(let it of this.state.freights){
            it.data[4]-=diff
        }
        this.state.freights = this.state.freights.sort((it,itb) => it.data[4]-itb.data[4])
        while(this.state.freights.length > 0 && this.state.freights[0].data[4]< 0){
            this.state.resources.m+=this.state.freights[0].data[1]
            this.state.resources.g+=this.state.freights[0].data[2]
            this.state.resources.c+=this.state.freights[0].data[3]
            this.updateContribution(this.state.freights[0].playerId,{m:this.state.freights[0].data[1],g:this.state.freights[0].data[2],c:this.state.freights[0].data[3]})
            this.state.freights = this.state.freights.slice(1)
        }
    }

    updateStreamContribution(diff){
        for(let [key, it] of Object.entries(this.state.streams)){
                it = this.state.streams[key]
                this.state.players[key].r.m+=it.m * diff / (60 * 60 * 1000.0)
                this.state.players[key].r.g+=it.g * diff / (60 * 60 * 1000.0)
                this.state.players[key].r.c+=it.c * diff / (60 * 60 * 1000.0)
        }
        let it = this.getTotalStream()
        this.state.resources.m+=it.m * diff / (60 * 60 * 1000.0)
        this.state.resources.g+=it.g * diff / (60 * 60 * 1000.0)
        this.state.resources.c+=it.c * diff / (60 * 60 * 1000.0)
    }

    updateContribution(playerId, r){
        console.log(this.state.players[playerId])
        this.state.players[playerId].r.m += r.m
        this.state.players[playerId].r.g += r.g
        this.state.players[playerId].r.c += r.c
    }

    setResources(r, rmax){
        if(!("0" in this.state.players)){
            this.state.players["0"] = {name:"unaccounted",r:{m:0,g:0,c:0}}
        }
        
        this.state.players["0"].r.m = r.m - this.state.resources.m
        this.state.players["0"].r.g = r.g - this.state.resources.m
        this.state.players["0"].r.c = r.c - this.state.resources.m
        this.state.resources = r
        this.state.rmax = rmax
    }

    setStream(playerID, playerName,r){
        if(!(playerID in this.state.players)){
            this.state.players[playerID] = {name: playerName ,r:{m:0,g:0,c:0}}
        }
        this.state.streams[playerID] = r
    }

    fixStream(r){
        if(!("0" in this.state.players)){
            this.state.players["0"] = {name: "unaccounted" ,r:{m:0,g:0,c:0}}
        }
        if(!("0" in this.state.streams)){
            this.state.streams["0"] = {m:0,g:0,c:0}
        }
        let rTotal = this.getTotalStream()
        rTotal = {
            m:rTotal.m-this.state.streams["0"].m,
            g:rTotal.g-this.state.streams["0"].g,
            c:rTotal.c-this.state.streams["0"].c}
        this.state.streams["0"] = {m:r.m-rTotal.m, g:r.g-rTotal.g,c:r.c-rTotal.c}
    }

    addTransit(_playerID, playerName,r, duration){
        if(!(_playerID in this.state.players)){
            console.log("=== init player ===")
            this.state.players[_playerID] = {name:playerName,r:{m:0,g:0,c:0}}
        }
        this.state.freights.push({
            time:moment(),
            playerId:_playerID,
            data:[_playerID, r.m, r.g, r.c, duration]
        })
    }

    getTotalStream(){
        let r = {m:0,g:0,c:0}
        for(let [key, it] of Object.entries(this.state.streams)){        
                let it = this.state.streams[key];
                r.m+=it.m 
                r.g+=it.g 
                r.c+=it.c 
        }
        return r
    }

    getTotalFreight(){
        let r = {m:0,g:0,c:0}
        for(let i in this.state.freights){  
            let it = this.state.freights[i]
            r.m+=it.data[1] 
            r.g+=it.data[2]  
            r.c+=it.data[3] 
        }
        return r
    }

    getDataForFull(){
        let totalFreight = this.getTotalFreight()
        let stream = this.getTotalStream()
        let totalR = {m:this.state.resources.m + totalFreight.m, g:this.state.resources.g + totalFreight.g,c:this.state.resources.c + totalFreight.c}
        let diffMetal = stream.m > 0 ? (this.state.rmax - totalR.m) / (stream.m ) * 60 * 60 * 1000.0 : Number.MAX_VALUE
        let diffGas = stream.g > 0 ? (this.state.rmax - totalR.g) / (stream.g )*60 * 60 * 1000.0 : Number.MAX_VALUE
        let diffCristal = stream.c > 0 ? (this.state.rmax - totalR.c) / (stream.c )*60 * 60 * 1000.0 : Number.MAX_VALUE
        let diffUntilFull = Math.min(diffMetal, diffGas, diffCristal)
        let text = "AS Full @"
        let time = diffUntilFull
        if(diffUntilFull == Number.MAX_VALUE && this.state.freights.length > 0){
            text =  "RSS @ AS "
            diffUntilFull = 0
            time = this.state.freights.map(it => it.data[4])[this.state.freights.length-1][4]
        }
        else if (diffUntilFull == Number.MAX_VALUE) {
            text =  "RSS @ AS "
            diffUntilFull = 0
            time = 0
        }
        return [text, numeral(totalR.m + diffUntilFull/ (60 * 60 * 1000.0) * stream.m).format(),  numeral(totalR.g + diffUntilFull/ (60 * 60 * 1000.0) * stream.g).format(), numeral(totalR.c + diffUntilFull/ (60 * 60 * 1000.0) * stream.c).format(), time != 0? moment.duration(time).humanize() : 0 ]
    }


    getDataForRank(){
        let data = []
        for(let [key, value] of Object.entries(this.state.players)){
            if(key != "0") {
                data.push([value.name, value.r.m, value.r.g, value.r.c,value.r.m + value.r.g + value.r.c])
            }
        }
        return data.sort((a,b)=> -((a[1]+a[2]+a[3])-(b[1]+b[2]+b[3]))).slice(0,10)
    }

    getTransitData(){
        let tmp =  this.state.freights.slice()
        for (let i in tmp){
			console.log(tmp[i].playerId)
			console.log(this.state.players[tmp[i].playerId])
            tmp[i].data[0] = this.state.players[tmp[i].playerId].name
        }
        return tmp.map(it => it.data)
    }

    toString(){
        
        return "```" + new StatusView(this.getTransitData(),this.state.resources, this.state.rmax, this.getTotalStream(), this.getDataForFull()).display() + "```"
    }

    rankDisplay(){
        return "```" + new RankView(this.getDataForRank()).display() + "```"
    }

}

module.exports = Alliance;