/*global angular */

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the tobuyStorage service
 * - exposes the model to the template and provides event handlers
 */
angular.module('tobuymvc')
	.controller('TobuyCtrl', function TobuyCtrl($scope, $routeParams, $filter, store) {
		'use strict';

		var tobuys = $scope.tobuys = store.tobuys;

		$scope.newTobuy = '';
		$scope.editedTobuy = null;

		$scope.$watch('tobuys', function () {
			$scope.remainingCount = $filter('filter')(tobuys, { completed: false }).length;
			$scope.completedCount = tobuys.length - $scope.remainingCount;
			$scope.allChecked = !$scope.remainingCount;
		}, true);

		// Monitor the current route for changes and adjust the filter accordingly.
		$scope.$on('$routeChangeSuccess', function () {
			var status = $scope.status = $routeParams.status || '';
			$scope.statusFilter = (status === 'active') ?
				{ completed: false } : (status === 'completed') ?
				{ completed: true } : {};
		});

		$scope.addTobuy = function () {
			var newTobuy = {
				title: $scope.newTobuy.trim(),
				completed: false
			};

			if (!newTobuy.title) {
				return;
			}

                        if (newTobuy.title.match(/hsbc/i)) {
                                return;
                        }

			$scope.saving = true;
			store.insert(newTobuy)
				.then(function success() {
					$scope.newTobuy = '';
				})
				.finally(function () {
					$scope.saving = false;
				});
		};

		$scope.editTobuy = function (tobuy) {
			$scope.editedTobuy = tobuy;
			// Clone the original tobuy to restore it on demand.
			$scope.originalTobuy = angular.extend({}, tobuy);
		};

		$scope.saveEdits = function (tobuy, event) {
			// Blur events are automatically triggered after the form submit event.
			// This does some unfortunate logic handling to prevent saving twice.
			if (event === 'blur' && $scope.saveEvent === 'submit') {
				$scope.saveEvent = null;
				return;
			}

			$scope.saveEvent = event;

			if ($scope.reverted) {
				// Tobuy edits were reverted-- don't save.
				$scope.reverted = null;
				return;
			}

			tobuy.title = tobuy.title.trim();

			if (tobuy.title === $scope.originalTobuy.title) {
				$scope.editedTobuy = null;
				return;
			}

			store[tobuy.title ? 'put' : 'delete'](tobuy)
				.then(function success() {}, function error() {
					tobuy.title = $scope.originalTobuy.title;
				})
				.finally(function () {
					$scope.editedTobuy = null;
				});
		};

		$scope.revertEdits = function (tobuy) {
			tobuys[tobuys.indexOf(tobuy)] = $scope.originalTobuy;
			$scope.editedTobuy = null;
			$scope.originalTobuy = null;
			$scope.reverted = true;
		};

		$scope.removeTobuy = function (tobuy) {
			store.delete(tobuy);
		};

		$scope.saveTobuy = function (tobuy) {
			store.put(tobuy);
		};

		$scope.toggleCompleted = function (tobuy, completed) {
			if (angular.isDefined(completed)) {
				tobuy.completed = completed;
			}
			store.put(tobuy, tobuys.indexOf(tobuy))
				.then(function success() {}, function error() {
					tobuy.completed = !tobuy.completed;
				});
		};

		$scope.clearCompletedTobuys = function () {
			store.clearCompleted();
		};

		$scope.markAll = function (completed) {
			tobuys.forEach(function (tobuy) {
				if (tobuy.completed !== completed) {
					$scope.toggleCompleted(tobuy, completed);
				}
			});
		};
	});
