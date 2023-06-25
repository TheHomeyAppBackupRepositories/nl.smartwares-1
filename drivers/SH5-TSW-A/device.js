const DeviceTransmitter = require('../../lib/DeviceTransmitter');

module.exports = class extends DeviceTransmitter {
	async onCommandFirst({ state, unit }) {
		const rotated = this.getSetting('rotated');
		if (rotated === '180') {
			state = !state;
		}

		await this.homey.flow
		.getDeviceTriggerCard('SH5-TSW-A:received')
		.trigger(this, {}, { state, unit })
      .catch(err => this.log(err));
	}
}

