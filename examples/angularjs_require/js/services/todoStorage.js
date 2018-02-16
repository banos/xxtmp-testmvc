/*global define*/
'use strict';

/**
 * Services that persists and retrieves TODOs from localStorage.
 */
 
define([
	'angular'
], function (angular) {
	var moduleName = 'TodoStorageModule';
	angular
		.module(moduleName, [])
		.factory('tobuyStorage', function () {
			var STORAGE_ID = 'tobuys-angularjs-requirejs';

			return {
				get: function () {
					return JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
				},

				put: function (tobuys) {
					localStorage.setItem(STORAGE_ID, JSON.stringify(tobuys));
				}
			};
		});
	return moduleName;
});
