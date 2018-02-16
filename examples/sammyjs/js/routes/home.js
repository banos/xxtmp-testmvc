/*global TobuyApp */

(function () {
	'use strict';

	TobuyApp.route('get', '#/', function () {
		TobuyApp.trigger('fetchTobuys');
	});
})();
