/*global describe, it, beforeEach, inject, expect*/
(function () {
	'use strict';

	describe('Todo Controller', function () {
		var ctrl, scope, store;

		// Load the module containing the app, only 'ng' is loaded by default.
		beforeEach(module('tobuymvc'));

		beforeEach(inject(function ($controller, $rootScope, localStorage) {
			scope = $rootScope.$new();

			store = localStorage;

			localStorage.tobuys = [];
			localStorage._getFromLocalStorage = function () {
				return [];
			};
			localStorage._saveToLocalStorage = function (tobuys) {
				localStorage.tobuys = tobuys;
			};

			ctrl = $controller('TodoCtrl', {
				$scope: scope,
				store: store
			});
		}));

		it('should not have an edited Todo on start', function () {
			expect(scope.editedTodo).toBeNull();
		});

		it('should not have any Todos on start', function () {
			expect(scope.tobuys.length).toBe(0);
		});

		it('should have all Todos completed', function () {
			scope.$digest();
			expect(scope.allChecked).toBeTruthy();
		});

		describe('the filter', function () {
			it('should default to ""', function () {
				scope.$emit('$routeChangeSuccess');

				expect(scope.status).toBe('');
				expect(scope.statusFilter).toEqual({});
			});

			describe('being at /active', function () {
				it('should filter non-completed', inject(function ($controller) {
					ctrl = $controller('TodoCtrl', {
						$scope: scope,
						store: store,
						$routeParams: {
							status: 'active'
						}
					});

					scope.$emit('$routeChangeSuccess');
					expect(scope.statusFilter.completed).toBeFalsy();
				}));
			});

			describe('being at /completed', function () {
				it('should filter completed', inject(function ($controller) {
					ctrl = $controller('TodoCtrl', {
						$scope: scope,
						$routeParams: {
							status: 'completed'
						},
						store: store
					});

					scope.$emit('$routeChangeSuccess');
					expect(scope.statusFilter.completed).toBeTruthy();
				}));
			});
		});

		describe('having no Todos', function () {
			var ctrl;

			beforeEach(inject(function ($controller) {
				ctrl = $controller('TodoCtrl', {
					$scope: scope,
					store: store
				});
				scope.$digest();
			}));

			it('should not add empty Todos', function () {
				scope.newTodo = '';
				scope.addTodo();
				scope.$digest();
				expect(scope.tobuys.length).toBe(0);
			});

			it('should not add items consisting only of whitespaces', function () {
				scope.newTodo = '   ';
				scope.addTodo();
				scope.$digest();
				expect(scope.tobuys.length).toBe(0);
			});


			it('should trim whitespace from new Todos', function () {
				scope.newTodo = '  buy some unicorns  ';
				scope.addTodo();
				scope.$digest();
				expect(scope.tobuys.length).toBe(1);
				expect(scope.tobuys[0].title).toBe('buy some unicorns');
			});
		});

		describe('having some saved Todos', function () {
			var ctrl;

			beforeEach(inject(function ($controller) {
				ctrl = $controller('TodoCtrl', {
					$scope: scope,
					store: store
				});

				store.insert({ title: 'Uncompleted Item 0', completed: false });
				store.insert({ title: 'Uncompleted Item 1', completed: false });
				store.insert({ title: 'Uncompleted Item 2', completed: false });
				store.insert({ title: 'Completed Item 0', completed: true });
				store.insert({ title: 'Completed Item 1', completed: true });
				scope.$digest();
			}));

			it('should count Todos correctly', function () {
				expect(scope.tobuys.length).toBe(5);
				expect(scope.remainingCount).toBe(3);
				expect(scope.completedCount).toBe(2);
				expect(scope.allChecked).toBeFalsy();
			});

			it('should save Todos to local storage', function () {
				expect(scope.tobuys.length).toBe(5);
			});

			it('should remove Todos w/o title on saving', function () {
				var tobuy = store.tobuys[2];
				scope.editTodo(tobuy);
				tobuy.title = '';
				scope.saveEdits(tobuy);
				expect(scope.tobuys.length).toBe(4);
			});

			it('should trim Todos on saving', function () {
				var tobuy = store.tobuys[0];
				scope.editTodo(tobuy);
				tobuy.title = ' buy moar unicorns  ';
				scope.saveEdits(tobuy);
				expect(scope.tobuys[0].title).toBe('buy moar unicorns');
			});

			it('clearCompletedTodos() should clear completed Todos', function () {
				scope.clearCompletedTodos();
				expect(scope.tobuys.length).toBe(3);
			});

			it('markAll() should mark all Todos completed', function () {
				scope.markAll(true);
				scope.$digest();
				expect(scope.completedCount).toBe(5);
			});

			it('revertTodo() get a Todo to its previous state', function () {
				var tobuy = store.tobuys[0];
				scope.editTodo(tobuy);
				tobuy.title = 'Unicorn sparkly skypuffles.';
				scope.revertEdits(tobuy);
				scope.$digest();
				expect(scope.tobuys[0].title).toBe('Uncompleted Item 0');
			});
		});
	});
}());
