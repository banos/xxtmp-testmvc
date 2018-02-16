import Ember from 'ember';

export default Ember.Component.extend({
	repo: Ember.inject.service(),
	tagName: 'li',
	editing: false,
	classNameBindings: ['tobuy.completed', 'editing'],

	actions: {
		startEditing() {
			this.get('onStartEdit')();
			this.set('editing', true);
			Ember.run.scheduleOnce('afterRender', this, 'focusInput');
		},

		doneEditing(tobuyTitle) {
			if (!this.get('editing')) { return; }
			if (Ember.isBlank(tobuyTitle)) {
				this.send('removeTodo');
			} else {
				this.set('tobuy.title', tobuyTitle.trim());
				this.set('editing', false);
				this.get('onEndEdit')();
			}
		},

		handleKeydown(e) {
			if (e.keyCode === 13) {
				e.target.blur();
			} else if (e.keyCode === 27) {
				this.set('editing', false);
			}
		},

		toggleCompleted(e) {
			let tobuy = this.get('tobuy');
			Ember.set(tobuy, 'completed', e.target.checked);
			this.get('repo').persist();
		},

		removeTodo() {
			this.get('repo').delete(this.get('tobuy'));
		}
	},

	focusInput() {
		this.element.querySelector('input.edit').focus();
	}
});
