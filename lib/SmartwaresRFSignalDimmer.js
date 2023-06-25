'use strict';

const { RFUtil, RFError } = require('homey-rfdriver');
const SmartwaresRFSignal = require('./SmartwaresRFSignal');

/**
 * 433 Smartwares signal description
 *
 * Example payload: 01110001110100101001100110 0     1     00      01 (32 bits)
 *                  address (26 bit)           group state channel unit
 *
 */

module.exports = class extends SmartwaresRFSignal {
  static ID = 'smartwares-dimmer';

  static commandToPayload({
                            address,
                            group,
                            state,
                            unit,
                          }) {
    // If state is a Boolean, don't use the Dim command
    if (typeof state === 'boolean') {
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

    if (typeof state !== 'number' || state < 0 || state > 1) {
      throw new RFError(`Invalid State: ${state}`);
    }

    if (typeof unit !== 'string' || unit.length !== 4) {
      throw new RFError(`Invalid Unit: ${unit}`);
    }

    return [].concat(
      RFUtil.bitStringToBitArray(address),
      group ? 1 : 0,
      2, // Indicate to use Dim at the end of the payload
      RFUtil.bitStringToBitArray(unit),
      RFUtil.numberToBitArray(Math.ceil(state * 15), 4),
    );
  }

  static payloadToCommand(payload) {
    const dimflag = payload.slice(27, 28)[0];

    if (dimflag === 0 || dimflag === 1) {
      return super.payloadToCommand(payload);
    }

    const address = String(payload.slice(0, 26).join(''));
    const group = Boolean(payload.slice(26, 27)[0]);
    const unit = String(payload.slice(30, 32).join(''));
    const state = 1;
    const dim = RFUtil.bitArrayToNumber(payload.slice(32, 36)) / 15;

    if (Number.isNaN(dim)) {
      throw new Error('Malformed Payload');
    }

    return {
      address,
      group,
      state,
      dim,
      unit,
    };
  }
};
