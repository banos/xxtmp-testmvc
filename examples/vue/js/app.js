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
			newTobuy: '',
			editedTobuy: null,
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
			filteredTobuys: function () {
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

			addTobuy: function () {
				var value = this.newTobuy && this.newTobuy.trim();
				if (!value) {
					return;
				}
				this.tobuys.push({ id: this.tobuys.length + 1, title: value, completed: false });
				this.newTobuy = '';
			},

			removeTobuy: function (tobuy) {
				var index = this.tobuys.indexOf(tobuy);
				this.tobuys.splice(index, 1);
			},

			editTobuy: function (tobuy) {
				this.beforeEditCache = tobuy.title;
				this.editedTobuy = tobuy;
			},

			doneEdit: function (tobuy) {
				if (!this.editedTobuy) {
					return;
				}
				this.editedTobuy = null;
				tobuy.title = tobuy.title.trim();
				if (!tobuy.title) {
					this.removeTobuy(tobuy);
				}
			},

			cancelEdit: function (tobuy) {
				this.editedTobuy = null;
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
