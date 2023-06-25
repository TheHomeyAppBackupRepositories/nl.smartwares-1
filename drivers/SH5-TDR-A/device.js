'use strict';

const DeviceTransmitter = require('../../lib/DeviceTransmitter');

module.exports = class extends DeviceTransmitter {
  async onCommandFirst({ state, unit }) {
    await this.homey.flow
      .getDeviceTriggerCard('SH5-TDR-A:received')
      .trigger(this, {}, { state, unit })
      .catch(err => this.log(err));
  }
};
