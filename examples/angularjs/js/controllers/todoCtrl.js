/*global angular */

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the tobuyStorage service
 * - exposes the model to the template and provides event handlers
 */
angular.module('tobuymvc')
	.controller('TodoCtrl', function TodoCtrl($scope, $routeParams, $filter, store) {
		'use strict';

		var tobuys = $scope.tobuys = store.tobuys;

		$scope.newTodo = '';
		$scope.editedTodo = null;

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

		$scope.addTodo = function () {
			var newTodo = {
				title: $scope.newTodo.trim(),
				completed: false
			};

			if (!newTodo.title) {
				return;
			}

			$scope.saving = true;
			store.insert(newTodo)
				.then(function success() {
					$scope.newTodo = '';
				})
				.finally(function () {
					$scope.saving = false;
				});
		};

		$scope.editTodo = function (tobuy) {
			$scope.editedTodo = tobuy;
			// Clone the original tobuy to restore it on demand.
			$scope.originalTodo = angular.extend({}, tobuy);
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
				// Todo edits were reverted-- don't save.
				$scope.reverted = null;
				return;
			}

			tobuy.title = tobuy.title.trim();

			if (tobuy.title === $scope.originalTodo.title) {
				$scope.editedTodo = null;
				return;
			}

			store[tobuy.title ? 'put' : 'delete'](tobuy)
				.then(function success() {}, function error() {
					tobuy.title = $scope.originalTodo.title;
				})
				.finally(function () {
					$scope.editedTodo = null;
				});
		};

		$scope.revertEdits = function (tobuy) {
			tobuys[tobuys.indexOf(tobuy)] = $scope.originalTodo;
			$scope.editedTodo = null;
			$scope.originalTodo = null;
			$scope.reverted = true;
		};

		$scope.removeTodo = function (tobuy) {
			store.delete(tobuy);
		};

		$scope.saveTodo = function (tobuy) {
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

		$scope.clearCompletedTodos = function () {
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
