const Table = require('./Table');
const numeral = require('numeral');
const moment = require('moment');

class StatusView extends Table {
	constructor(data,current,rmax,stream,fullData) {
		super(data);
		this.formatter = v => "string"===typeof v ? v : v;
		this.setHeader(["Player", "Metal", "Gas", "Crystal", "Arrival"]);
		let inTransit = {
			metal: this.sumTotal("Metal"),
			gas: this.sumTotal("Gas"),
			crystal: this.sumTotal("Crystal"),
		};
		let expected = {
			metal: inTransit.metal + current.m,
			gas: inTransit.gas + current.g,
			crystal: inTransit.crystal + current.c,
		};
		this.appendBottomRow([
			"Total",
			numeral(inTransit.metal).format(),
			numeral(inTransit.gas).format(),
			numeral(inTransit.crystal).format(),
			"in transit",
        ], true);
        this.appendBottomRow([
			"Stream",
			numeral(stream.m).format(),
			numeral(stream.g).format(),
			numeral(stream.c).format(),
			"streaming",
		], true);
		this.appendBottomRow([
			"RSS @ AS",
			numeral(current.m).format(),
			numeral(current.g).format(),
			numeral(current.c).format(),
			"Max: "+numeral(rmax).format(),
		]);
		this.appendBottomRow(fullData);
		/*this.appendBottomRow([
			"AS free",
			numeral(current.max - expected.metal).format(),
			numeral(current.max - expected.gas).format(),
			numeral(current.max - expected.crystal).format(),
			"expected",
        ]);
        //TODO
		let pc_format = "0.00%";
		this.appendBottomRow([
			"AS % full",
			numeral(expected.metal / current.max).format(pc_format),
			numeral(expected.gas / current.max).format(pc_format),
			numeral(expected.crystal / current.max).format(pc_format),
			"expected",
		]);*/
	}
}

module.exports = StatusView;