'use babel';
'use strict';

const Events = require('events');

class MavenEvents extends Events {}

module.exports = new MavenEvents();
