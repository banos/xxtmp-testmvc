'use strict';
var app = app || {};

(function () {
	var STORAGE_ID = 'tobuys-mithril';
	app.storage = {
		get: function () {
			return JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
		},
		put: function (tobuys) {
			localStorage.setItem(STORAGE_ID, JSON.stringify(tobuys));
		}
	};
})();
