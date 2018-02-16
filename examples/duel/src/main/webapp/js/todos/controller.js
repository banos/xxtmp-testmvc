/*global window */
/*jshint camelcase:false */

var tobuys = tobuys || {};

(function (tobuys, document) {
	'use strict';

	/*-- private members -------------------------------*/

	var ESC_KEY = 27;
	var ENTER_KEY = 13;

	// Poor man's routing.
	addEventListener('hashchange', refreshView, false);

	function curFilter() {
		return document.location.hash.substr(2);
	}

	function find(selector, scope) {
		return (scope || document).querySelector(selector);
	}

	function refreshView() {
		// get the data
		var data = tobuys.model.viewData(curFilter());

		// build the view
		var view = tobuys.views.TodoApp(data).toDOM();

		var old = find('.tobuyapp');
		if (old) {
			// replace old task list
			old.parentNode.replaceChild(view, old);
		} else {
			// insert at top
			document.body.insertBefore(view, document.body.firstChild);
		}
		find('.new-tobuy').focus();
	}

	function add(input) {
		var title = (input.value || '').trim();
		input.value = '';

		if (!title) {
			return;
		}

		tobuys.model.add(title);
		refreshView();
	}

	function edit(input, id) {
		var title = (input.value || '').trim();
		input.value = title;

		if (title) {
			tobuys.model.edit(id, title);
		} else {
			tobuys.model.remove(id);
		}
		refreshView();
	}

	function reset(input, id) {
		var task = tobuys.model.find(id);
		if (task) {
			input.value = task.title;
		}
	}

	/*-- export public interface -------------------------------*/

	// event handlers
	tobuys.actions = {
		addOnKeydown: function (e) {
			if (e.keyCode === ENTER_KEY) {
				add(this);
			} else if (e.keyCode === ESC_KEY) {
				refreshView();
			}
		},

		editOnBlur: function (id) {
			// create a closure around the ID
			return function () {
				edit(this, id);
			};
		},

		editOnKeydown: function (id) {
			// create a closure around the ID
			return function (e) {
				if (e.keyCode === ENTER_KEY) {
					// just blur so doesn't get triggered twice
					this.blur();
				} else if (e.keyCode === ESC_KEY) {
					reset(this, id);
					this.blur();
				}
			};
		},

		removeOnClick: function (id) {
			// create a closure around the ID
			return function () {
				tobuys.model.remove(id);
				refreshView();
			};
		},

		clearOnClick: function () {
			tobuys.model.expunge();
			refreshView();
		},

		editOnDblclick: function () {
			var self = this;
			while (self.tagName !== 'LI') {
				self = self.parentNode;
			}

			self.className = 'editing';

			var input = find('input[type=text]', self);
			if (input) {
				input.focus();
			}
		},

		completedOnChange: function (id) {
			// create a closure around the ID
			return function () {
				tobuys.model.toggle(id, this.checked);
				refreshView();
			};
		},

		toggleOnChange: function () {
			tobuys.model.toggleAll(this.checked);
			refreshView();
		}
	};

	/*-- init task list -------------------------------*/

	refreshView();

})(tobuys, window.document);
