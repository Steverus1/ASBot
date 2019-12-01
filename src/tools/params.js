const moment = require('moment');
class Params{
    static getNumber (s)  {
        let numberS=s
        let multi=1
        if(s.endsWith('k')){
            console.log(numberS)
            numberS=s.substr(0,s.length)
            console.log(numberS)
            multi=1000
        }
        let tempResult = parseFloat(numberS)
        return tempResult*multi
    }
    
    static Resources(m,g,c) {
        return {m:this.getNumber(m), g:this.getNumber(g), c:this.getNumber(c)}
    }

    static Time(duration){
        return moment.duration(duration,"HH:MM").asMilliseconds();
    }
}

module.exports = Params

