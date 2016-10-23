'use strict';
'use babel';

if (process.env.COVERAGE && process.env.COVERAGE.indexOf('true') >= 0) {
	require('babel-register');
}

var index = require('../lib/index');

describe('When calling clean, insall or test.', function () {

	var actual;

	beforeEach(function () {
		actual = index.create('/workspace/made/up');
		spyOn(actual, 'exec').and.returnValue(undefined);
	});

	it('Maven clean is invoked.', function () {
		expect(actual).toBeDefined();
		expect(actual.pom).toBeDefined();
		actual.clean();
		expect(actual.exec).toHaveBeenCalled();
	});

	it('Maven install is invoked.', function () {
		expect(actual).toBeDefined();
		expect(actual.pom).toBeDefined();
		actual.install();
		expect(actual.exec).toHaveBeenCalled();
	});

});

describe('When calling effectivePom', function () {

	var actual;
	var expected = 123;
	jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

	beforeEach(function () {
		actual = index.create('/workspace/made/up');
		spyOn(actual, 'execSync').and.returnValue(expected);
	});

	var failTest = function (error) {
		expect(error).toBeDefined();
	};

	it('A JSON effective pom is not returned when no output location is provided.', function (done) {
		expect(actual).toBeDefined();
		expect(actual.pom).toBeDefined();
		var effectivePomPromise = actual.effectivePom();
		expect(actual.execSync).not.toHaveBeenCalled();
		expect(effectivePomPromise).toBeDefined();
		effectivePomPromise.then(function (result) {
			expect(result).not.toBeDefined();
			done();
		}, function (err) {
			expect(err).toBeDefined();
			done();
		}).catch(failTest);
	});

});