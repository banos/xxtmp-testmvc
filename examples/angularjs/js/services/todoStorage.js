/*global angular */

/**
 * Services that persists and retrieves tobuys from localStorage or a backend API
 * if available.
 *
 * They both follow the same API, returning promises for all changes to the
 * model.
 */
angular.module('tobuymvc')
	.factory('tobuyStorage', function ($http, $injector) {
		'use strict';

		// Detect if an API backend is present. If so, return the API module, else
		// hand off the localStorage adapter
		return $http.get('/api')
			.then(function () {
				return $injector.get('api');
			}, function () {
				return $injector.get('localStorage');
			});
	})

	.factory('api', function ($resource) {
		'use strict';

		var store = {
			tobuys: [],

			api: $resource('/api/tobuys/:id', null,
				{
					update: { method:'PUT' }
				}
			),

			clearCompleted: function () {
				var originalTodos = store.tobuys.slice(0);

				var incompleteTodos = store.tobuys.filter(function (tobuy) {
					return !tobuy.completed;
				});

				angular.copy(incompleteTodos, store.tobuys);

				return store.api.delete(function () {
					}, function error() {
						angular.copy(originalTodos, store.tobuys);
					});
			},

			delete: function (tobuy) {
				var originalTodos = store.tobuys.slice(0);

				store.tobuys.splice(store.tobuys.indexOf(tobuy), 1);
				return store.api.delete({ id: tobuy.id },
					function () {
					}, function error() {
						angular.copy(originalTodos, store.tobuys);
					});
			},

			get: function () {
				return store.api.query(function (resp) {
					angular.copy(resp, store.tobuys);
				});
			},

			insert: function (tobuy) {
				var originalTodos = store.tobuys.slice(0);

				return store.api.save(tobuy,
					function success(resp) {
						tobuy.id = resp.id;
						store.tobuys.push(tobuy);
					}, function error() {
						angular.copy(originalTodos, store.tobuys);
					})
					.$promise;
			},

			put: function (tobuy) {
				return store.api.update({ id: tobuy.id }, tobuy)
					.$promise;
			}
		};

		return store;
	})

	.factory('localStorage', function ($q) {
		'use strict';

		var STORAGE_ID = 'tobuys-angularjs';

		var store = {
			tobuys: [],

			_getFromLocalStorage: function () {
				return JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
			},

			_saveToLocalStorage: function (tobuys) {
				localStorage.setItem(STORAGE_ID, JSON.stringify(tobuys));
			},

			clearCompleted: function () {
				var deferred = $q.defer();

				var incompleteTodos = store.tobuys.filter(function (tobuy) {
					return !tobuy.completed;
				});

				angular.copy(incompleteTodos, store.tobuys);

				store._saveToLocalStorage(store.tobuys);
				deferred.resolve(store.tobuys);

				return deferred.promise;
			},

			delete: function (tobuy) {
				var deferred = $q.defer();

				store.tobuys.splice(store.tobuys.indexOf(tobuy), 1);

				store._saveToLocalStorage(store.tobuys);
				deferred.resolve(store.tobuys);

				return deferred.promise;
			},

			get: function () {
				var deferred = $q.defer();

				angular.copy(store._getFromLocalStorage(), store.tobuys);
				deferred.resolve(store.tobuys);

				return deferred.promise;
			},

			insert: function (tobuy) {
				var deferred = $q.defer();

				store.tobuys.push(tobuy);

				store._saveToLocalStorage(store.tobuys);
				deferred.resolve(store.tobuys);

				return deferred.promise;
			},

			put: function (tobuy, index) {
				var deferred = $q.defer();

				store.tobuys[index] = tobuy;

				store._saveToLocalStorage(store.tobuys);
				deferred.resolve(store.tobuys);

				return deferred.promise;
			}
		};

		return store;
	});
