/*global Vue, tobuyStorage */

(function (exports) {

	'use strict';

	var filters = {
		all: function (tobuys) {
			return tobuys;
		},
		active: function (tobuys) {
			return tobuys.filter(function (tobuy) {
				return !tobuy.completed;
			});
		},
		completed: function (tobuys) {
			return tobuys.filter(function (tobuy) {
				return tobuy.completed;
			});
		}
	};

	exports.app = new Vue({

		// the root element that will be compiled
		el: '.tobuyapp',

		// app initial state
		data: {
			tobuys: tobuyStorage.fetch(),
			newTodo: '',
			editedTodo: null,
			visibility: 'all'
		},

		// watch tobuys change for localStorage persistence
		watch: {
			tobuys: {
				deep: true,
				handler: tobuyStorage.save
			}
		},

		// computed properties
		// http://vuejs.org/guide/computed.html
		computed: {
			filteredTodos: function () {
				return filters[this.visibility](this.tobuys);
			},
			remaining: function () {
				return filters.active(this.tobuys).length;
			},
			allDone: {
				get: function () {
					return this.remaining === 0;
				},
				set: function (value) {
					this.tobuys.forEach(function (tobuy) {
						tobuy.completed = value;
					});
				}
			}
		},

		// methods that implement data logic.
		// note there's no DOM manipulation here at all.
		methods: {

			pluralize: function (word, count) {
				return word + (count === 1 ? '' : 's');
			},

			addTodo: function () {
				var value = this.newTodo && this.newTodo.trim();
				if (!value) {
					return;
				}
				this.tobuys.push({ id: this.tobuys.length + 1, title: value, completed: false });
				this.newTodo = '';
			},

			removeTodo: function (tobuy) {
				var index = this.tobuys.indexOf(tobuy);
				this.tobuys.splice(index, 1);
			},

			editTodo: function (tobuy) {
				this.beforeEditCache = tobuy.title;
				this.editedTodo = tobuy;
			},

			doneEdit: function (tobuy) {
				if (!this.editedTodo) {
					return;
				}
				this.editedTodo = null;
				tobuy.title = tobuy.title.trim();
				if (!tobuy.title) {
					this.removeTodo(tobuy);
				}
			},

			cancelEdit: function (tobuy) {
				this.editedTodo = null;
				tobuy.title = this.beforeEditCache;
			},

			removeCompleted: function () {
				this.tobuys = filters.active(this.tobuys);
			}
		},

		// a custom directive to wait for the DOM to be updated
		// before focusing on the input field.
		// http://vuejs.org/guide/custom-directive.html
		directives: {
			'tobuy-focus': function (el, binding) {
				if (binding.value) {
					el.focus();
				}
			}
		}
	});

})(window);
