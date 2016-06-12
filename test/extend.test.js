var should = require("should");

var fs = require("fs");
var path = require("path");

var runLoader = require("./fakeModuleSystem");
var pugLoader = require("../");

var fixtures = path.join(__dirname, "fixtures");

describe("extend", function() {
	it("should generate correct code", function(done) {
		var template = path.join(fixtures, "extend", "template.pug");
		runLoader(pugLoader, path.join(fixtures, "extend"), template, fs.readFileSync(template, "utf-8"), function(err, result) {
			if(err) throw err;

			result.should.have.type("string");
			result.should.match(/\\u003Cp\\u003E/); // <p>
			result.should.match(/\\u003C\\u002Fp\\u003E/); // </p>
			result.should.match(/abc/);
			done();
		});
	});
});
