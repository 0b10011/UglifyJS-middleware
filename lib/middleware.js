var uglifyJS = require("uglify-js")
	, url = require("url")
	, path = require("path")
	, fs = require("fs")
	, minified = []
	;

var uglify = function(dir) {
	
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
			var pathToMin = path.join(dir, filename);
			var pathToFull = path.join(dir, filename.replace(/\.min\.js$/, '.js'));
			
			var compile = function() {
				try {
					var minCode = uglifyJS.minify([pathToFull]).code;
					fs.writeFile(pathToMin, minCode, function(err) {
						if (err) {
							next(err);
						}
						minified.push(pathToFull);
						next();
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