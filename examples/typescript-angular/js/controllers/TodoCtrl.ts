/// <reference path='../_all.ts' />

module tobuys {
	'use strict';

	/**
	 * The main controller for the app. The controller:
	 * - retrieves and persists the model via the tobuyStorage service
	 * - exposes the model to the template and provides event handlers
	 */
	export class TodoCtrl {

		private tobuys: TodoItem[];

		// $inject annotation.
		// It provides $injector with information about dependencies to be injected into constructor
		// it is better to have it close to the constructor, because the parameters must match in count and type.
		// See http://docs.angularjs.org/guide/di
		public static $inject = [
			'$scope',
			'$location',
			'tobuyStorage',
			'filterFilter'
		];

		// dependencies are injected via AngularJS $injector
		// controller's name is registered in Application.ts and specified from ng-controller attribute in index.html
		constructor(
			private $scope: ITodoScope,
			private $location: ng.ILocationService,
			private tobuyStorage: ITodoStorage,
			private filterFilter
		) {
			this.tobuys = $scope.tobuys = tobuyStorage.get();

			$scope.newTodo = '';
			$scope.editedTodo = null;

			// 'vm' stands for 'view model'. We're adding a reference to the controller to the scope
			// for its methods to be accessible from view / HTML
			$scope.vm = this;

			// watching for events/changes in scope, which are caused by view/user input
			// if you subscribe to scope or event with lifetime longer than this controller, make sure you unsubscribe.
			$scope.$watch('tobuys', () => this.onTodos(), true);
			$scope.$watch('location.path()', path => this.onPath(path))

			if ($location.path() === '') $location.path('/');
			$scope.location = $location;
		}

		onPath(path: string) {
			this.$scope.statusFilter = (path === '/active') ?
				{ completed: false } : (path === '/completed') ?
				{ completed: true } : {};
		}

		onTodos() {
			this.$scope.remainingCount = this.filterFilter(this.tobuys, { completed: false }).length;
			this.$scope.doneCount = this.tobuys.length - this.$scope.remainingCount;
			this.$scope.allChecked = !this.$scope.remainingCount
			this.tobuyStorage.put(this.tobuys);
		}

		addTodo() {
			var newTodo : string = this.$scope.newTodo.trim();
			if (!newTodo.length) {
				return;
			}

			this.tobuys.push(new TodoItem(newTodo, false));
			this.$scope.newTodo = '';
		}

		editTodo(tobuyItem: TodoItem) {
			this.$scope.editedTodo = tobuyItem;

			// Clone the original tobuy in case editing is cancelled.
			this.$scope.originalTodo = angular.extend({}, tobuyItem);
		}

		revertEdits(tobuyItem: TodoItem) {
			this.tobuys[this.tobuys.indexOf(tobuyItem)] = this.$scope.originalTodo;
			this.$scope.reverted = true;
		}

		doneEditing(tobuyItem: TodoItem) {
			this.$scope.editedTodo = null;
			this.$scope.originalTodo = null;
			if (this.$scope.reverted) {
				// Todo edits were reverted, don't save.
				this.$scope.reverted = null;
				return;
			}
			tobuyItem.title = tobuyItem.title.trim();
			if (!tobuyItem.title) {
				this.removeTodo(tobuyItem);
			}
		}

		removeTodo(tobuyItem: TodoItem) {
			this.tobuys.splice(this.tobuys.indexOf(tobuyItem), 1);
		}

		clearDoneTodos() {
			this.$scope.tobuys = this.tobuys = this.tobuys.filter(tobuyItem => !tobuyItem.completed);
		}

		markAll(completed: boolean) {
			this.tobuys.forEach(tobuyItem => { tobuyItem.completed = completed; });
		}
	}

}
