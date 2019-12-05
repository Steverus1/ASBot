const Table = require('./Table');
const numeral = require('numeral');
const moment = require('moment');

class RankView extends Table {
	constructor(data) {
		super(data);
		this.formatter = v => "string"===typeof v ? v : numeral(v).format();
		this.setHeader(["Player", "Metal", "Gas", "Crystal","NA"]);
	}
}

module.exports = RankView;