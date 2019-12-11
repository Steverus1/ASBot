const RankTable = require('./RankTable');
const numeral = require('numeral');
const moment = require('moment');

class RankView extends RankTable {
	constructor(data) {
		super(data);
		this.formatter = v => "string"===typeof v ? v : numeral(v/1000).format() +"k";
		this.setHeader(["Player", "Metal", "Gas", "Crystal","Total"]);
	}
}

module.exports = RankView;