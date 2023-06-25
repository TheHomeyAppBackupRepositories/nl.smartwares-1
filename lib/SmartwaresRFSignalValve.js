'use strict';

const { RFUtil, RFError } = require('homey-rfdriver');
const SmartwaresRFSignal = require('./SmartwaresRFSignal');

module.exports = class extends SmartwaresRFSignal {
  static ID = 'smartwares-valve';

  static commandToPayload({
                            address,
                            group,
                            state,
                            unit,
                            target_temperature,
                          }) {
    // If target_temperature is not available use the normal commandToPayload
    if (typeof target_temperature !== 'number') {
      return super.commandToPayload({
        address,
        group,
        state,
        unit,
      });
    }

    if (typeof address !== 'string' || address.length !== 26) {
      throw new RFError(`Invalid Address: ${address}`);
    }

    if (typeof group !== 'boolean') {
      throw new RFError(`Invalid Group: ${group}`);
    }

    if (typeof unit !== 'string' || unit.length !== 4) {
      throw new RFError(`Invalid Unit: ${unit}`);
    }

    if (target_temperature < 0) {
      throw new RFError(`Invalid Target Temperature: ${target_temperature}`);
    }

    return [].concat(
      RFUtil.bitStringToBitArray(address),
      group ? 1 : 0,
      2, // Indicate to use target_temperature at the end of the payload
      RFUtil.bitStringToBitArray(unit),
      this.temperatureToPayload(target_temperature),
    );
  }

  static payloadToCommand(payload) {
    if (payload.length === 32 && payload.indexOf(2) === -1) {
      const data = super.payloadToCommand(payload);

      return !data ? null : {
        ...data,
        button: 1, //create a button property to check in onData if the mode was changed
      };
    }
    else if (
      payload.length === 40 &&
      payload.slice(0, 27).indexOf(2) === -1 &&
      payload.slice(28, 35).indexOf(2) === -1 &&
      payload.slice(36, 40).indexOf(2) === -1 &&
      payload[27] === 2 &&
      payload[35] !== 0
    ) {
      const address = String(payload.slice(0, 26).join(''));
      const group = Boolean(payload.slice(26, 27)[0]);
      const state = payload.slice(27, 28) ? 1 : 0;
      const unit = String(payload.slice(28, 32).join(''));
      const target_temperature = this.payloadToTemperature(payload.slice(32, 40));
      const button = 0; // This is no remote data
      const id = `${address}:${unit}`;

      return {
        address,
        group,
        state,
        unit,
        target_temperature,
        button,
        id,
      };
    }
  }

  /**
   * Static function to form a payload from the target temperature
   *
   * @param {*} temp Temperature to convert to binary payload
   */
  static temperatureToPayload(temp) {
    // Ensure value is between 5 and 28, remove base value and multiply by 2 to get int val
    temp = Math.round((Math.max(Math.min(temp, 28), 0) - 5) * 2);
    // Add random offset which occurs each 5 steps
    // get bit array from number
    const payload = RFUtil.numberToBitArray(temp + Math.floor(temp / 4), 6);
    // flip bit 4 to 1/2 instead of 0/1
    payload[3] = payload[3] === 1 ? 1 : 2;
    // Add control bits
    return payload.concat(Math.floor(temp / 2) % 2, temp % 2);
  }

  /**
   * Static function to calculate the temperature from the payload.
   *
   * @param {*} payload Payload to convert to temperature
   */
  static payloadToTemperature(payload) {
    // set bit 4 to 1/0 instead of 1/2
    payload[3] = payload[3] === 1 ? 1 : 0;
    // get numeric value from bit array
    let temp = RFUtil.bitArrayToNumber(payload.slice(0, 6));
    // remove random offset of 1 which occurs each 5 steps
    temp -= Math.floor(temp / 5);
    // divide by 2 to get the temperature and add the base temperature
    return temp / 2 + 5;
  }

};
