define([
  './component',
  'troopjs-hub/emitter',
  'poly/array'
], function (Component, hub) {
	'use strict';

	/**
	   * Component for the `.clear-completed` button
	   */

	return Component.extend({
		/**
		   * HUB `tobuys/change` handler (memorized).
		   * Called whenever the task list is updated
		   * @param {Array} tasks Updated task array
		   */
		'hub/tobuys/change(true)': function (tasks) {
			// Filter and count tasks that are completed
			var count = tasks
				.filter(function (task) {
					return task.completed;
				})
				.length;

			// Toggle visibility (visible if `count > 0`, hidden otherwise)
			this.$element.toggle(count > 0);
		},

		/**
		 * DOM `click` handler
		 */
		'dom/click': function () {
			// Emit `tobuys/clear` on `hub`
			hub.emit('tobuys/clear');
		}
	});
});
