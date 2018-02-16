import Ember from 'ember';

export default Ember.Service.extend({
	lastId: 0,
	data: null,
	findAll() {
		return this.get('data') ||
			this.set('data', JSON.parse(window.localStorage.getItem('tobuys') || '[]'));
	},

	add(attrs) {
		let tobuy = Object.assign({ id: this.incrementProperty('lastId') }, attrs);
		this.get('data').pushObject(tobuy);
		this.persist();
		return tobuy;
	},

	delete(tobuy) {
		this.get('data').removeObject(tobuy);
		this.persist();
	},

	persist() {
		window.localStorage.setItem('tobuys', JSON.stringify(this.get('data')));
	}
});
