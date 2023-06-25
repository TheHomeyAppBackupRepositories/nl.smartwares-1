'use strict';

const DeviceReceiver = require('../../lib/DeviceReceiver');

module.exports = class extends DeviceReceiver {
  static RX_ENABLED = true; // Enable the RX because the device could be operated by remote for day / night modus

  async onInit() {
    await super.onInit();

    // Obtain the stored temperature settings and store them.
    // These will be used to set the temperature when the day/night mode is switched.
    this.dayTemp = this.getSettings().dayTemp;
    this.nightTemp = this.getSettings().nightTemp;
  }

  async onCommandFirst({ state, button }) {
    if (button === 1) {
      const target_temperature = state ? this.dayTemp : this.nightTemp;
      await this.setCapabilityValue('target_temperature', target_temperature);
    }
  }

  /**
   * Function that is called automatically when device settings are changed.
   * This function will check if the new settings are valid.
   * If they are valid, they will be stored in the object to be used later.
   *
   * @param {*} oldSettings: The old settings
   * @param {*} settings: Newly stored settings when the callback is called without error
   * @param {*} changedKeys: The keys which are changed
   */
  async onSettings({ oldSettings, newSettings, changedKeys }) {
    if (newSettings.dayTemp < 5 || newSettings.dayTemp > 28) {
      throw new Error(this.homey.__('error.dayTemp'));
    }
    if (newSettings.nightTemp < 5 || newSettings.nightTemp > 28) {
      throw new Error(this.homey.__('error.nightTemp'));
    }

    this.dayTemp = newSettings.dayTemp;
    this.nightTemp = newSettings.nightTemp;
  }

  /**
   * Sets the temperature from the flow based on modus
   *
   * @param state
   * @returns {Promise<void>}
   */
  async setTemperatureMode(state) {
    const target_temperature = (state === '1') ? this.dayTemp : this.nightTemp;
    await this.triggerCapabilityListener('target_temperature', target_temperature);
  }
};
