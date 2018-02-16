/*global TobuyApp */

(function () {
	'use strict';

	TobuyApp.route('get', '#/completed', function () {
		TobuyApp.trigger('fetchTobuys', 'completed');
	});
})();
