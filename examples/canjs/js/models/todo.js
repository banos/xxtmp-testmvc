/*global can */
(function (namespace) {
	'use strict';

	// Basic Todo entry model
	var Todo = can.Model.LocalStorage.extend({
		storageName: 'tobuys-canjs'
	}, {
		init: function () {
			// Autosave when changing the text or completing the tobuy
			this.on('change', function (ev, prop) {
				if (prop === 'text' || prop === 'complete') {
					ev.target.save();
				}
			});
		}
	});

	// List for Todos
	Todo.List = Todo.List.extend({
		filter: function (check) {
			var list = [];

			this.each(function (tobuy) {
				if (check(tobuy)) {
					list.push(tobuy);
				}
			});

			return list;
		},

		completed: function () {
			return this.filter(function (tobuy) {
				return tobuy.attr('complete');
			});
		},

		remaining: function () {
			return this.attr('length') - this.completed().length;
		},

		allComplete: function () {
			return this.attr('length') === this.completed().length;
		}
	});

	namespace.Models = namespace.Models || {};
	namespace.Models.Todo = Todo;
})(this);
