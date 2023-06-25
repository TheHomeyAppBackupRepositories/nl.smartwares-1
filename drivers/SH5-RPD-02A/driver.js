'use strict';

const DriverReceiver = require('../../lib/DriverReceiver');
const SmartwaresRFSignalDimmer = require('../../lib/SmartwaresRFSignalDimmer');

module.exports = class extends DriverReceiver {
  static SIGNAL = SmartwaresRFSignalDimmer;
};
