const { table } = require('table');
const moment = require('moment');

class Table {
	constructor( data ) {
		var that = this;
		this.data = Array.isArray(data) ? data.slice() : [];
		this.bottomRows = [];
		this.header = [];
		this.lines = [];
		this.formatter = null;
		this.options = {
			columns: {
				0: { truncate: 18, paddingLeft: 0 },
				1: { alignment: "right" },
				2: { alignment: "right" },
				3: { alignment: "right" },
				4: { alignment: "right", paddingRight: 0 },
			},
			drawHorizontalLine: function(index, size) {
				return -1 !== that.lines.indexOf(index);
			},
			border: {
				topBody: ``, topJoin: ``, topLeft: ``, topRight: ``,
				bottomBody: ``, bottomJoin: ``, bottomLeft: ``, bottomRight: ``,
				bodyLeft: ``, bodyRight: ``, bodyJoin: `│`,
				joinBody: `─`, joinLeft: ``, joinRight: ``,
				joinJoin: `┼`,
			}
		};
	}
	setHeader(row) {
		this.header = row;
		this.lines.push(1);
	}
	appendBottomRow(row,appendLine) {
		let index = this.bottomRows.push(row);
		if(!!appendLine){
			this.lines.push(this.data.length + index);
		}
	}
	sumTotal(column) {
		let index = this.header.indexOf(column);
		if ( -1 === index ) return;
		let total = this.data.reduce((r, a) => {
			return r + parseInt(a[index]);
		}, 0);
		return total;
	}
	formatData() {
		if ( null === this.formatter ) return this.data;
		let _data = [];
		for ( var i=0; i<this.data.length; i++ ) {
			_data[i] = [];
			for ( var j=0;j<this.data[i].length-1; j++ ) {
                _data[i][j] = this.formatter(this.data[i][j]);
            }
            _data[i][this.data[i].length-1] = moment.duration(this.data[i][this.data[i].length-1]).humanize()
		}
		return _data;
	}
	display() {
		this.lines.push(2+this.data.length);
		this.lines = this.lines.filter((v, i, a)=> a.indexOf(v)===i);
		let data = [].concat([this.header], this.formatData(), this.bottomRows );
		return table(data, this.options);
	}
}

module.exports = Table;