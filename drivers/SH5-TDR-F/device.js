'use strict';

const DeviceTransmitter = require('../../lib/DeviceTransmitter');

module.exports = class extends DeviceTransmitter {
  async onCommandFirst({ state, unit, group }) {
    // All the commands are also send individually, so ignore the group command
    if (!group) {
      await this.homey.flow
        .getDeviceTriggerCard('SH5-TDR-F:received')
        .trigger(this, {}, { state, unit })
        .catch(err => this.log(err));
    }
  }
};
