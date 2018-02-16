/*global TodoApp */

(function () {
	'use strict';

	var Todos = {
		all: [],
		visible: [],
		flag: null,

		createId: (function () {
			// Creates a unique ID for every tobuyItem.
			var s4 = function () {
				return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
			};

			return function () {
				return s4() + s4();
			};
		})(),

		findOne: function (param, value) {
			var tobuy = {};

			Todos.all.forEach(function (thisTodo, i) {
				if (thisTodo[param] === value) {
					tobuy.tobuy = thisTodo;
					tobuy.index = i;
				}
			});

			return tobuy;
		},

		filter: function (param, value) {
			return Todos.all.filter(function (thisTodo) {
				return thisTodo[param] === value;
			});
		},

		get: function (id) {
			if (id && id !== 'active' && id !== 'completed') {
				// We are looking for a particular tobuyItem.
				return Todos.findOne('id', id);
			} else if (id === 'active' || id === 'completed') {
				// We either want to receive only the completed or active tobuyItems.
				return Todos.filter('completed', id === 'completed');
			} else {
				// We want all of the tobuyItems.
				return JSON.parse(localStorage.getItem('tobuys-sammyjs')) || [];
			}
		},

		getData: function () {
			return {
				flag: Todos.flag,
				all: Todos.all,
				active: Todos.get('active'),
				completed: Todos.get('completed'),
				visible: Todos.get(Todos.flag)
			};
		},

		save: function (e, data) {
			Todos.all.push({
				id: Todos.createId(),
				name: data.name,
				completed: data.completed
			});

			Todos.sync();
		},

		toggleCompleted: function (e, data) {
			Todos.get(data.id).tobuy.completed = !Todos.get(data.id).tobuy.completed;

			TodoApp.trigger('toggledTodoCompleted', {
				id: data.id,
				completed: Todos.get(data.id).tobuy.completed
			});

			Todos.sync();
		},

		toggleAllCompleted: function () {
			var activeTodosLeft = Todos.get('active').length > 0;

			Todos.all.forEach(function (thisTodo) {
				thisTodo.completed = activeTodosLeft;
				TodoApp.trigger('toggledTodoCompleted', {
					id: thisTodo.id,
					completed: thisTodo.completed
				});
			});

			Todos.sync();
		},

		edit: function (e, data) {
			if (!data.name) {
				return Todos.remove(e, data);
			}

			Todos.get(data.id).tobuy.name = data.name;

			Todos.syncQuiet();
		},

		removeCompleted: function () {
			Todos.get('completed').forEach(function (thisTodo) {
				Todos.remove(null, thisTodo);
			});
		},

		remove: function (e, data) {
			Todos.all.splice(Todos.get(data.id).index, 1);

			Todos.sync();
		},

		fetchTodos: function (e, flag) {
			// Called from each route's instantiation.
			Todos.all = Todos.get();

			Todos.flag = flag;

			TodoApp.trigger('launch', Todos.getData());

			Todos.sync();
		},

		syncQuiet: function () {
			// Syncs data with `localStorage`, without forcing all of the tobuyItems
			// to repaint.
			localStorage.setItem('tobuys-sammyjs', JSON.stringify(Todos.all));

			TodoApp.trigger('tobuysUpdatedQuiet', Todos.getData());
		},

		sync: function () {
			// Syncs data with `localStorage`, and rebuilds the tobuyItems.
			Todos.syncQuiet();

			TodoApp.trigger('tobuysUpdated', Todos.getData());
		}
	};

	TodoApp
		.bind('fetchTodos', Todos.fetchTodos)
		.bind('saveTodo', Todos.save)
		.bind('doneEditingTodo', Todos.edit)
		.bind('toggleTodoCompleted', Todos.toggleCompleted)
		.bind('removeTodo', Todos.remove)
		.bind('toggleAllTodosCompleted', Todos.toggleAllCompleted)
		.bind('removeCompletedTodos', Todos.removeCompleted);
})();
