The no-thought-necessary JavaScript minification middleware for connect and express.

# Usage

Include UglifyJS-middleware in your application ([available on npm](https://npmjs.org/package/uglifyjs-middleware)), add some JavaScript to a `*.js` file, and include `*.min.js` in your HTML. 

## Connect

	var connect = require("connect")
		, uglifyMiddleware = require("uglifyjs-middleware")
		;
	
	var app = connect()
		.use(uglifyMiddleware(__dirname + "/public"))
		.use(connect.static(__dirname + "/public"))
		.use(function(req, res) {
			res.statusCode = 404;
			res.end("Not found");
		})
		.use(function(err, req, res, next) {
			console.error(err);
			res.statusCode = 500;
			res.end("Internal server error");
		});

## Express

	var express = require("express")
		, uglifyMiddleware = require("uglifyjs-middleware")
		;
	
	var app = express.createServer();
	
	app.configure(function () {
		app.use(uglifyMiddleware(__dirname + "/public"));
		app.use(express.static(__dirname + "/public"));
		app.use(function(req, res) {
			res.statusCode = 404;
			res.end("Not found");
		});
		app.use(function(err, req, res, next) {
			console.error(err);
			res.statusCode = 500;
			res.end("Internal server error");
		});
	});
