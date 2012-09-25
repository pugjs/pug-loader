/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
module.exports = function(source) {
	this.cacheable && this.cacheable();
	var jade = require("jade");
	var runtime = "var jade = require("+JSON.stringify(require("path").join(__dirname, "node_modules", "jade", "lib", "runtime"))+");\n\n";
	var tmplFunc = jade.compile(source, {
		filename: this.filenames[0],
		client: true,
		compileDebug: this.debug || false
	});
	return runtime + "module.exports = " + tmplFunc.toString();
}
module.exports.seperable = true;