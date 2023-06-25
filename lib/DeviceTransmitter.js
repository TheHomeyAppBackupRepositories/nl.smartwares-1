const { RFDevice } = require('homey-rfdriver');

module.exports = class extends RFDevice {
  static RX_ENABLED = true;

  async onCommandMatch(command) {
    if(command === undefined || command === null) {
      return false;
    }

    // Don't check on unit because the unit differs for each button of the remote
    const { address } = await this.getData();
    return address === command.address;
  }

};
