'use strict';

const { RFDriver } = require('homey-rfdriver');
const SmartwaresRFSignal = require('./SmartwaresRFSignal');

module.exports = class extends RFDriver {
  static SIGNAL = SmartwaresRFSignal;
};
