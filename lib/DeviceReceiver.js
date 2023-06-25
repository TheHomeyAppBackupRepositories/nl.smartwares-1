'use strict';

const { RFDevice } = require('homey-rfdriver');

module.exports = class extends RFDevice {
  static CAPABILITIES = {
    onoff: ({ value, data }) => ({
      ...data,
      state: !!value,
      group: false,
    }),
    async dim({ value, data }) {
      // Turn off entirely when dim value is zero
      if (value === 0) {
        value = false;
        if (this.hasCapability('onoff')) {
          await this.setCapabilityValue('onoff', false);
        }
      }
      else if (this.hasCapability('onoff')) {
        await this.setCapabilityValue('onoff', true);
      }

      return {
        ...data,
        state: value,
        group: false,
      };
    },
    target_temperature: ({ value, data }) => ({
        ...data,
        target_temperature: value,
        group: false,
    }),
  };

  async onAdded() {
    if (this.hasCapability('onoff')) {
      await this.setCapabilityValue('onoff', false);
    }
    if (this.hasCapability('dim')) {
      await this.setCapabilityValue('dim', 1);
    }
  }

  async onCommandMatch(command) {
    if(command === undefined || command === null) {
      return false;
    }

    const { address, unit } = await this.getData();

    return address === command.address && unit === command.unit;
  }
};
