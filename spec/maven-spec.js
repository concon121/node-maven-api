'use strict';
'use babel';

if (process.env.COVERAGE && process.env.COVERAGE.indexOf('true') >= 0) {
	require('babel-register');
}

var index = require('../lib/index');

describe('When calling clean, install or test.', function () {

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
	jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

	beforeEach(function () {
		actual = index.create('/workspace/made/up');
		spyOn(actual, 'exec').and.returnValue(undefined);
	});

	var failTest = function (error) {
		expect(error).toBeDefined();
	};

	it('A JSON effective pom is not returned when no output location is provided.', function (done) {
		expect(actual).toBeDefined();
		expect(actual.pom).toBeDefined();

		actual.registerEvent('effective-pom-failed', (result) => {
			expect(result).not.toBeDefined();
			done();
		});

		var effectivePomPromise = actual.effectivePom();
		expect(actual.exec).not.toHaveBeenCalled();
		expect(effectivePomPromise).toBeDefined();
	});

});
