'use strict';

const DriverReceiver = require('../../lib/DriverReceiver');
const SmartwaresRFSignalValve = require('../../lib/SmartwaresRFSignalValve');

module.exports = class extends DriverReceiver {
  static SIGNAL = SmartwaresRFSignalValve;

  async onInit() {
    super.onInit();

    this.homey.flow
      .getActionCard('SH5-RDV-A:send')
      .registerRunListener(async (args) => {
          return args.device.setTemperatureMode(args.state);
      });
  }

};
