/*global jQuery, tobuy */
/*jshint unused:false */

/*
 * Formatters used for data binding.
 */
(function () {
	'use strict';

	jQuery.sap.declare('tobuy.formatters');

	tobuy.formatters = {
		// Returns whether all tobuys are completed
		allCompletedTodosFormatter: function (aTodos) {
			return !(aTodos.some(function (element, index, array) {
				return element.done === false;
			}));
		},

		// Converts booleans to strings
		booleanToStringFormatter: function (value) {
			if (value === true) {
				return 'true';
			}
			return 'false';
		},

		// Returns whether a completed tobuy is available
		hasCompletedTodosFormatter: function (aTodos) {
			return aTodos.some(function (element, index, array) {
				return element.done === true;
			});
		},

		// Returns whether a an array has elements
		isArrayNonEmptyFormatter: function (aTodos) {
			return aTodos.length > 0;
		},

		// Counts the number of open tobuys
		openTodoCountFormatter: function (aTodos) {
			var numberOfOpenItems = 0;
			aTodos.forEach(function (tobuy) {
				if (tobuy.done === false) {
					numberOfOpenItems++;
				}
			});

			return numberOfOpenItems === 1 ? '1 item left' : numberOfOpenItems + ' items left';
		}
	};
})();
