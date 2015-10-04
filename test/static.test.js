var should = require("should");

var fs = require("fs");
var path = require("path");

var runLoader = require("./fakeModuleSystem");
var jadeLoader = require("../");

var fixtures = path.join(__dirname, "fixtures/static");

describe("render", function() {
	it("should render static HTML", function(done) {
		var template = path.join(fixtures, "static.jade");
		runLoader(jadeLoader, path.join(fixtures, "extend"), template, fs.readFileSync(template, "utf-8"), function(err, result) {
			if(err) throw err;

			result.should.have.type("string");
			result.should.match(/^<p>testing compilation to static html <\/p>$/);
			done();
		}, "?static=1");
	});
});