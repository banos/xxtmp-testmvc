/*global jQuery, sap, tobuy */
/*jshint unused:false */

/*
 * Performs no UI logic and has therefore has no references to UI controls.
 * Accesses and modifies model and relies on data binding to inform UI about changes.
 */
(function () {
	'use strict';

	jQuery.sap.require('tobuy.TodoPersistency');

	sap.ui.controller('tobuy.Todo', {

		// Stores tobuys permanently via HTML5 localStorage
		store: new tobuy.TodoPersistency('tobuys'),

		// Stores tobuys for the duration of the session
		model: null,

		// Retrieve tobuys from store and initialize model
		onInit: function () {
			var data = null;
			if (this.store.isEmpty()) {
				data = this.store.set({
					tobuys: []
				}).get();
			} else {
				data = this.store.get();
			}
			this.model = new sap.ui.model.json.JSONModel(data);
			this.getView().setModel(this.model);
		},

		// Create a new tobuy
		createTodo: function (tobuy) {
			tobuy = tobuy.trim();
			if (tobuy.length === 0) {
				return;
			}

			var tobuys = this.model.getProperty('/tobuys/');
			tobuys.push({
				id: jQuery.sap.uid(),
				done: false,
				text: tobuy
			});
			this.model.setProperty('/tobuys/', tobuys);

			this.store.set(this.model.getData());

			this.model.updateBindings(true);
		},

		// Clear tobuy
		clearTodo: function (tobuy) {
			var tobuys = this.model.getProperty('/tobuys/');
			for (var i = tobuys.length - 1; i >= 0; i--) {
				if (tobuys[i].id === tobuy.getProperty('id')) {
					tobuys.splice(i, 1);
				}
			}
			this.model.setProperty('/tobuys/', tobuys);

			this.store.set(this.model.getData());

			this.model.updateBindings(true);
		},

		// Clear all completed tobuys
		clearCompletedTodos: function () {
			var tobuys = this.model.getProperty('/tobuys/');
			for (var i = tobuys.length - 1; i >= 0; i--) {
				if (tobuys[i].done === true) {
					tobuys.splice(i, 1);
				}
			}
			this.model.setProperty('/tobuys/', tobuys);

			this.store.set(this.model.getData());

			this.model.updateBindings(true);
		},

		// Complete / reopen all tobuys
		toggleAll: function () {
			var tobuys = this.model.getProperty('/tobuys/');
			var hasOpenTodos = tobuys.some(function (element, index, array) {
				return element.done === false;
			});

			tobuys.forEach(function (tobuy) {
				tobuy.done = hasOpenTodos;
			});

			this.store.set(this.model.getData());

			this.model.updateBindings(true);
		},

		// Complete / reopen a tobuy
		tobuyToggled: function (tobuy) {
			this.store.set(this.model.getData());

			this.model.updateBindings(true);
		},

		// Rename a tobuy
		tobuyRenamed: function (tobuy) {
			var text = tobuy.getProperty('text').trim();
			if (text.length === 0) {
				this.clearTodo(tobuy);
			} else {
				tobuy.getModel().setProperty(tobuy.getPath() + '/text', text);

				this.store.set(this.model.getData());

				this.model.updateBindings(true);
			}
		},

		// Change model filter based on selection
		tobuysSelected: function (selectionMode) {
			if (selectionMode === 'AllTodos') {
				this.getView().changeSelection([]);
			} else if (selectionMode === 'ActiveTodos') {
				this.getView().changeSelection(
					[new sap.ui.model.Filter('done',
						sap.ui.model.FilterOperator.EQ, false)]);
			} else if (selectionMode === 'CompletedTodos') {
				this.getView().changeSelection(
					[new sap.ui.model.Filter('done',
						sap.ui.model.FilterOperator.EQ, true)]);
			}
		}

	});
})();
