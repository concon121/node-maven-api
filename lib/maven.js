'use babel';
'use strict';

const process = require('child_process');
const fs = require('fs');
const xml2js = require('xml2js').Parser({
	explicitArray: false
});

class Maven {
	constructor(pom) {
		this.pom = pom;
	}
}

Maven.prototype.clean = function () {
	var cmd = 'mvn clean -f ' + this.pom;
	this.exec(cmd);
};

Maven.prototype.install = function () {
	var cmd = 'mvn install -f ' + this.pom;
	this.exec(cmd);
};

Maven.prototype.test = function () {
	var cmd = 'mvn test -f ' + this.pom;
	this.exec(cmd);
};

Maven.prototype.effectivePom = function (output) {
	return new Promise(function (resolve, reject) {
		if (output) {
			var cmd = 'mvn help:effective-pom -f ' + this.pom + ' -Doutput=' + output;
			this.execSync(cmd, () => {
				xml2js.parseString(fs.readFileSync(output, 'UTF-8'), (err, result) => {
					resolve(result);
				});
			});
		} else {
			reject(Error('Please provide a file to write effective pom to.'));
		}
	});
};

Maven.prototype.exec = function (cmd) {
	process.exec(cmd, function (error, stdout, stderr) {
		if (error) {
			console.error(`exec error: ${error}`);
			return;
		}
		console.debug(`stdout: ${stdout}`);
		console.debug(`stderr: ${stderr}`);
	});
};

Maven.prototype.execSync = function (cmd, callback) {
	process.execSync(cmd);
	return callback();
};

module.exports = Maven;
