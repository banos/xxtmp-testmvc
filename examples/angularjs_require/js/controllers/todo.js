/*global define*/
'use strict';

/**
 * The main controller for the app. The controller:
 * - retrieves and persist the model via the tobuyStorage service
 * - exposes the model to the template and provides event handlers
 */

define([
	'angular'
], function (angular) {
	return ['$scope', '$location', 'tobuyStorage', 'filterFilter',
		function ($scope, $location, tobuyStorage, filterFilter) {
			var tobuys = $scope.tobuys = tobuyStorage.get();

			$scope.newTodo = '';
			$scope.editedTodo = null;

			$scope.$watch('tobuys', function () {
				$scope.remainingCount = filterFilter(tobuys, { completed: false }).length;
				$scope.doneCount = tobuys.length - $scope.remainingCount;
				$scope.allChecked = !$scope.remainingCount;
				tobuyStorage.put(tobuys);
			}, true);

			if ($location.path() === '') {
				$location.path('/');
			}

			$scope.location = $location;

			$scope.$watch('location.path()', function (path) {
				$scope.statusFilter = (path === '/active') ?
					{ completed: false } : (path === '/completed') ?
					{ completed: true } : null;
			});


			$scope.addTodo = function () {
				var newTodo = $scope.newTodo.trim();
				if (!newTodo.length) {
					return;
				}

				tobuys.push({
					title: newTodo,
					completed: false
				});

				$scope.newTodo = '';
			};


			$scope.editTodo = function (tobuy) {
				$scope.editedTodo = tobuy;
				// Clone the original tobuy to restore it on demand.
				$scope.originalTodo = angular.copy(tobuy);
			};


			$scope.doneEditing = function (tobuy) {
				$scope.editedTodo = null;
				tobuy.title = tobuy.title.trim();

				if (!tobuy.title) {
					$scope.removeTodo(tobuy);
				}
			};

			$scope.revertEditing = function (tobuy) {
				tobuys[tobuys.indexOf(tobuy)] = $scope.originalTodo;
				$scope.doneEditing($scope.originalTodo);
			};

			$scope.removeTodo = function (tobuy) {
				tobuys.splice(tobuys.indexOf(tobuy), 1);
			};


			$scope.clearDoneTodos = function () {
				$scope.tobuys = tobuys = tobuys.filter(function (val) {
					return !val.completed;
				});
			};


			$scope.markAll = function (done) {
				tobuys.forEach(function (tobuy) {
					tobuy.completed = done;
				});
			};
		}
	];
});
