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

Maven.prototype.execCommand = function (command) {
	var cmd = 'mvn ' + command + ' -f ' + this.pom;
	return new Promise((resolve) => {
		this.exec(cmd, (error) => {
			if (error) {
				resolve(false);
			} else {
				resolve(true);
			}
		});
	});
};

Maven.prototype.clean = function () {
	return this.execCommand('clean');
};

Maven.prototype.install = function () {
	return this.execCommand('install');
};

Maven.prototype.test = function () {
	return this.execCommand('test');
};

Maven.prototype.effectivePom = function (output) {
	var self = this;
	return new Promise(function (resolve, reject) {
		if (output) {
			var cmd = 'mvn help:effective-pom -f ' + self.pom + ' -Doutput=' + output;
			self.exec(cmd, () => {
				xml2js.parseString(fs.readFileSync(output, 'UTF-8'), (err, result) => {
					if (err) {
						reject(Error(err));
					}
					resolve(result);
				});
			});
		} else {
			reject(Error('Please provide a file to write effective pom to.'));
		}
	});
};

Maven.prototype.exec = function (cmd, callback) {
	process.exec(cmd, function (error, stdout, stderr) {
		if (error) {
			console.error(`exec error: ${error}`);
		}
		console.debug(`stdout: ${stdout}`);
		console.debug(`stderr: ${stderr}`);
		if (callback) {
			callback(error);
		}
	});
};

module.exports = Maven;
