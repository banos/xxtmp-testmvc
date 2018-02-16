/*global angular */

/**
 * The main TodoMVC app module
 *
 * @type {angular.Module}
 */
angular.module('tobuymvc', ['ngRoute', 'ngResource'])
	.config(function ($routeProvider) {
		'use strict';

		var routeConfig = {
			controller: 'TodoCtrl',
			templateUrl: 'tobuymvc-index.html',
			resolve: {
				store: function (tobuyStorage) {
					// Get the correct module (API or localStorage).
					return tobuyStorage.then(function (module) {
						module.get(); // Fetch the tobuy records in the background.
						return module;
					});
				}
			}
		};

		$routeProvider
			.when('/', routeConfig)
			.when('/:status', routeConfig)
			.otherwise({
				redirectTo: '/'
			});
	});
