/*jshint unused:false */

(function (exports) {

	'use strict';

	var STORAGE_KEY = 'tobuys-vuejs';

	exports.tobuyStorage = {
		fetch: function () {
			return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
		},
		save: function (tobuys) {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(tobuys));
		}
	};

})(window);
