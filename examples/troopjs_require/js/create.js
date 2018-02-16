define([
	'./component',
	'troopjs-hub/emitter'
], function (Component, hub) {
	'use strict';

	/**
	 * Component for the `.new-tobuy` input
	 */

	var ENTER_KEY = 13;

	return Component.extend({
		/**
		 * DOM `keyup` handler
		 * @param {Object} $event jQuery-like `$.Event` object
		 */
		'dom/keyup': function ($event) {
			var $element = this.$element;
			var value;

			// If we pressed enter ...
			if ($event.keyCode === ENTER_KEY) {
				// Get `$element` value and trim whitespaces
				value = $element
					.val()
					.trim();

				if (value !== '') {
					hub
						.emit('tobuys/add', value)
						// Wait for all handlers to execute
						.then(function () {
							// Set `$element` value to `''`
							$element.val('');
						});
				}
			}
		}
	});
});
