var should = require("should");

var fs = require("fs");
var path = require("path");

var runLoader = require("./fakeModuleSystem");
var pugLoader = require("../");

var fixtures = path.join(__dirname, "fixtures");

describe("extend+error", function() {
	it("should propagate async errors to Webpack", function(done) {
		var template = path.join(fixtures, "extend+error", "error.pug");
		runLoader(pugLoader, path.join(fixtures, "extend+error"), template, fs.readFileSync(template, "utf-8"), function(err, result) {
			should(err).be.not.null();
			done();
		});
	});
});
