define([
	'./component',
	'troopjs-hub/emitter',
	'poly/array'
], function (Component, hub) {
	'use strict';

	/**
	 * Component for `toggle-all` checkbox
	 */

	return Component.extend({
		/**
		 * HUB `tobuys/change` handler (memorized).
		 * Called whenever the task list is updated
		 * @param {Array} tasks Updated task array
		 */
		'hub/tobuys/change(true)': function (tasks) {
			// Set `this.$element` `checked` property based on all `tasks` `.completed` state
			this.$element.prop('checked', tasks.every(function (task) {
				return task.completed;
			}, true));
		},

		/**
		 * DOM `change` handler
		 */
		'dom/change': function () {
			// Emit `tobuys/complete` on `hub` with `this.$element` `checked` property
			hub.emit('tobuys/complete', this.$element.prop('checked'));
		}
	});
});
