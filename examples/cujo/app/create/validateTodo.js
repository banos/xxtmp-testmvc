/*global define */
define(function () {
	'use strict';

	/**
	 * Validate a tobuy
	 */
	return function validateTodo(tobuy) {
		// Must be a valid object, and have a text property that is non-empty
		var valid = tobuy && 'text' in tobuy && tobuy.text.trim();
		var result = { valid: !!valid };

		if (!valid) {
			result.errors = [{ property: 'text', message: 'missing' }];
		}

		return result;
	};
});
