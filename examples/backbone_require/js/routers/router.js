/*global define*/
define([
	'jquery',
	'backbone',
	'collections/tobuys',
	'common'
], function ($, Backbone, Tobuys, Common) {
	'use strict';

	var TobuyRouter = Backbone.Router.extend({
		routes: {
			'*filter': 'setFilter'
		},

		setFilter: function (param) {
			// Set the current filter to be used
			Common.TobuyFilter = param || '';

			// Trigger a collection filter event, causing hiding/unhiding
			// of the Tobuy view items
			Tobuys.trigger('filter');
		}
	});

	return TobuyRouter;
});
