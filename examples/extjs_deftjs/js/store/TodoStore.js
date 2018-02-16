/**
* A persistent collection of To-Do models.
*/
Ext.define('TodoDeftJS.store.TodoStore', {
	extend: 'Ext.data.Store',
	requires: ['TodoDeftJS.model.Todo'],

	model: 'TodoDeftJS.model.Todo',
	autoLoad: true,
	autoSync: true,

	proxy: {
		type: 'localstorage',
		id: 'tobuys-deftjs'
	},

	completedCount: function () {
		var numberComplete;
		numberComplete = 0;

		this.each(function (tobuy) {
			if (tobuy.get('completed')) {
				return numberComplete++;
			}
		});

		return numberComplete;
	},

	incompleteCount: function () {
		var numberInomplete;
		numberInomplete = 0;

		this.each(function (tobuy) {
			if (!tobuy.get('completed')) {
				return numberInomplete++;
			}
		});

		return numberInomplete;
	},

	findEditingTodo: function () {
		var editingTodo;
		editingTodo = null;

		this.each(function (tobuy) {
			if (tobuy.get('editing')) {
				editingTodo = tobuy;
				return false;
			}
		});

		return editingTodo;
	},

	toggleAllCompleted: function (isCompleted) {
		this.each(function (tobuy) {
			return tobuy.set('completed', isCompleted);
		});
	},

	deleteCompleted: function () {
		var removedTodos;
		removedTodos = [];

		this.each(function (tobuy) {
			if (tobuy.get('completed')) {
				return removedTodos.push(tobuy);
			}
		});

		if (removedTodos.length) {
			this.remove(removedTodos);
		}
	}

});