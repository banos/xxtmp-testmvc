import Ember from 'ember';

export default Ember.Component.extend({
	repo: Ember.inject.service(),
	tagName: 'section',
	elementId: 'main',
	canToggle: true,
	allCompleted: Ember.computed('tobuys.@each.completed', function () {
		return this.get('tobuys').isEvery('completed');
	}),

	actions: {
		enableToggle() {
			this.set('canToggle', true);
		},

		disableToggle() {
			this.set('canToggle', false);
		},

		toggleAll() {
			let allCompleted = this.get('allCompleted');
			this.get('tobuys').forEach(tobuy => Ember.set(tobuy, 'completed', !allCompleted));
			this.get('repo').persist();
		}
	}
});
