/*global app, jasmine, describe, it, beforeEach, expect */

describe('controller', function () {
	'use strict';

	var subject, model, view;

	var setUpModel = function (tobuys) {
		model.read.and.callFake(function (query, callback) {
			callback = callback || query;
			callback(tobuys);
		});

		model.getCount.and.callFake(function (callback) {

			var tobuyCounts = {
				active: tobuys.filter(function (tobuy) {
					return !tobuy.completed;
				}).length,
				completed: tobuys.filter(function (tobuy) {
					return !!tobuy.completed;
				}).length,
				total: tobuys.length
			};

			callback(tobuyCounts);
		});

		model.remove.and.callFake(function (id, callback) {
			callback();
		});

		model.create.and.callFake(function (title, callback) {
			callback();
		});

		model.update.and.callFake(function (id, updateData, callback) {
			callback();
		});
	};

	var createViewStub = function () {
		var eventRegistry = {};
		return {
			render: jasmine.createSpy('render'),
			bind: function (event, handler) {
				eventRegistry[event] = handler;
			},
			trigger: function (event, parameter) {
				eventRegistry[event](parameter);
			}
		};
	};

	beforeEach(function () {
		model = jasmine.createSpyObj('model', ['read', 'getCount', 'remove', 'create', 'update']);
		view = createViewStub();
		subject = new app.Controller(model, view);
	});

	it('should show entries on start-up', function () {
		setUpModel([]);

		subject.setView('');

		expect(view.render).toHaveBeenCalledWith('showEntries', []);
	});

	describe('routing', function () {

		it('should show all entries without a route', function () {
			var tobuy = {title: 'my tobuy'};
			setUpModel([tobuy]);

			subject.setView('');

			expect(view.render).toHaveBeenCalledWith('showEntries', [tobuy]);
		});

		it('should show all entries without "all" route', function () {
			var tobuy = {title: 'my tobuy'};
			setUpModel([tobuy]);

			subject.setView('#/');

			expect(view.render).toHaveBeenCalledWith('showEntries', [tobuy]);
		});

		it('should show active entries', function () {
			var tobuy = {title: 'my tobuy', completed: false};
			setUpModel([tobuy]);

			subject.setView('#/active');

			expect(model.read).toHaveBeenCalledWith({completed: false}, jasmine.any(Function));
			expect(view.render).toHaveBeenCalledWith('showEntries', [tobuy]);
		});

		it('should show completed entries', function () {
			var tobuy = {title: 'my tobuy', completed: true};
			setUpModel([tobuy]);

			subject.setView('#/completed');

			expect(model.read).toHaveBeenCalledWith({completed: true}, jasmine.any(Function));
			expect(view.render).toHaveBeenCalledWith('showEntries', [tobuy]);
		});
	});

	it('should show the content block when tobuys exists', function () {
		setUpModel([{title: 'my tobuy', completed: true}]);

		subject.setView('');

		expect(view.render).toHaveBeenCalledWith('contentBlockVisibility', {
			visible: true
		});
	});

	it('should hide the content block when no tobuys exists', function () {
		setUpModel([]);

		subject.setView('');

		expect(view.render).toHaveBeenCalledWith('contentBlockVisibility', {
			visible: false
		});
	});

	it('should check the toggle all button, if all tobuys are completed', function () {
		setUpModel([{title: 'my tobuy', completed: true}]);

		subject.setView('');

		expect(view.render).toHaveBeenCalledWith('toggleAll', {
			checked: true
		});
	});

	it('should set the "clear completed" button', function () {
		var tobuy = {id: 42, title: 'my tobuy', completed: true};
		setUpModel([tobuy]);

		subject.setView('');

		expect(view.render).toHaveBeenCalledWith('clearCompletedButton', {
			completed: 1,
			visible: true
		});
	});

	it('should highlight "All" filter by default', function () {
		setUpModel([]);

		subject.setView('');

		expect(view.render).toHaveBeenCalledWith('setFilter', '');
	});

	it('should highlight "Active" filter when switching to active view', function () {
		setUpModel([]);

		subject.setView('#/active');

		expect(view.render).toHaveBeenCalledWith('setFilter', 'active');
	});

	describe('toggle all', function () {
		it('should toggle all tobuys to completed', function () {
			var tobuys = [{
				id: 42,
				title: 'my tobuy',
				completed: false
			}, {
				id: 21,
				title: 'another tobuy',
				completed: false
			}];

			setUpModel(tobuys);
			subject.setView('');

			view.trigger('toggleAll', {completed: true});

			expect(model.update).toHaveBeenCalledWith(42, {completed: true}, jasmine.any(Function));
			expect(model.update).toHaveBeenCalledWith(21, {completed: true}, jasmine.any(Function));
		});

		it('should update the view', function () {
			var tobuys = [{
				id: 42,
				title: 'my tobuy',
				completed: true
			}];

			setUpModel(tobuys);
			subject.setView('');

			view.trigger('toggleAll', {completed: false});

			expect(view.render).toHaveBeenCalledWith('elementComplete', {id: 42, completed: false});
		});
	});

	describe('new tobuy', function () {
		it('should add a new tobuy to the model', function () {
			setUpModel([]);

			subject.setView('');

			view.trigger('newTodo', 'a new tobuy');

			expect(model.create).toHaveBeenCalledWith('a new tobuy', jasmine.any(Function));
		});

		it('should add a new tobuy to the view', function () {
			setUpModel([]);

			subject.setView('');

			view.render.calls.reset();
			model.read.calls.reset();
			model.read.and.callFake(function (callback) {
				callback([{
					title: 'a new tobuy',
					completed: false
				}]);
			});

			view.trigger('newTodo', 'a new tobuy');

			expect(model.read).toHaveBeenCalled();

			expect(view.render).toHaveBeenCalledWith('showEntries', [{
				title: 'a new tobuy',
				completed: false
			}]);
		});

		it('should clear the input field when a new tobuy is added', function () {
			setUpModel([]);

			subject.setView('');

			view.trigger('newTodo', 'a new tobuy');

			expect(view.render).toHaveBeenCalledWith('clearNewTodo');
		});
	});

	describe('element removal', function () {
		it('should remove an entry from the model', function () {
			var tobuy = {id: 42, title: 'my tobuy', completed: true};
			setUpModel([tobuy]);

			subject.setView('');
			view.trigger('itemRemove', {id: 42});

			expect(model.remove).toHaveBeenCalledWith(42, jasmine.any(Function));
		});

		it('should remove an entry from the view', function () {
			var tobuy = {id: 42, title: 'my tobuy', completed: true};
			setUpModel([tobuy]);

			subject.setView('');
			view.trigger('itemRemove', {id: 42});

			expect(view.render).toHaveBeenCalledWith('removeItem', 42);
		});

		it('should update the element count', function () {
			var tobuy = {id: 42, title: 'my tobuy', completed: true};
			setUpModel([tobuy]);

			subject.setView('');
			view.trigger('itemRemove', {id: 42});

			expect(view.render).toHaveBeenCalledWith('updateElementCount', 0);
		});
	});

	describe('remove completed', function () {
		it('should remove a completed entry from the model', function () {
			var tobuy = {id: 42, title: 'my tobuy', completed: true};
			setUpModel([tobuy]);

			subject.setView('');
			view.trigger('removeCompleted');

			expect(model.read).toHaveBeenCalledWith({completed: true}, jasmine.any(Function));
			expect(model.remove).toHaveBeenCalledWith(42, jasmine.any(Function));
		});

		it('should remove a completed entry from the view', function () {
			var tobuy = {id: 42, title: 'my tobuy', completed: true};
			setUpModel([tobuy]);

			subject.setView('');
			view.trigger('removeCompleted');

			expect(view.render).toHaveBeenCalledWith('removeItem', 42);
		});
	});

	describe('element complete toggle', function () {
		it('should update the model', function () {
			var tobuy = {id: 21, title: 'my tobuy', completed: false};
			setUpModel([tobuy]);
			subject.setView('');

			view.trigger('itemToggle', {id: 21, completed: true});

			expect(model.update).toHaveBeenCalledWith(21, {completed: true}, jasmine.any(Function));
		});

		it('should update the view', function () {
			var tobuy = {id: 42, title: 'my tobuy', completed: true};
			setUpModel([tobuy]);
			subject.setView('');

			view.trigger('itemToggle', {id: 42, completed: false});

			expect(view.render).toHaveBeenCalledWith('elementComplete', {id: 42, completed: false});
		});
	});

	describe('edit item', function () {
		it('should switch to edit mode', function () {
			var tobuy = {id: 21, title: 'my tobuy', completed: false};
			setUpModel([tobuy]);

			subject.setView('');

			view.trigger('itemEdit', {id: 21});

			expect(view.render).toHaveBeenCalledWith('editItem', {id: 21, title: 'my tobuy'});
		});

		it('should leave edit mode on done', function () {
			var tobuy = {id: 21, title: 'my tobuy', completed: false};
			setUpModel([tobuy]);

			subject.setView('');

			view.trigger('itemEditDone', {id: 21, title: 'new title'});

			expect(view.render).toHaveBeenCalledWith('editItemDone', {id: 21, title: 'new title'});
		});

		it('should persist the changes on done', function () {
			var tobuy = {id: 21, title: 'my tobuy', completed: false};
			setUpModel([tobuy]);

			subject.setView('');

			view.trigger('itemEditDone', {id: 21, title: 'new title'});

			expect(model.update).toHaveBeenCalledWith(21, {title: 'new title'}, jasmine.any(Function));
		});

		it('should remove the element from the model when persisting an empty title', function () {
			var tobuy = {id: 21, title: 'my tobuy', completed: false};
			setUpModel([tobuy]);

			subject.setView('');

			view.trigger('itemEditDone', {id: 21, title: ''});

			expect(model.remove).toHaveBeenCalledWith(21, jasmine.any(Function));
		});

		it('should remove the element from the view when persisting an empty title', function () {
			var tobuy = {id: 21, title: 'my tobuy', completed: false};
			setUpModel([tobuy]);

			subject.setView('');

			view.trigger('itemEditDone', {id: 21, title: ''});

			expect(view.render).toHaveBeenCalledWith('removeItem', 21);
		});

		it('should leave edit mode on cancel', function () {
			var tobuy = {id: 21, title: 'my tobuy', completed: false};
			setUpModel([tobuy]);

			subject.setView('');

			view.trigger('itemEditCancel', {id: 21});

			expect(view.render).toHaveBeenCalledWith('editItemDone', {id: 21, title: 'my tobuy'});
		});

		it('should not persist the changes on cancel', function () {
			var tobuy = {id: 21, title: 'my tobuy', completed: false};
			setUpModel([tobuy]);

			subject.setView('');

			view.trigger('itemEditCancel', {id: 21});

			expect(model.update).not.toHaveBeenCalled();
		});
	});
});
