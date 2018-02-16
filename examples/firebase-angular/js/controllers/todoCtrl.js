/*global tobuymvc, angular, Firebase */
'use strict';

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the $firebaseArray service
 * - exposes the model to the template and provides event handlers
 */
tobuymvc.controller('TodoCtrl', function TodoCtrl($scope, $location, $firebaseArray) {
	var url = 'https://tobuymvc-angular.firebaseio.com/tobuys';
	var fireRef = new Firebase(url);

	// Bind the tobuys to the firebase provider.
	$scope.tobuys = $firebaseArray(fireRef);
	$scope.newTodo = '';
	$scope.editedTodo = null;

	$scope.$watch('tobuys', function () {
		var total = 0;
		var remaining = 0;
		$scope.tobuys.forEach(function (tobuy) {
			// Skip invalid entries so they don't break the entire app.
			if (!tobuy || !tobuy.title) {
				return;
			}

			total++;
			if (tobuy.completed === false) {
				remaining++;
			}
		});
		$scope.totalCount = total;
		$scope.remainingCount = remaining;
		$scope.completedCount = total - remaining;
		$scope.allChecked = remaining === 0;
	}, true);

	$scope.addTodo = function () {
		var newTodo = $scope.newTodo.trim();
		if (!newTodo.length) {
			return;
		}
		$scope.tobuys.$add({
			title: newTodo,
			completed: false
		});
		$scope.newTodo = '';
	};

	$scope.editTodo = function (tobuy) {
		$scope.editedTodo = tobuy;
		$scope.originalTodo = angular.extend({}, $scope.editedTodo);
	};

	$scope.doneEditing = function (tobuy) {
		$scope.editedTodo = null;
		var title = tobuy.title.trim();
		if (title) {
			$scope.tobuys.$save(tobuy);
		} else {
			$scope.removeTodo(tobuy);
		}
	};

	$scope.revertEditing = function (tobuy) {
		tobuy.title = $scope.originalTodo.title;
		$scope.doneEditing(tobuy);
	};

	$scope.removeTodo = function (tobuy) {
		$scope.tobuys.$remove(tobuy);
	};

	$scope.clearCompletedTodos = function () {
		$scope.tobuys.forEach(function (tobuy) {
			if (tobuy.completed) {
				$scope.removeTodo(tobuy);
			}
		});
	};

	$scope.markAll = function (allCompleted) {
		$scope.tobuys.forEach(function (tobuy) {
			tobuy.completed = allCompleted;
			$scope.tobuys.$save(tobuy);
		});
	};

	if ($location.path() === '') {
		$location.path('/');
	}
	$scope.location = $location;
});
