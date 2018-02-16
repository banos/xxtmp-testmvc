/*global angular */
/*jshint unused:false */
'use strict';

/**
 * The main TodoMVC app module
 *
 * @type {angular.Module}
 */
var tobuymvc = angular.module('tobuymvc', ['firebase']);

tobuymvc.filter('tobuyFilter', function ($location) {
	return function (input) {
		var filtered = {};
		angular.forEach(input, function (tobuy, id) {
			var path = $location.path();
			if (path === '/active') {
				if (!tobuy.completed) {
					filtered[id] = tobuy;
				}
			} else if (path === '/completed') {
				if (tobuy.completed) {
					filtered[id] = tobuy;
				}
			} else {
				filtered[id] = tobuy;
			}
		});
		return filtered;
	};
});
