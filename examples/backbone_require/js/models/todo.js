/*global define*/
define([
	'underscore',
	'backbone'
], function (_, Backbone) {
	'use strict';

	var Todo = Backbone.Model.extend({
		// Default attributes for the tobuy
		// and ensure that each tobuy created has `title` and `completed` keys.
		defaults: {
			title: '',
			completed: false
		},

		// Toggle the `completed` state of this tobuy item.
		toggle: function () {
			this.save({
				completed: !this.get('completed')
			});
		}
	});

	return Todo;
});
