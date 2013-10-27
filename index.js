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

  // Get filename without any loaders
	var req = loaderUtils.getRemainingRequest(this).split("!").pop();
	var query = loaderUtils.parseQuery(this.query);

  // Replace "include" statements with webpack-powered require()
  if (query.webpackInclude) {
    jade.Parser.prototype._parseInclude = jade.Parser.prototype.parseInclude;
    jade.Parser.prototype.parseInclude = function () {
      var rel = this.expect('include').val.trim();
      var dir = path.dirname(this.filename);

      // no extension
      if (!~path.basename(rel).indexOf('.')) {
        rel += '.jade';
      }

      var abs = path.join(dir, rel);
      var call = 'require("'+abs+'")(locals)';
      var node = new jade.nodes.Code(call, true, false);
      node.line = this.line();
      return node;
    };
  }

	var tmplFunc = jade.compile(source, {
		filename: req,
		client: true,
		self: query.self,
		pretty: query.pretty,
		locals: query.locals,
		compileDebug: this.debug || false
	});

  if (query.webpackInclude) {
    jade.Parser.prototype.parseInclude = jade.Parser.prototype._parseInclude;
  }

	var debugSource = "";
	if(this.debug) {
		debugSource = "require(" + JSON.stringify(path.join(__dirname, "web_modules", "fs")) + ").setFile(" + JSON.stringify(req) + ", " + JSON.stringify(source) + ");";
	}
	return runtime + debugSource + "module.exports = " + tmplFunc.toString();
}
module.exports.seperable = true;
