/*global Backbone */
var app = app || {};

(function () {
	'use strict';

	// Tobuy Router
	// ----------
	var TobuyRouter = Backbone.Router.extend({
		routes: {
			'*filter': 'setFilter'
		},

		setFilter: function (param) {
			// Set the current filter to be used
			app.TobuyFilter = param || '';

			// Trigger a collection filter event, causing hiding/unhiding
			// of Tobuy view items
			app.tobuys.trigger('filter');
		}
	});

	app.TobuyRouter = new TobuyRouter();
	Backbone.history.start();
})();
