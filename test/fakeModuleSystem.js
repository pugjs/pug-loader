var fs = require("fs");
var path = require("path");

module.exports = function runLoader(loader, directory, filename, arg, callback) {
	var async = false;
	var loaderContext = {
		async: function() {
			async = true;
			return callback;
		},
		loaders: ["itself"],
		loaderIndex: 0,
		query: "?root=" + encodeURIComponent(directory),
		options: {},
		resource: filename,
		callback: function() {
			async = true;
			return callback.apply(this, arguments);
		},
		resolve: function(context, request, resolveCallback) {
			process.nextTick(function() {
				resolveCallback(null, path.resolve(context, request));
			});
		},
		loadModule: function(request, loadCallback) {
			request = request.replace(/^-?!+/, "");
			request = request.split("!");
			fs.readFile(request.pop(), 'utf-8', function(err, content) {
				if (err) {
					loadCallback(err);
					return;
				}

				if(request[0] && /stringify/.test(request[0])) {
					content = JSON.stringify(content);
				}

				loadCallback(null, content);
			});
		}
	};
	var res = loader.call(loaderContext, arg);
	if(!async) callback(null, res);
}
