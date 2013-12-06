[![Build Status](https://travis-ci.org/bfrohs/UglifyJS-middleware.png?branch=master)](https://travis-ci.org/bfrohs/UglifyJS-middleware) [![NPM version](https://badge.fury.io/js/uglifyjs-middleware.png)](http://badge.fury.io/js/uglifyjs-middleware)

The no-thought-necessary JavaScript minification middleware for connect and express.

# Usage

Include UglifyJS-middleware in your application ([available on npm](https://npmjs.org/package/uglifyjs-middleware)), add some JavaScript to a `*.js` file, and include `*.min.js` in your HTML.

If the `generateSourceMap` option is set to `true`, a [source map](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/) will be generated at `*.map.js` and linked to from `*.js`. *To use the source map in Chrome, make sure you have source maps enabled (dev tool settings > Sources > Enable source maps).*

## Connect

	var connect = require("connect")
	  , uglifyMiddleware = require("uglifyjs-middleware")
	  ;

	var app = connect()
		.use(uglifyMiddleware(__dirname + "/public", {
			generateSourceMap: true
		}))
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
		app.use(uglifyMiddleware(__dirname + "/public", {
			generateSourceMap: true
		}));
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

**Note:** The "mounting" feature of `app.use()` works the same way as it does
with `express.static()`:

	app.use("/mount", uglifyMiddleware(__dirname + "/public", {
		generateSourceMap: true
	}));
