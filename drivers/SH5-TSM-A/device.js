'use strict';

const DeviceTransmitter = require('../../lib/DeviceTransmitter');

module.exports = class extends DeviceTransmitter {
  async onCommandFirst(command) {
    if (!!command.state === true) {
      let timerSetting = Number(this.getSetting('timeout'));
      if (timerSetting <= 1000) timerSetting = timerSetting * 60 * 1000;
      if (timerSetting !== 0) {
        this.homey.clearTimeout(this.deviceTimeout);
        this.deviceTimeout = this.homey.setTimeout(() => {
          this.setCapabilityValue('alarm_contact', false).catch(this.error);
        }, timerSetting);
      }
    }
    await this.setCapabilityValue('alarm_contact', !!command.state);
  }
};
