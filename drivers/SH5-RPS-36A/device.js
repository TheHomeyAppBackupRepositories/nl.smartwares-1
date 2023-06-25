'use strict';

const DeviceReceiver = require('../../lib/DeviceReceiver');

module.exports = class extends DeviceReceiver {
  static RX_ENABLED = true; // Enable the RX because the device could be operated by remote for on/off

  /**
   * Sets the capability when the device is triggered by remote for on off
   *
   * @param onoff
   * @returns {Promise<void>}
   */
  async onCommandFirst({ onoff }) {
    await this.setCapabilityValue('onoff', onoff);
  }
};
