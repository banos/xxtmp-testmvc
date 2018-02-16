/*global TobuyApp */

(function () {
	'use strict';

	TobuyApp.route('get', '#/active', function () {
		TobuyApp.trigger('fetchTobuys', 'active');
	});
})();
