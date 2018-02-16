/*global blocks */

(function () {
	'use strict';

	var ENTER_KEY = 13;
	var ESCAPE_KEY = 27;

	var App = blocks.Application();

	var Tobuy = App.Model({
		title: App.Property(),

		completed: App.Property(),

		editing: blocks.observable(),

		init: function () {
			var collection = this.collection();

			// collection is undefined when a Tobuy is still not part of the Tobuys collection
			if (collection) {
				// save to Local Storage on each attribute change
				this.title.on('change', collection.save);
				this.completed.on('change', collection.save);
			}

			this.title.on('change', function (newValue) {
				this.title((newValue || '').trim());
			});
		},

		toggleComplete: function () {
			this.completed(!this.completed());
		},

		edit: function () {
			this.lastValue = this.title();
			this.editing(true);
		},

		closeEdit: function () {
			if (this.title()) {
				this.editing(false);
			} else {
				this.destroy();
			}
		},

		handleAction: function (e) {
			if (e.which === ENTER_KEY) {
				this.closeEdit();
			} else if (e.which === ESCAPE_KEY) {
				this.title(this.lastValue);
				this.editing(false);
			}
		}
	});

	var Tobuys = App.Collection(Tobuy, {
		remaining: blocks.observable(),

		init: function () {
			this
				// load the data from the Local Storage
				.reset(JSON.parse(localStorage.getItem('tobuys-jsblocks')) || [])
				// save to Local Storage on each item add or remove
				.on('add remove', this.save)
				.updateRemaining();
		},

		// set all tobuys as completed
		toggleAll: function () {
			var complete = this.remaining() === 0 ? false : true;
			this.each(function (tobuy) {
				tobuy.completed(complete);
			});
		},

		// remove all completed tobuys
		clearCompleted: function () {
			this.removeAll(function (tobuy) {
				return tobuy.completed();
			});
		},

		// saves all data back to the Local Storage
		save: function () {
			var result = [];

			blocks.each(this(), function (model) {
				result.push(model.dataItem());
			});

			localStorage.setItem('tobuys-jsblocks', JSON.stringify(result));

			this.updateRemaining();
		},

		// updates the observable
		updateRemaining: function () {
			this.remaining(this.reduce(function (memo, tobuy) {
				return tobuy.completed() ? memo : memo + 1;
			}, 0));
		}
	});

	App.View('Tobuys', {
		options: {
			// creates a route for the View in order to handle
			// /all, /active, /completed filters
			route: blocks.route('{{filter}}').optional('filter')
		},

		filter: blocks.observable(),

		newTobuy: new Tobuy(),

		// holds all tobuys for the current view
		// tobuys are filtered if "Active" or "Completed" is clicked
		tobuys: new Tobuys().extend('filter', function (value) {
			var mode = this.filter();
			var completed = value.completed();
			var include = true;

			if (mode === 'active') {
				include = !completed;
			} else if (mode === 'completed') {
				include = completed;
			}

			return include;
		}),

		// filter the data when the route have changed
		// the callback is fired when "All", "Active" or "Completed" have been clicked
		routed: function (params) {
			if (params.filter !== 'active' && params.filter !== 'completed') {
				params.filter = 'all';
			}
			this.filter(params.filter);
		},

		addTobuy: function (e) {
			if (e.which === ENTER_KEY && this.newTobuy.title()) {
				this.tobuys.push(this.newTobuy);
				// return all Tobuy values to their defaults
				this.newTobuy.reset();
			}
		}
	});
})();
