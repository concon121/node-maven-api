'use babel';
'use strict';

const Maven = require('./maven');

module.exports = {

  create: function (pom) {
    if (pom) {
      return new Maven(pom);
    } else {
      console.error('No pom specified.');
    }
  }

};
