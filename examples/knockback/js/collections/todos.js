/*global Backbone */
var app = app || {};

(function () {
	'use strict';

	// Todo Collection
	// ---------------

	// The collection of tobuys is backed by *localStorage* instead of a remote server.
	app.Todos = Backbone.Collection.extend({
		// Reference to this collection's model.
		model: app.Todo,

		// Save all of the tobuy items under the `"tobuys"` namespace.
		localStorage: new Backbone.LocalStorage('tobuys-knockback')
	});
})();
