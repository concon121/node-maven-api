'use babel';
'use strict';

const events = require('./maven-events');
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

Maven.prototype.registerEvent = function (eventName, callback) {
  events.on(eventName + ':' + this.pom, callback);
};

Maven.prototype.execCommand = function (eventName, command) {
  var cmd = 'mvn ' + command + ' -f "' + this.pom + '"';
  this.exec(cmd, (error) => {
    if (error) {
      events.emit(eventName + '-failed' + ':' + this.pom);
    } else {
      events.emit(eventName + ':' + this.pom);
    }
  });
};

Maven.prototype.clean = function () {
  return this.execCommand('clean', 'clean');
};

Maven.prototype.install = function () {
  return this.execCommand('install', 'install');
};

Maven.prototype.test = function () {
  return this.execCommand('test', 'test');
};

Maven.prototype.effectivePom = function (output) {
  var self = this;
  if (output) {
    var cmd = 'mvn help:effective-pom -f "' + self.pom + '" -Doutput="' + output + '"';
    self.exec(cmd, () => {
      xml2js.parseString(fs.readFileSync(output, 'UTF-8'), (error, result) => {
        if (error) {
          events.emit('effective-pom-failed' + ':' + this.pom);
        } else {
          events.emit('effective-pom' + ':' + this.pom, result);
        }
      });
    });
  } else {
    console.error('Please provide a file to write effective pom to.');
    events.emit('effective-pom-failed');
  }
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
