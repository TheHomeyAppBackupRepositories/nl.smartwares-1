'use strict';

const { RFSignal, RFUtil, RFError } = require('homey-rfdriver');

/**
 * 433 Smartwares signal description
 *
 * Example payload: 01110001110100101001100110 0     1     00      01 (32 bits)
 *                  address (26 bit)           group state channel unit
 *
 */

module.exports = class extends RFSignal {
  static FREQUENCY = '433';
  static ID = 'smartwares';

  static commandToDeviceData(command) {
    return {
      address: command.address,
      channel: command.channel,
      unit: command.unit,
    };
  }

  static commandToPayload({
                            address,
                            group,
                            state,
                            unit,
                          }) {

    if (typeof address !== 'string' || address.length !== 26) {
      throw new RFError(`Invalid Address: ${address}`);
    }

    if (typeof group !== 'boolean') {
      throw new RFError(`Invalid Group: ${group}`);
    }

    if (typeof state !== 'boolean') {
      throw new RFError(`Invalid State: ${state}`);
    }

    if (typeof unit !== 'string' || unit.length !== 4) {
      throw new RFError(`Invalid Unit: ${unit}`);
    }

    return [].concat(
      RFUtil.bitStringToBitArray(address),
      group ? 1 : 0,
      state ? 1 : 0,
      RFUtil.bitStringToBitArray(unit),
    );
  }

  static payloadToCommand(payload) {
    if (payload.length === 32) {
      const address = String(payload.slice(0, 26).join(''));
      const group = Boolean(payload.slice(26, 27)[0]);
      const state = Boolean(payload.slice(27, 28)[0]);
      const unit = String(payload.slice(28, 32).join(''));
      const onoff = !!state;
      const id =  `${address}:${unit}`

      return {
        address,
        group,
        state,
        unit,
        onoff,
        id
      };
    }
    return null;
  }

  static createPairCommand() {
    const data = {
      address: RFUtil.generateRandomBitString(26),
      unit: RFUtil.generateRandomBitString(4),
      group: false,
      state: true,
    };
    data.id = `${data.address}:${data.unit}`;
    return data;
  }
};
