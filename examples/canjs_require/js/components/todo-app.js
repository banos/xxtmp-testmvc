/* global define */
define([
	'can/util/library',
	'can/component',
	'../models/tobuy',
	'can/route'
], function (can, Component, Todo, route) {
	'use strict';

	var ESCAPE_KEY = 27;

	return Component.extend({
		// Create this component on a tag  like `<tobuy-app>`
		tag: 'tobuy-app',
		scope: {
			// Store the Todo model in the scope
			Todo: Todo,
			// A list of all Todos retrieved from LocalStorage
			tobuys: new Todo.List({}),
			// Edit a Todo
			edit: function (tobuy, el) {
				tobuy.attr('editing', true);
				el.parents('.tobuy').find('.edit').focus();
			},
			cancelEditing: function (tobuy, el, e) {
				if (e.which === ESCAPE_KEY) {
					el.val(tobuy.attr('text'));
					tobuy.attr('editing', false);
				}
			},
			// Returns a list of Todos filtered based on the route
			displayList: function () {
				var filter = route.attr('filter');
				return this.tobuys.filter(function (tobuy) {
					if (filter === 'completed') {
						return tobuy.attr('complete');
					}

					if (filter === 'active') {
						return !tobuy.attr('complete');
					}

					return true;
				});
			},
			updateTodo: function (tobuy, el) {
				var value = can.trim(el.val());

				if (value === '') {
					tobuy.destroy();
				} else {
					tobuy.attr({
						editing: false,
						text: value
					});
				}
			},
			createTodo: function (context, el) {
				var value = can.trim(el.val());
				var TodoModel = this.Todo;

				if (value !== '') {
					new TodoModel({
						text: value,
						complete: false
					}).save();

					route.removeAttr('filter');
					el.val('');
				}
			},
			toggleAll: function (scope, el) {
				var toggle = el.prop('checked');
				this.attr('tobuys').each(function (tobuy) {
					tobuy.attr('complete', toggle);
				});
			},
			clearCompleted: function () {
				this.attr('tobuys').completed().forEach(function (tobuy) {
					tobuy.destroy();
				});
			}
		},
		events: {
			// When a new Todo has been created, add it to the tobuy list
			'{Todo} created': function (Construct, ev, tobuy) {
				this.scope.attr('tobuys').push(tobuy);
			}
		},
		helpers: {
			link: function (name, filter) {
				var data = filter ? { filter: filter } : {};
				return route.link(name, data, {
					className: route.attr('filter') === filter ? 'selected' : ''
				});
			},
			plural: function (singular, num) {
				return num() === 1 ? singular : singular + 's';
			}
		}
	});
});
