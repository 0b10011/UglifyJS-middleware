var uglifyJS = require("uglify-js")
  , url = require("url")
  , path = require("path")
  , fs = require("fs")
  , minified = []
  ;

var uglify = function(dir, localOptions) {

	if (!localOptions) {
		localOptions = {};
	}

	// Middleware
	return function(req, res, next) {

		// Only handle GET and HEAD requests
		if (req.method.toUpperCase() !== "GET" && req.method.toUpperCase() !== "HEAD") {
			return next();
		}

		// Get the filename
		var filename = url.parse(req.url).pathname;

		// Only handle .min.js requests
		if (filename.match(/\.min\.js$/)) {

			// Generate paths
			filename = filename.replace(/\.min\.js$/, "");
			var pathToMin = path.join(dir, filename + ".min.js");
			var pathToFull = path.join(dir, filename + ".js");

			var compile = function() {

				// Generate options for UglifyJS
				var options = {};

				if (localOptions.generateSourceMap) {
					options.outSourceMap = filename + ".map.js";
					options.prefix = 2;
				}

				// Generate paths
				if (options.outSourceMap) {
					var pathToMap = path.join(dir, filename + ".map.js");
				}

				try {
					var uglified = uglifyJS.minify(pathToFull, options);
					fs.writeFile(pathToMin, uglified.code, function(err) {
						if (err) {
							next(err);
						}
						minified.push(pathToFull);

						// Write map to file
						if (pathToMap) {
							fs.writeFile(pathToMap, uglified.map, function(err) {
								next(err);
							});
						} else {
							next();
						}
					});
				} catch(err) {
					next(err);
				}
			};

			// If not yet minified, do so now
			if (!minified[pathToFull]) { return compile(); }

			// Compare mtimes
			fs.exists(pathToFull, function(exists) {
				if(!exists) {
					return next();
				} else {
					fs.stat(pathToFull, function(err, statsFull){
						if (err) {
							return next(err);
						}

						fs.exists(pathToMin, function(exists) {
							if(!exists) {
								return compile();
							} else {
								fs.stat(pathToMin, function(err, statsMin){
									if (err) {
										return next(err);
									} else if (stats.mtime > cssStats.mtime) {
										return compile();
									} else {
										return next();
									}
								});
							}
						});
					});
				}
			});
		} else {
			return next();
		}
	};
};

module.exports = uglify;
