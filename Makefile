REPORTER ?= dot
TESTS = $(shell find test -name "*.js")
MOCHA = ./node_modules/.bin/mocha
JSCOVERAGE = ./node_modules/node-jscoverage/jscoverage

test:
	@NODE_ENV=test $(MOCHA) --reporter $(REPORTER) $(TESTS)

.PHONY: test
