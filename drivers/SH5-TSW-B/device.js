const DeviceTransmitter = require('../../lib/DeviceTransmitter');


module.exports = class extends DeviceTransmitter {
	async onCommandFirst({ state, unit }) {
		const rotated = this.getSetting('rotated');
		if (rotated === '180') {
			state = !state;

			if (unit === '0001') {
				unit = '0010';
			} else if (unit === '0010') {
				unit = '0001';
			}
		}

		await this.homey.flow
		.getDeviceTriggerCard('SH5-TSW-B:received')
		.trigger(this, {}, { state, unit })
      .catch(err => this.log(err));
	}
}

