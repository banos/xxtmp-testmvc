/*global define */
define(function () {
	'use strict';

	return function (tobuy) {
		tobuy.text = tobuy.text && tobuy.text.trim() || '';
		tobuy.complete = !!tobuy.complete;

		return tobuy;
	};
});
