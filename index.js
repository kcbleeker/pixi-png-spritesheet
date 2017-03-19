var GrowingPacker = require("../GrowingPacker.js");
var fs = require("fs");
var images = require("images");
var path = require("path");
var sizeOf = require("image-size");
var parambulator = require('parambulator');

/*
	Usage: 
	var spriter = require('pixi-png-spritesheet');
	spriter.pack({
		files: [
			"testfile1.png",
			"testfile1.png"
		],
		outfiles: {
			img: "spritesheet.png",
			map: "spritesheet.json"
		}
	})
*/


module.exports = {
	pack: function (options) {
		var paramcheck = parambulator({
			files: { type$: 'array' }
		});
		paramcheck(options, this.err);

		var filenames = [];
		var sprites = [];
		inputfiles.forEach(function (item) {
			if (path.extname(item) === ".png") {
				filenames.push(item);
				var spritesize = sizeOf(inputpath + item);
				spritesize["filename"] = inputpath + item;
				spritesize["w"] = spritesize.width * 1;
				spritesize["h"] = spritesize.height * 1;
				spritesize["area"] = spritesize.height * spritesize.height;
				sprites.push(spritesize);
			}
		});
		sprites.sort(this.sort.maxside);
	},
	err: function (err, res) {
		if (err) console.log(err.message);
	},
	sort: {
		random: function (a, b) { return Math.random() - 0.5; },
		w: function (a, b) { return b.w - a.w; },
		h: function (a, b) { return b.h - a.h; },
		a: function (a, b) { return b.area - a.area; },
		max: function (a, b) { return Math.max(b.w, b.h) - Math.max(a.w, a.h); },
		min: function (a, b) { return Math.min(b.w, b.h) - Math.min(a.w, a.h); },

		height: function (a, b) { return this.sort.msort(a, b, ['h', 'w']); },
		width: function (a, b) { return this.sort.msort(a, b, ['w', 'h']); },
		area: function (a, b) { return this.sort.msort(a, b, ['a', 'h', 'w']); },
		maxside: function (a, b) { return this.sort.msort(a, b, ['max', 'min', 'h', 'w']); },

		msort: function (a, b, criteria) { /* sort by multiple criteria */
			var diff, n;
			for (n = 0; n < criteria.length; n++) {
				diff = this.sort[criteria[n]](a, b);
				if (diff != 0)
					return diff;
			}
			return 0;
		}
	}

}