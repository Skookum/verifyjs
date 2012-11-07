test:
	./node_modules/.bin/mocha -R spec -r should --compilers coffee:coffee-script test/analysis.test.coffee

.PHONY: test