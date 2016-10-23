'use strict';
'use babel';

if (process.env.COVERAGE && process.env.COVERAGE.indexOf('true') >= 0) {
	require('babel-register');
}

var index = require('../lib/index');

describe('When calling create without providing a pom path', function () {
	it('should not return anything', function () {
		var actual = index.create();
		expect(actual).toEqual(undefined);
	});
});

describe('When calling create with a pom path', function () {
	it('should return an mvn object', function () {
		var actual = index.create('made/up/pom/path');
		expect(actual).toBeDefined();
		expect(actual.pom).toBeDefined();
	});
});
