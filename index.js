/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
module.exports = function() {
	var options = this;
	var jade = require("jade");
	var results = [null];
	var runtime = "var jade = require("+JSON.stringify(require("path").join(__dirname, "node_modules", "jade", "lib", "runtime"))+");\n\n";
	Array.prototype.forEach.call(arguments, function(content, index) {
		var tmplFunc = jade.compile(content, {
			filename: options.filenames[index],
			client: true,
			compileDebug: options.debug || false
		});
		results[index+1] = runtime + "module.exports = " + tmplFunc.toString();
	});
	this.callback.apply(null, results);
}