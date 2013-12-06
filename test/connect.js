/**
 * Test dependencies.
 */

var assert = require("assert")
  , path = require("path")
  , fs = require("fs")
  , temp = require("temp")
  ;

/**
 * Setup.
 */

// Hack to get the temp directory in the right location
temp.dir = __dirname;

var tempDir
  , tempFileFull = "/tmp.js"
  , tempFileMin = "/tmp.min.js"
  , tempFileMap = "/tmp.map.js"
  ;

var connect = require("connect")
  , uglifyMiddleware = require("../lib/middleware")
  ;

/**
 * Tests.
 */

var app
  , request
  ;

before(function(done) {
	temp.mkdir("tmp", function(err, dirPath) {
		if (err) {
			throw(err);
		}

		tempDir = dirPath;

		app = connect()
			.use(uglifyMiddleware(tempDir, {
				generateSourceMap: true
			}))
			.use(connect.static(tempDir))
			.use(function(req, res) {
				res.statusCode = 404;
				res.end("Not found");
			})
			.use(function(err, req, res, next) {
				console.error(err);
				res.statusCode = 500;
				res.end("Internal server error");
			});

		request = require("supertest")(app);

		done();
	});
});

after(function(done) {
	var remove = function(filename, callback) {
		fs.exists(filename, function(exists) {
			if(exists) {
				fs.unlink(filename, function(err) {
					if(err) {
						throw(err);
					}
					callback();
				});
			} else {
				callback();
			}
		});
	};

	remove(path.join(tempDir, tempFileMin), function() {
		remove(path.join(tempDir, tempFileFull), function() {
			remove(path.join(tempDir, tempFileMap), function() {
				fs.rmdir(tempDir, done);
			});
		});
	});
});

describe("Connect", function() {
	var scriptIn = "function foo() { }";
	var scriptOut = "function foo(){}";

	it("should not change the original file", function(done) {

		var setup = function() {
			fs.writeFile(path.join(tempDir, tempFileFull), scriptIn, testRequest);
		};

		var testRequest = function(err) {
			if (err) {
				throw(err);
			}

			request.get(tempFileFull)
				.set("accept", "application/javascript")
				.expect(200)
				.expect("content-type", /application\/javascript/)
				.expect(scriptIn)
				.end(done);
		};

		setup();
	});

	it("should automatically minify javascript file", function(done) {

		var setup = function() {
			fs.writeFile(path.join(tempDir, tempFileFull), scriptIn, testRequest);
		};

		var testRequest = function(err) {
			if (err) {
				throw(err);
			}

			request.get(tempFileMin)
				.set("accept", "application/javascript")
				.expect(200)
				.expect("content-type", /application\/javascript/)
				.expect(scriptOut + "\n//@ sourceMappingURL=" + tempFileMap)
				.end(done);
		};

		setup();
	});

	it("should automatically create a source map", function(done) {

		var setup = function() {
			fs.writeFile(path.join(tempDir, tempFileFull), scriptIn, testRequest);
		};

		var testRequest = function(err) {
			if (err) {
				throw(err);
			}

			request.get(tempFileMap)
				.set("accept", "application/javascript")
				.expect(200)
				.expect("content-type", /application\/javascript/)
				.end(done);
		};

		setup();
	});
});
