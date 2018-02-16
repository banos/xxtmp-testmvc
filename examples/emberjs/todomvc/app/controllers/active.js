import Ember from 'ember';

export default Ember.Controller.extend({
	tobuys: Ember.computed.filterBy('model', 'completed', false)
});
