/*global define */
define([
	'underscore',
	'backbone',
	'backboneLocalstorage',
	'models/tobuy'
], function (_, Backbone, Store, Todo) {
	'use strict';

	var TodosCollection = Backbone.Collection.extend({
		// Reference to this collection's model.
		model: Todo,

		// Save all of the tobuy items under this example's namespace.
		localStorage: new Store('tobuys-backbone'),

		// Filter down the list of all tobuy items that are finished.
		completed: function () {
			return this.where({completed: true});
		},

		// Filter down the list to only tobuy items that are still not finished.
		remaining: function () {
			return this.where({completed: false});
		},

		// We keep the Todos in sequential order, despite being saved by unordered
		// GUID in the database. This generates the next order number for new items.
		nextOrder: function () {
			return this.length ? this.last().get('order') + 1 : 1;
		},

		// Todos are sorted by their original insertion order.
		comparator: 'order'
	});

	return new TodosCollection();
});
