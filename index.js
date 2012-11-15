/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var path = require("path");
var loaderUtils = require("loader-utils");
module.exports = function(source) {
	this.cacheable && this.cacheable();
	var jade = require("jade");
	var runtime = "var jade = require("+JSON.stringify(path.join(__dirname, "node_modules", "jade", "lib", "runtime"))+");\n\n";
	var req = loaderUtils.getRemainingRequest(this);
	var tmplFunc = jade.compile(source, {
		filename: req,
		client: true,
		compileDebug: this.debug || false
	});
	var debugSource = "";
	if(this.debug) {
		debugSource = "require(" + JSON.stringify(path.join(__dirname, "web_modules", "fs")) + ").setFile(" + JSON.stringify(req) + ", " + JSON.stringify(source) + ");";
	}
	return runtime + debugSource + "module.exports = " + tmplFunc.toString();
}
module.exports.seperable = true;